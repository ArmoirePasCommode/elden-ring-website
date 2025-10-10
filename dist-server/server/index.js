import express from 'express';
import 'dotenv/config';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import demigodRouter from './routes/demigods.js';
import mediaRouter from './routes/media.js';
import authRouter from './routes/auth.js';
// Initialize Firebase Admin (App Engine default service account or env var JSON)
initializeApp({
    credential: applicationDefault(),
    storageBucket: process.env.GCS_BUCKET,
});
export const db = getFirestore();
export const storage = getStorage();
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
// API
app.use('/api/auth', authRouter);
app.use('/api/demigods', demigodRouter);
app.use('/api/media', mediaRouter);
app.get('/api', (_req, res) => {
    res.json({ ok: true, service: 'elden-ring-backend', routes: ['/api/demigods', '/api/media'] });
});
// Serve static files from dist (resolve from project root)
const distDir = path.resolve(process.cwd(), 'dist');
const staticOptions = {
    setHeaders(res, filePath) {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        else if (filePath.endsWith('.svg')) {
            res.setHeader('Content-Type', 'image/svg+xml');
        }
    },
};
app.use('/assets', express.static(path.join(distDir, 'assets'), staticOptions));
app.use(express.static(distDir, staticOptions));
// SPA fallback
app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});
export default app;
if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}
