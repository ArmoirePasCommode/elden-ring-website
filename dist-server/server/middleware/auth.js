import crypto from 'crypto';
const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'guest';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'guest';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-secret-change-me';
function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}
export function signToken(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerPart = base64url(JSON.stringify(header));
    const payloadPart = base64url(JSON.stringify(payload));
    const data = `${headerPart}.${payloadPart}`;
    const signature = crypto
        .createHmac('sha256', TOKEN_SECRET)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return `${data}.${signature}`;
}
export function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3)
        return null;
    const [headerPart, payloadPart, signature] = parts;
    const data = `${headerPart}.${payloadPart}`;
    const expectedSig = crypto
        .createHmac('sha256', TOKEN_SECRET)
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    if (signature !== expectedSig)
        return null;
    try {
        const payload = JSON.parse(Buffer.from(payloadPart.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
        if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now())
            return null;
        return payload;
    }
    catch {
        return null;
    }
}
export function requireAuth(req, res, next) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({ error: 'Unauthorized' });
    const token = auth.slice('Bearer '.length);
    const payload = verifyToken(token);
    if (!payload)
        return res.status(401).json({ error: 'Unauthorized' });
    req.user = payload.sub;
    next();
}
export function validateCredentials(username, password) {
    return username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD;
}
