import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Datastore } from '@google-cloud/datastore';
const datastore = new Datastore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCLOUD_PROJECT ||
        process.env.PROJECT_ID,
});
const router = Router();
const kind = 'Demigod';
function toProxyUrl(url) {
    if (!url)
        return url;
    try {
        const parsed = new URL(url);
        const key = parsed.pathname.startsWith('/') ? parsed.pathname.slice(1) : parsed.pathname;
        if (!key)
            return url;
        return `/api/media/public/${key}`;
    }
    catch {
        return url;
    }
}
router.get('/', async (_req, res) => {
    try {
        const query = datastore.createQuery(kind).order('name');
        const [entities] = await datastore.runQuery(query);
        const items = entities.map((e) => ({
            id: e[datastore.KEY].id,
            ...e,
            mainImageUrl: toProxyUrl(e.mainImageUrl),
        }));
        res.json(items);
    }
    catch (err) {
        console.error('List demigods error:', err);
        res.status(500).json({ error: 'Failed to list demigods' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const key = datastore.key([kind, Number(req.params.id)]);
        const [entity] = await datastore.get(key);
        if (!entity)
            return res.status(404).json({ error: 'Not found' });
        const mainImageUrl = toProxyUrl(entity.mainImageUrl);
        res.json({ id: key.id, ...entity, mainImageUrl });
    }
    catch (err) {
        console.error('Get demigod error:', err);
        res.status(500).json({ error: 'Failed to get demigod' });
    }
});
router.post('/', requireAuth, async (req, res) => {
    const { name, title, description, mainImageUrl } = req.body;
    if (!name)
        return res.status(400).json({ error: 'name is required' });
    try {
        const now = new Date().toISOString();
        const key = datastore.key(kind);
        const data = {
            name,
            title: title ?? null,
            description: description ?? null,
            mainImageUrl: mainImageUrl ?? null,
            createdAt: now,
            updatedAt: now,
        };
        await datastore.save({ key, data });
        res.status(201).json({ id: key.id, ...data });
    }
    catch (err) {
        console.error('Create demigod error:', err);
        res.status(500).json({ error: 'Failed to create demigod' });
    }
});
router.put('/:id', requireAuth, async (req, res) => {
    const { name, title, description, mainImageUrl } = req.body;
    try {
        const key = datastore.key([kind, Number(req.params.id)]);
        const [current] = await datastore.get(key);
        if (!current)
            return res.status(404).json({ error: 'Not found' });
        const now = new Date().toISOString();
        const updated = {
            ...current,
            ...(name !== undefined ? { name } : {}),
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(mainImageUrl !== undefined ? { mainImageUrl } : {}),
            updatedAt: now,
        };
        await datastore.save({ key, data: updated });
        res.json({ id: key.id, ...updated });
    }
    catch (err) {
        console.error('Update demigod error:', err);
        res.status(500).json({ error: 'Failed to update demigod' });
    }
});
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const key = datastore.key([kind, Number(req.params.id)]);
        await datastore.delete(key);
        res.status(204).end();
    }
    catch (err) {
        console.error('Delete demigod error:', err);
        res.status(500).json({ error: 'Failed to delete demigod' });
    }
});
export default router;
