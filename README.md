# GlobeTrotter - Travel Planning Application

A comprehensive travel planning application built with React and Node.js that allows users to create, manage, and share travel itineraries.

## Live Deployment

**Application URL:** https://odoo-hackathon-r1-3.onrender.com/

**Demo Video:** https://drive.google.com/drive/folders/1lrSrwbaGyIP6d89t5buTV7VrfHmBd4Jj

## Project Structure

```
ODOO_HACKATHON_R1/
├── Client/          # React frontend application
├── Server/          # Node.js backend API
├── docker-compose.yml
├── docker-compose.prod.yml
└── deploy.sh
```

## Features

- User authentication and authorization
- Trip planning and itinerary management
- Community features for sharing travel experiences
- Responsive design for mobile and desktop
- Real-time data synchronization

## Technology Stack

### Frontend

- React 19.2.0
- Vite (Build tool)
- Tailwind CSS
- React Router DOM
- Lucide React (Icons)

### Backend

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing
- CORS enabled

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/SANTHSIM22/ODOO_HACKATHON_R1.git
cd ODOO_HACKATHON_R1
```

2. Install dependencies

```bash
# Install client dependencies
cd Client
npm install

# Install server dependencies
cd ../Server
npm install
```

3. Configure environment variables

```bash
# In Server directory, create .env file
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

4. Start the application

```bash
# Start server (from Server directory)
npm run dev

# Start client (from Client directory)
npm run dev
```

## Deployment

The application is deployed using Docker containers on Render.com with the following services:

- Frontend: Static site deployment
- Backend: Web service with MongoDB Atlas

## Docker Deployment

Use the provided Docker Compose files for containerized deployment:

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```
