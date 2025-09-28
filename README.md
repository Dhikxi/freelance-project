# WorkHive - Freelance Marketplace Web App

## Overview
WorkHive is a MERN stack (MongoDB, Express, React, Node.js) web application connecting clients and freelancers.  
Clients can post projects, hire freelancers, and track progress. Freelancers can create gigs, manage orders, and communicate with clients.

## Features
- **Client:** Browse freelancers, post projects, hire, chat, and pay securely.  
- **Freelancer:** Create/manage gigs, receive project requests, track orders, and chat.  
- **Common:** Authentication, Stripe payments, responsive UI, error handling.

## Technologies
React, Node.js, Express.js, MongoDB, JWT, Stripe, HTML, CSS/SCSS

## Project Structure

client/ # React frontend
server/ # Node.js backend
├─ controllers/ # API logic
├─ models/ # Database schemas
├─ routes/ # API routes
├─ middlewares/ # Auth & error handling
└─ configs/ # Database config


## Setup
1. Clone the repository:  
```bash
git clone https://github.com/your-username/freelance-project.git

    Install dependencies:

cd client && npm install
cd ../server && npm install

    Create .env in server/ with:

PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
STRIPE_KEY=<your_stripe_key>

    Start the app:

# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev
