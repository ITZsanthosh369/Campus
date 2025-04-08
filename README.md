# Campus Connect

A web application that unifies college-wide communication with hierarchy-based group access.

## Project Overview

Campus Connect is designed to streamline communication within educational institutions through a structured, hierarchical approach to group management and messaging.

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd campus-connect
   ```

2. **Environment Setup**
   - Create a `.env` file in the root directory
   ```
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   PORT=5000
   NODE_ENV=development
   ```

3. **Install Dependencies**
   ```
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd Frontend
   npm install
   cd ..
   ```

4. **Frontend Setup**
   ```
   # Create React frontend structure
   npm run setup-frontend
   
   # Install additional frontend dependencies
   cd Frontend
   npm install react-router-dom@latest axios@latest
   
   # Optional: Setup Tailwind CSS for styling
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   cd ..
   ```

5. **Run the Application**
   ```
   # Run backend and frontend concurrently
   npm run dev
   
   # Run backend only
   npm run server
   
   # Run frontend only
   npm run client
   ```

6. **Access the Application**
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

## Features
- Hierarchical group management
- Role-based access control
- Real-time messaging
- File sharing
- Event management
- Announcements
- Mobile-responsive UI
- Secure authentication

## Technology Stack
- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend library
- Node.js - Runtime environment
- Tailwind CSS - Styling framework
