const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// generate jwt token (from .env file)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'need name, email and password' });
    }

    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'email already taken' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // generate token
    const token = generateToken(user.id);

    // return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'registered successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

// login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      const newLocal = res
        .status(400)
        .json({ error: 'need email and password' });
      return newLocal;
    }

    // find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'wrong email or password' });
    }

    // check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'wrong email or password' });
    }

    // generate token
    const token = generateToken(user.id);

    // return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'logged in successfully',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'something went wrong' });
  }
};

module.exports = {
  register,
  login,
};
