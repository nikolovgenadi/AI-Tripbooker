const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'no access token' });
    }

    // verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'invalid token' });
    }

    // add user to req object
    req.user = user;
    next();
  } catch (error) {
    console.error('auth middleware error:', error);
    return res.status(403).json({ error: 'invalid or expired token' });
  }
};

module.exports = { authenticateToken };
