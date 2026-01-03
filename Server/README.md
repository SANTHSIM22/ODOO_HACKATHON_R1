# GlobeTrotter Server

Backend API server for the GlobeTrotter travel planning application built with Node.js and Express.

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Server/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── communityController.js
│   │   ├── tripController.js
│   │   └── userTripController.js
│   ├── models/
│   │   ├── CommunityPost.js
│   │   ├── Trip.js
│   │   ├── User.js
│   │   └── UserTrip.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── communityRoutes.js
│   │   ├── tripRoutes.js
│   │   └── userTripRoutes.js
│   ├── db/
│   │   └── connection.js
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── index.js
├── package.json
├── Dockerfile
└── .env
```

## Available Scripts

### Development

```bash
npm run dev          # Start with nodemon (auto-restart)
npm run dev:watch    # Watch src directory for changes
```

### Production

```bash
npm start            # Start production server
npm run start:prod   # Start with production environment
```

### Deployment

```bash
npm run deploy:install # Install production dependencies
npm run deploy:start   # Start production server
```

### Utilities

```bash
npm run build        # No build step (Node.js)
npm run lint         # Linting (not configured)
npm test            # Testing (not configured)
```

## API Endpoints

### Authentication

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/admin       # Admin login
PUT  /api/auth/profile     # Update user profile
```

### Trips

```
GET    /api/trips          # Get all trips
POST   /api/trips          # Create new trip
GET    /api/trips/:id      # Get trip by ID
PUT    /api/trips/:id      # Update trip
DELETE /api/trips/:id      # Delete trip
```

### User Trips

```
GET    /api/user-trips     # Get user's trips
POST   /api/user-trips     # Create user trip
PUT    /api/user-trips/:id # Update user trip
DELETE /api/user-trips/:id # Delete user trip
```

### Community

```
GET    /api/community/posts     # Get community posts
POST   /api/community/posts     # Create new post
PUT    /api/community/posts/:id # Update post
DELETE /api/community/posts/:id # Delete post
```

### Health Check

```
GET /health                # Server health status
```

## Environment Variables

Create a `.env` file in the Server directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/globetrotter
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

## Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**

   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas connection string
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Server will be running on**
   ```
   http://localhost:5000
   ```

## Database Models

### User

- username, email, password (hashed)
- profile information
- authentication timestamps

### Trip

- title, description, destinations
- itinerary details
- created by user

### UserTrip

- User-specific trip data
- Custom modifications
- booking status

### CommunityPost

- User-generated content
- Trip sharing
- Comments and interactions

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- CORS protection
- Input validation
- Security headers in production
- Rate limiting (configurable)

## Error Handling

- Centralized error handling middleware
- Structured error responses
- Logging for debugging
- Graceful error recovery

## Docker Deployment

The server includes a Dockerfile for containerized deployment:

```bash
# Build image
docker build -t globetrotter-server .

# Run container
docker run -p 5000:5000 --env-file .env globetrotter-server
```

## Health Monitoring

Health check endpoint provides:

- Server status
- Environment information
- Timestamp
- Application version

## Production Considerations

- Use environment variables for sensitive data
- Enable MongoDB connection pooling
- Configure proper CORS origins
- Set up logging and monitoring
- Use HTTPS in production
- Regular security updates
