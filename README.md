🧠 SwapSkill Marketplace
A Modern Skill-Sharing Platform Built for the Future of Learning

Live Project: https://swap-skill-marketplace.vercel.app/

🌍 Overview

SwapSkill Marketplace is a community-driven web platform where users can share, learn, and trade skills seamlessly.
It features real-time chat, AI chatbot, gamification, secure payments, and an admin analytics dashboard, creating a complete, interactive learning ecosystem.

👥 Team

Team Name: Six Sparks

Team Lead: Khayer Hossain

Team Members: Tomal, Sabit, Masud, Ariful, Suborna

🚀 Core Features
🧑‍💻 User Features

Authentication with Google and Email/Password (NextAuth + JWT)

Dark/Light mode support

Skill marketplace with browse, filter, and sort functionality

Real-time chat between learners and providers (Socket.io)

Booking & scheduling system with calendar view

Payment integration via Stripe and SSLCommerz

Gamified learning — earn quizzes, badges, and points

Verified badge system for trusted skill providers

Resource page to share and access learning materials

Community feed with infinite scroll

User AppBar showing subscription, progress, and activities

AI Chatbot for user support and FAQs

🧑‍💼 Admin Features

Skill approval/rejection with feedback

User & subscription management

Payment and transaction monitoring

Community moderation tools

Analytics dashboard with insights on users, revenue, and engagement

⚙️ System Modules
Module	Description
Landing Page	10 sections (hero, about, skills, testimonials, footer, etc.)
Authentication	Google & email-based login system
Profile Management	Manage teaching & learning preferences
Skill Marketplace	Explore and filter skills
Community Feed	User discussions and posts
Chat System	Real-time chat between learners & providers
Payment System	Secure transactions (Stripe + SSLCommerz)
Quiz & Gamification	Earn badges and points through quizzes
Resource Page	Central hub for learning materials
AI Chatbot	AI-based help assistant
Admin Dashboard	Manage users, skills, and analytics
📋 Functional Requirements

NextAuth + JWT authentication

Skill browsing, filtering, searching

Skill posting (title, price, description, category)

Subscription required for booking and posting

Real-time chat with Socket.io

Payments via Stripe & SSLCommerz

Gamification system with quizzes and badges

Feedback and review system

Admin panel with analytics and reports

🧩 Non-Functional Requirements

Performance: Pages load within 3–5 seconds

Security: SSL encryption + JWT protection

Scalability: Handles large user base and concurrent chats

Usability: Fully responsive + dark/light theme

Reliability: 99.9% uptime

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js (React), Tailwind CSS, Framer Motion, ShadCN/UI
Backend	Node.js, Express.js
Database	MongoDB + Mongoose
Auth	NextAuth, JWT
Real-Time	Socket.io / WebSocket
Payments	Stripe, SSLCommerz
Deployment	Vercel (Frontend), Render/Heroku (Backend), MongoDB Atlas
AI	OpenAI API / Custom AI Model (Chatbot)
✨ Unique Highlights

Fully responsive, modern UI with 10+ landing page sections

Subscription-based access & role-based privileges

Gamified learning (points, badges, rewards)

Verified provider system (admin approval)

Real-time communication (Socket.io)

Integrated AI chatbot for user help

Admin analytics dashboard

Community feed with infinite scroll

Resource-sharing for collaboration

Dual payment gateways (Stripe & SSLCommerz)

🔮 Future Roadmap

AI-based personalized skill recommendations

Smart event scheduling & notifications

In-depth analytics on user learning behavior

Mobile app development

Voice-based AI assistant integration

⚙️ Installation & Setup
# Clone the repository
git clone https://github.com/khayerhossain/swap-skill-marketplace.git

# Navigate to the directory
cd swap-skill-marketplace

# Install dependencies
npm install

Create a .env file
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_url
STRIPE_SECRET_KEY=your_stripe_key
SSL_STORE_ID=your_ssl_store_id
SSL_STORE_PASS=your_ssl_store_pass
OPENAI_API_KEY=your_ai_key

Run the development server
npm run dev

👨‍💻 Contributors
Name	Role
Khayer Hossain	Team Lead / Fullstack Developer
Tomal	Frontend Developer
Sabit	Backend Developer
Masud	UI/UX Designer
Ariful	QA & Integration
Suborna	Documentation & Testing
🏁 Conclusion

SwapSkill Marketplace represents the next generation of skill-sharing, combining AI, gamification, and real-time collaboration.
It’s built to make learning and teaching more interactive, secure, and community-driven — delivering a complete experience for both learners and instructors.
