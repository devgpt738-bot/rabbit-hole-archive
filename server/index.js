import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { statements } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-classified-key-do-not-share';

app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());

// --- Rate Limiters ---
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per 15 mins (stricter against brute force)
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general API limiter to all /api/ routes
app.use('/api/', apiLimiter);
// Apply strict auth limiter specifically to /api/auth/ routes
app.use('/api/auth/', authLimiter);

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  const { username, password, provider } = req.body; // provider = instagram | telegram | manual
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user with provider (default manual is set by DB schema but we can override or just let it default)
    // Actually our createUser statement only takes 2 args, let's update it in db.js or just create a new statement
    // For simplicity I will just execute an inline query for this if we need to insert auth_provider,
    // Or just use the standard one if they don't care (since I didn't update createUser in db.js)
    // Wait, let's just update the DB directly
    const info = statements.createUser.run(username, hashedPassword);
    
    // We should also set auth_provider, so I will do a manual UPDATE
    if (provider) {
       import('./db.js').then(module => {
          module.default.prepare('UPDATE users SET auth_provider = ? WHERE id = ?').run(provider, info.lastInsertRowid);
       });
    }

    const token = jwt.sign({ id: info.lastInsertRowid, username }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: info.lastInsertRowid, username, score: 0, scrolling_time_seconds: 0, reading_time_seconds: 0, auth_provider: provider || 'manual' } });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  
  try {
    const user = statements.getUserByUsername.get(username);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, score: user.score, scrolling_time_seconds: user.scrolling_time_seconds, reading_time_seconds: user.reading_time_seconds, auth_provider: user.auth_provider } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// OTP Verification Endpoint (Mock)
app.post('/api/auth/otp-verify', async (req, res) => {
  const { identifier, provider, username } = req.body;
  if (!identifier || !provider || !username) return res.status(400).json({ error: 'Missing fields' });

  try {
    let user = statements.getUserByUsername.get(username);
    
    if (!user) {
      // User doesn't exist, create them
      // We will use the identifier as a dummy password hash just to satisfy the schema for this mock
      const salt = await bcrypt.genSalt(10);
      const dummyPassword = await bcrypt.hash(identifier, salt);
      const info = statements.createUser.run(username, dummyPassword);
      
      import('./db.js').then(module => {
         module.default.prepare('UPDATE users SET auth_provider = ? WHERE id = ?').run(provider, info.lastInsertRowid);
      });
      
      user = { id: info.lastInsertRowid, username, score: 0, scrolling_time_seconds: 0, reading_time_seconds: 0, auth_provider: provider };
    }
    
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PROTECTED USER ROUTES ---

app.get('/api/user/me', authenticateToken, (req, res) => {
  try {
    const user = statements.getUserById.get(req.user.id);
    const bookmarksRows = statements.getUserBookmarks.all(req.user.id);
    const readHistoryRows = statements.getUserReadHistory.all(req.user.id);
    
    res.json({
      user,
      bookmarks: bookmarksRows.map(row => row.theory_id),
      readHistory: readHistoryRows.map(row => row.theory_id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/bookmark', authenticateToken, (req, res) => {
  const { theoryId, bookmarked } = req.body;
  if (!theoryId) return res.status(400).json({ error: 'theoryId required' });
  
  try {
    if (bookmarked) {
      statements.addBookmark.run(req.user.id, theoryId);
    } else {
      statements.removeBookmark.run(req.user.id, theoryId);
    }
    res.json({ success: true, bookmarked });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.json({ success: true, bookmarked: true }); // Already bookmarked
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/read', authenticateToken, (req, res) => {
  const { theoryId } = req.body;
  if (!theoryId) return res.status(400).json({ error: 'theoryId required' });
  
  try {
    // Try to add to read history (will fail safely if already read due to UNIQUE constraint)
    statements.addReadHistory.run(req.user.id, theoryId);
    
    // If successful, increase score by 10
    statements.updateUserScore.run(10, req.user.id);
    
    const updatedUser = statements.getUserById.get(req.user.id);
    res.json({ success: true, newScore: updatedUser.score });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      // Already read, do not increase score again
      const user = statements.getUserById.get(req.user.id);
      return res.json({ success: true, newScore: user.score, alreadyRead: true });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/sync-time', authenticateToken, (req, res) => {
  const { scrollingTimeDelta, readingTimeDelta } = req.body;
  
  try {
    statements.updateUserTime.run(scrollingTimeDelta || 0, readingTimeDelta || 0, req.user.id);
    const updatedUser = statements.getUserById.get(req.user.id);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Sync time error', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- ANALYTICS ROUTES ---

app.post('/api/analytics/track', async (req, res) => {
  try {
    // 1. Get IP (for localhost, generate a mock public IP for testing)
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }

    // 2. Parse User Agent for OS and Threat Score
    const userAgent = req.headers['user-agent'] || '';
    let os = 'Unknown';
    let device = 'Desktop';
    let threatScore = 0;

    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux') && !userAgent.includes('Android')) {
      os = 'Linux';
      threatScore = 5; // The rule: Linux = 5/10 threat
    }
    else if (userAgent.includes('Android')) {
      os = 'Android';
      device = 'Mobile';
    }
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS';
      device = 'Mobile';
    }

    // 3. Geolocation (Mock via free API - usually requires ip-api.com or similar)
    // For this prototype, we'll fetch real data using the generated mock IP
    let country = 'Unknown';
    let city = 'Unknown';
    try {
       const geoResponse = await fetch(`http://ip-api.com/json/${ip}`);
       const geoData = await geoResponse.json();
       if (geoData.status === 'success') {
         country = geoData.country;
         city = geoData.city;
       }
    } catch (e) {
       console.error("Geo fetch failed", e);
    }

    // 4. Log to database
    statements.logVisitor.run(ip, os, device, country, city, threatScore);
    
    // 5. Return data so frontend can show alert if threat score is high
    res.json({ success: true, threatScore, os });
  } catch (error) {
    console.error('Tracking error', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Classified Backend running on port ${PORT}`);
});
