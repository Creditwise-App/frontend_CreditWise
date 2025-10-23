# CreditWise Nigeria

CreditWise Nigeria is a financial literacy platform designed to help Nigerian users understand, manage, and improve their credit scores. The application provides educational content, personalized debt repayment strategies, and progress tracking tools to empower users on their journey to financial freedom.

## Project Overview

CreditWise Nigeria is a React-based web application built with TypeScript, utilizing Vite as the build tool. The application follows a modern component-based architecture with a clear separation of concerns between UI components, business logic, and data management.

### Key Features

1. **User Authentication & Authorization**
   - User registration and login functionality
   - Role-based access control (User vs Admin)
   - Persistent sessions using localStorage

2. **Educational Content**
   - Interactive lessons on credit score fundamentals
   - Quizzes to reinforce learning
   - Credit improvement tips and strategies

3. **Financial Tools**
   - Personalized debt repayment calculators
   - Credit score tracking and visualization
   - Goal setting and progress monitoring

4. **Administrative Dashboard**
   - User analytics and engagement metrics
   - Content management capabilities
   - Appointment scheduling system

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **State Management**: React Context API

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/          # Page layouts (Dashboard, Main)
│   └── ui/              # Basic UI elements (Button, Card, Input)
├── context/             # React context providers for state management
├── pages/               # Page components organized by user role
│   ├── admin/           # Admin-specific pages
│   └── user/            # User-specific pages
├── services/            # API service layer for backend communication
├── App.tsx             # Main application component with routing
└── main.tsx            # Application entry point
```

### Core Functionality

#### User Experience
- Users can register/login to access personalized financial tools
- Educational modules teach credit score fundamentals through interactive lessons
- Dashboard displays current credit score, progress tracking, and improvement tips
- Debt repayment calculator helps users create personalized financial plans

#### Administrative Features
- Admin dashboard with user analytics and engagement metrics
- Content management system for lessons and quizzes
- Appointment scheduling for one-on-one financial counseling
- Data visualization tools for monitoring platform performance

## Backend API

The backend is built with Node.js, Express, and MongoDB. It provides a RESTful API for all frontend functionality.

### Backend Structure

```
backend/
├── controllers/         # Request handlers
├── models/              # Database models
├── routes/              # API route definitions
├── middleware/          # Authentication and other middleware
├── config/              # Configuration files
├── server.js           # Main server file
└── seeder.js           # Database seeding script
```

### API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Lessons**: `/api/lessons`
- **Quizzes**: `/api/quizzes`
- **Tips**: `/api/tips`
- **Appointments**: `/api/appointments`
- **Admin**: `/api/admin/*`

### Setting Up the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up MongoDB:
   - Install MongoDB locally or use a cloud service like MongoDB Atlas
   - Update the `MONGODB_URI` in the `.env` file

4. Run the database seeder to populate initial data:
   ```
   node seeder.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

### Research Insights

Based on analysis of the codebase, CreditWise Nigeria addresses a significant need in the Nigerian financial landscape where credit scoring systems are less understood compared to Western countries. The application focuses on:

1. Educating users about Nigeria's credit bureau system (CRC Credit Bureau, CR Services, XDS Credit Bureau)
2. Providing actionable strategies for credit improvement specific to the Nigerian context
3. Offering financial planning tools tailored to local economic conditions
4. Gamifying the credit improvement journey with badges and progress tracking

The application demonstrates thoughtful consideration of role-based access, responsive design, and user engagement through visual progress indicators and personalized recommendations.