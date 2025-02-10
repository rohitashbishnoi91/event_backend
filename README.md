# Event Management Platform - Backend

This repository contains the backend API for the Event Management Platform. It includes secure user authentication, event management functionality, real-time updates, and efficient database handling.

## Features

1. **Authentication API:**
   - Uses JWT for secure user authentication.
   - Supports user registration, login, and guest login functionality.

2. **Event Management API:**
   - CRUD operations for event creation, updating, viewing, and deletion.
   - Event ownership restrictions to ensure only the creator can modify an event.

3. **Real-Time Updates:**
   - WebSockets are used to provide real-time updates on attendee counts for each event.

4. **Database:**
   - Stores event and user data efficiently in MongoDB or Planetscale.

## Tech Stack

- **Node.js** for the backend runtime
- **Express** for building REST APIs
- **JWT** for authentication
- **WebSockets** for real-time communication
- **MongoDB Atlas** or **Planetscale** for database storage
- **Cloudinary** for image hosting (optional, based on feature implementation)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <backend-repo-url>
   cd <backend-repo-folder>
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the root of the project and add the necessary environment variables:



JWT_SECRET=<your-jwt-secret>
MONGODB_URI=<your-mongodb-uri> or PLANETSCALE_URI=<your-planetscale-uri>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name> (if using Cloudinary for image hosting)
Run the backend server:


npm start
The API will be running at http://localhost:5000.

Deployment
Backend Hosting: Deployed on Render or Railway for free hosting.

Database: Uses MongoDB Atlas or Planetscale for database hosting.
