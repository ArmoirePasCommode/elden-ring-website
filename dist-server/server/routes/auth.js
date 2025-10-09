import { Router } from 'express';
import { signToken, validateCredentials } from '../middleware/auth.js';
const router = Router();
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!validateCredentials(username, password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8; // 8h
    const token = signToken({ sub: username || 'guest', exp });
    res.json({ token, exp });
});
export default router;
