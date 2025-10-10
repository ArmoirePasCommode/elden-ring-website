import { Router } from 'express';
// Switched images to AWS S3 (kept Firestore/Datastore for metadata linking)
// import { storage } from '../index.js';
import { requireAuth } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { Datastore } from '@google-cloud/datastore';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
const router = Router();
const datastore = new Datastore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT ||
        process.env.PROJECT_ID,
});
// AWS S3 client configuration
const s3 = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    credentials: process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined,
});
const S3_BUCKET = process.env.S3_BUCKET;
// Upload main picture and optionally link to a demigod by id
router.post('/main-picture', requireAuth, async (req, res) => {
    try {
        const { base64, filename, contentType, demigodId } = req.body;
        if (!base64)
            return res.status(400).json({ error: 'base64 is required' });
        const id = uuidv4();
        const nameOnly = (filename || '').replace(/[^a-zA-Z0-9._-]/g, '_');
        const safeName = nameOnly || `main-${id}.jpg`;
        // Append UUID to key to avoid stale CDN/browser cache when re-uploading same name
        const key = `main/${id}-${safeName}`;
        const buffer = base64.startsWith('data:')
            ? Buffer.from(base64.split(',')[1], 'base64')
            : Buffer.from(base64, 'base64');
        if (!S3_BUCKET)
            return res.status(500).json({ error: 'S3_BUCKET not configured' });
        await s3.send(new PutObjectCommand({
            Bucket: S3_BUCKET,
            Key: key,
            Body: buffer,
            ContentType: contentType || 'image/jpeg',
            // ACL removed to support buckets with Object Ownership: Bucket owner enforced
            CacheControl: 'public, max-age=31536000',
        }));
        // Public URL using virtual-hosted–style URL
        const region = process.env.S3_REGION || 'us-east-1';
        const publicUrl = region === 'us-east-1'
            ? `https://${S3_BUCKET}.s3.amazonaws.com/${key}`
            : `https://${S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
        if (demigodId) {
            const idNum = Number(demigodId);
            if (!Number.isNaN(idNum)) {
                const key = datastore.key(['Demigod', idNum]);
                const [entity] = await datastore.get(key);
                if (entity) {
                    const updated = {
                        ...entity,
                        mainImageUrl: publicUrl,
                        updatedAt: new Date().toISOString(),
                    };
                    await datastore.save({ key, data: updated });
                }
            }
        }
        res.status(201).json({ url: publicUrl, filename: safeName });
    }
    catch (e) {
        console.error('Upload main picture error:', e);
        res.status(500).json({ error: 'Failed to upload main picture' });
    }
});
export default router;
// Public proxy to serve objects from a private bucket
router.get('/public/*', async (req, res) => {
    try {
        const key = req.params[0];
        if (!key || !S3_BUCKET)
            return res.status(404).end();
        const cmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
        const obj = await s3.send(cmd);
        // Forward content-type if available
        const contentType = obj.ContentType || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);
        // @ts-ignore - obj.Body is a stream in Node
        obj.Body.pipe(res);
    }
    catch (e) {
        if (e?.$metadata?.httpStatusCode === 404)
            return res.status(404).end();
        console.error('Proxy media error:', e);
        res.status(500).json({ error: 'Failed to proxy media' });
    }
});
