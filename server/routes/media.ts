import { Router } from 'express';
import { storage } from '../index.js';
import { v4 as uuidv4 } from 'uuid';
import { Datastore } from '@google-cloud/datastore';

const router = Router();
const datastore = new Datastore({
  projectId:
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    process.env.PROJECT_ID,
});

// Upload main picture and optionally link to a demigod by id
router.post('/main-picture', async (req, res) => {
  try {
    const { base64, filename, contentType, demigodId } = req.body as {
      base64: string; // Data URL or raw base64
      filename?: string;
      contentType?: string;
      demigodId?: string;
    };
    if (!base64) return res.status(400).json({ error: 'base64 is required' });

    const bucket = storage.bucket();
    const id = uuidv4();
    const safeName = filename?.replace(/[^a-zA-Z0-9._-]/g, '_') || `main-${id}.jpg`;
    const file = bucket.file(`main/${safeName}`);

    const buffer = base64.startsWith('data:')
      ? Buffer.from(base64.split(',')[1], 'base64')
      : Buffer.from(base64, 'base64');

    await file.save(buffer, {
      contentType: contentType || 'image/jpeg',
      resumable: false,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Make public URL (requires bucket uniform access public or signed URL policy)
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

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
          } as any;
          await datastore.save({ key, data: updated });
        }
      }
    }

    res.status(201).json({ url: publicUrl, filename: safeName });
  } catch (e) {
    console.error('Upload main picture error:', e);
    res.status(500).json({ error: 'Failed to upload main picture' });
  }
});

export default router;


