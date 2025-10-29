
SwapSkill Marketplace

A Modern Skill-Sharing Platform Built for the Future of Learning

Live Project: https://swap-skill-marketplace.vercel.app

Overview:
SwapSkill Marketplace is a web-based skill-sharing platform where users can share, learn, and trade skills in a community-driven environment.
It includes real-time chat, AI chatbot, gamification, secure payments, and an admin analytics dashboard — making it a complete, real-world learning ecosystem.

Team

Team Name: Six Sparks
Team Lead: Khayer Hossain
Team Members: Tomal, Sabit, Masud, Ariful, Suborna

Core Features
User Features

Authentication using Google and Email/Password (NextAuth + JWT)

Dark/Light mode support

Skill Marketplace with browse, filter, and sort functionality

Real-time chat using Socket.io between learners and providers

Booking and scheduling system with calendar view

Payment integration with Stripe and SSLCommerz

Gamified learning with quizzes, badges, and points

Verified badge system for trusted skill providers

Resource page to share and access useful learning materials

Community feed with infinite scroll

User AppBar showing subscription, progress, and activity overview

AI Chatbot for user assistance and FAQs

Admin Features

Skill approval/rejection with feedback

User and subscription management

Payment and transaction monitoring

Community moderation tools

Analytics dashboard with insights on users, revenue, and engagement

System Modules
Module Description
Landing Page 10 sections including hero, about, skills, testimonials, and footer
Authentication Google and email-based login system
Profile Management Manage teaching and learning preferences
Skill Marketplace Explore and filter available skills
Community Discussion and post feed for user interaction
Chat System Real-time learner–provider chat
Payment System Secure transactions with Stripe and SSLCommerz
Quiz & Gamification Earn points and badges through quizzes
Resource Page Central hub for learning resources
AI Chatbot Intelligent assistant for user help
Admin Dashboard Manage users, skills, analytics, and content
Functional Requirements

Authentication with NextAuth and JWT

Skill browsing, filtering, and searching

Skill posting with details (title, price, description, category)

Subscription requirement for bookings and posts

Real-time chat using Socket.io

Payments via Stripe and SSLCommerz

Gamification with quizzes and badge systems

Feedback and review management

Admin control panel with analytics and reports

Non-Functional Requirements

Performance: Page load within 3–5 seconds

Security: SSL encryption and JWT protection

Scalability: Support large user base and concurrent chats

Usability: Fully responsive with dark/light theme

Reliability: 99.9% uptime

Tech Stack
Layer Technology
Frontend Next.js (React), Tailwind CSS, Framer Motion, ShadCN/UI
Backend Node.js, Express.js
Database MongoDB with Mongoose
Authentication NextAuth, JWT
Real-Time Communication Socket.io / WebSocket
Payment Stripe, SSLCommerz
Deployment Vercel (Frontend), Render/Heroku (Backend), MongoDB Atlas
AI Integration OpenAI API or Custom AI Model (Chatbot)
Unique Highlights

Responsive and modern UI with 10+ landing page sections

Subscription-based access and role-based privileges

Gamified learning with points, badges, and rewards

Verified provider system with admin approval

Real-time communication between users

Integrated AI chatbot for assistance

Analytics dashboard for admins

Community feed with infinite scroll

Resource-sharing module for collaboration

Dual payment gateways (Stripe and SSLCommerz)

Future Roadmap

AI-based personalized skill recommendations

Smart event scheduling and notifications

In-depth user learning analytics

Mobile application version

Voice-based AI assistant integration

Installation & Setup

Clone the repository

git clone https://github.com/khayerhossain/swap-skill-marketplace.git

Navigate to the project directory

cd swap-skill-marketplace

Install dependencies

npm install

Create a .env file and configure environment variables

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_url
STRIPE_SECRET_KEY=your_stripe_key
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASS=your_ssl_store_pass
OPENAI_API_KEY=your_ai_key

Run the development server

npm run dev

Contributors
Name Role
Khayer Hossain Team Lead / Fullstack Developer
Tomal Frontend Developer
Sabit Backend Developer
Masud UI/UX Designer
Ariful QA & Integration
Suborna Documentation & Testing
Conclusion

SwapSkill Marketplace is a next-generation skill-sharing ecosystem designed to make learning and teaching more interactive, secure, and community-driven.
With real-time chat, verified badges, gamified learning, AI assistance, and detailed admin analytics, it delivers a complete experience for both learners and instructors.
