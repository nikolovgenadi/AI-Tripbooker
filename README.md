# **DOKUMENTATION FINNS I Dokumentation.md inuti root mappen**

# **AI TripBooker - Intelligent Travel Planning Service**

# Before cloning this repo, make sure you have:

Node.js v18 or higher
npm
Git

Quickstart in terminal:

# 1

git clone https://github.com/nikolovgenadi/Backend-TripBooker.git
cd Backend-TripBooker

# 2

cd server

# 3 install dependencies

npm install

# Set up environment variables (server won't work otherwise)

# Create a file .env with your database credentials (see Environment Setup section)

# Generate Prisma client

npx prisma generate

# Push database schema (creates tables)

npx prisma db push

# Start the backend server

npm start

Backend will run on: `http://localhost:3001`

# 3 Frontend Setup

# Navigate to client directory (from root)

cd client

# Install dependencies

npm install

# Start the frontend development server

npm run dev

# Frontend will run on: `http://localhost:5173`

# Environment Setup

# Backend Environment Variables (`server/.env`)

Create a `.env` file in the `server` directory with these variables
(refer to .env.example for demonstration):

# Database URL (PostgreSQL on Render.com)

DATABASE_URL="postgresql://username:password@host/database"

# JWT Secret (generate a secure random string)

JWT_SECRET="your-super-secure-jwt-secret-key-here"

# Server Port

PORT=3001

# To generate a JWT secret (in terminal):

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))

# Database Setup (Render.com)

1. Create account at `https://render.com`
2. Create new PostgreSQL database
3. Copy the connection string to your `.env` file
4. Run `npx prisma db push` to create tables

# API Endpoints (if you want to test them, there's also a folder `Screenshots_APItests` with all endpoints tested using Postman)

# Authentication (No auth required)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

# Health Check

- `GET /api/health` - Server status

# Bookings (Requires authentication)

- `POST /api/bookings` - Create new booking
- `GET /api/bookings/my` - Get user's bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

# Testing with Postman

# 1. Register User

POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
"name": "Test User",
"email": "test@example.com",
"password": "password123"
}

# 2. Login User\*

POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
"email": "test@example.com",
"password": "password123"
}

# 3. Create Booking (Use token from login)

POST http://localhost:3001/api/bookings
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
"packageId": "experience-1",
"packageTitle": "Mountain Adventure",
"packagePrice": 299.99,
"duration": "3 days",
"travelDate": "2024-12-15"
}

# Development Commands

# Backend Commands

cd server
npm start # Start production server
npm run dev # Start with nodemon (auto-restart)
npx prisma generate # Generate Prisma client
npx prisma db push # Push schema to database
npx prisma studio # Open database GUI

# Frontend Commands

cd client
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build

# Security Features

- JWT Authentication - Secure token-based auth
- Password Hashing - bcrypt with salt rounds
- CORS Protection - Cross-origin request handling
- Input Validation - Server-side validation
- SQL Injection Protection - Prisma ORM prevents SQL injection

# Troubleshooting

# Common Issues:

1. "Cannot connect to database"

- Check your `DATABASE_URL` in `.env`
- Ensure Render.com database is active
- Run `npx prisma db push` to sync schema

2. "JWT token invalid"

- Check `JWT_SECRET` in `.env`
- Ensure token format: `Bearer YOUR_TOKEN`
- Token expires after 7 days

3. "Prisma client not found"

- Run `npx prisma generate`
- Restart the server

4. "Port already in use"

- Change `PORT` in `.env`
- Kill existing Node processes

# Sources (many used, but these were most helpful):

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vue.js 3 Documentation](https://vuejs.org/)
- [JWT Authentication Guide](https://jwt.io/)
- [ChatGPT](https://chatgpt.com/)
- [Tons of it :D Google Search](https://google.com)
- [OpenAI documentation](https://platform.openai.com/docs/quickstart)

# I've used ChatGPT AI to help with the project:

- Troubleshooting/Error handling
- File structure
- Planning/Recommendations
- Some code parts
- README.md
- Settings
