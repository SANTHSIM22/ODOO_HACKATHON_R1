# GlobeTrotter Client

Frontend application for the GlobeTrotter travel planning platform built with React and Vite.

## Technology Stack

- **React** 19.2.0 - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** 7.11.0 - Client-side routing
- **Lucide React** - Icon library

## Project Structure

```
Client/
├── public/
│   └── assets/
│       └── images/
├── src/
│   ├── components/
│   │   ├── AdminLogin.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── layout/
│   │       ├── AnimatedBackground.jsx
│   │       ├── Footer.jsx
│   │       └── Navbar.jsx
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx
│   │   ├── AdminLoginPage.jsx
│   │   ├── CitySearchPage.jsx
│   │   ├── CommunityPage.jsx
│   │   ├── CreateTripPage.jsx
│   │   ├── CustomTripPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ItineraryViewPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyTripsPage.jsx
│   │   ├── PlanTripPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── TripDetailPage.jsx
│   │   └── UserProfilePage.jsx
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── nginx.conf
└── Dockerfile
```

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run preview      # Preview production build
npm run serve        # Serve build on port 4173
```

### Build

```bash
npm run build        # Build for production
npm run build:prod   # Build with production mode
npm run deploy:build # Clean and build for deployment
npm run clean        # Remove dist directory
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

## Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:5173
   ```

## Build Configuration

### Vite Configuration

- React SWC plugin for fast refresh
- Automatic JSX transformation
- Hot module replacement (HMR)

### Tailwind CSS

- Utility-first CSS framework
- Custom configuration for design system
- PostCSS integration

### ESLint

- JavaScript linting
- React-specific rules
- Auto-fix capabilities

## Environment Variables

Create a `.env.local` file in the Client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Docker Deployment

The client includes a Dockerfile for containerized deployment:

```bash
# Build image
docker build -t globetrotter-client .

# Run container
docker run -p 80:80 globetrotter-client
```

## Production Build

The production build:

- Minifies JavaScript and CSS
- Optimizes images and assets
- Generates service worker for caching
- Outputs to `dist/` directory

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
