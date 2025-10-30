---
description: Repository Information Overview
alwaysApply: true
---

# Waari NodeJS Backend Application

## Summary
Waari is a comprehensive Node.js/Express backend application for tour and travel management. It integrates with Supabase and MySQL databases, provides real-time communication via Socket.io, generates PDF documents, and manages enquiries, bookings, and billing for group tours, custom tours, and individual packages.

## Project Structure
- **server.js**: Main application entry point, Express server setup with Socket.io
- **src/config/**: Application configuration files (database, auth, mail, etc.)
- **src/routes/**: API route handlers for various modules
- **src/controllers/**: Business logic controllers for different features
- **src/models/**: Database models (User, Tour, Enquiry, GroupTour, etc.)
- **src/middleware/**: Custom middleware for authentication, validation, error handling
- **src/services/**: Reusable service modules (auth, broadcast, event handling)
- **src/cron/**: Scheduled jobs for automated tasks (feedback requests, reminders, PDF generation)
- **src/database/**: Database migrations, factories, and seeders
- **src/views/**: EJS templates for email and PDF rendering
- **src/utils/**: Utility functions (PDF generation, email notifications)

## Language & Runtime
**Language**: JavaScript
**Node.js Version**: v22.14.0
**Build System**: npm scripts
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- **express** (v5.1.0): Web framework and routing
- **socket.io** (v4.8.1): Real-time bidirectional communication
- **mysql2** (v3.14.4): MySQL database with promise support
- **@supabase/supabase-js** (v2.55.0): Supabase client library
- **jsonwebtoken** (v9.0.2): JWT authentication and token management
- **bcrypt** (v6.0.0): Password hashing and security
- **express-validator** (v7.2.1): Input validation middleware
- **multer** (v2.0.2): File upload handling
- **puppeteer** (v24.16.1): Browser automation for PDF generation
- **nodemailer** (v7.0.5): Email sending functionality
- **ejs** (v3.1.10): Templating engine for views
- **moment**, **dayjs**: Date and time manipulation
- **axios**: HTTP client for API calls
- **joi** (v18.0.1): Data validation schema
- **cors** (v2.8.5): Cross-Origin Resource Sharing
- **morgan** (v1.10.1): HTTP request logger
- **dotenv** (v17.2.1): Environment variable management

**Development Dependencies**:
- **jest** (v30.0.5): Testing framework
- **nodemon** (v3.1.10): Development server auto-restart

## Build & Installation
`ash
npm install
npm start
`

**Environment Setup**: Copy .env file with database credentials, Supabase keys, JWT secret, and email configuration.

## Database Configuration
**Connection**: MySQL (Primary) + Supabase (PostgreSQL alternative)
**Host**: 127.0.0.1 (development)
**Database**: new_waari
**Connection Pool**: 10 connections max

**Models**:
- User, Userdetail (authentication and profiles)
- Tour, GroupTour (tour offerings)
- Enquiry, Enquirygrouptour, TaylorMadeJourneyEnq (customer inquiries)
- CallFollowUpGt, CallFollowUpCt (call tracking)
- CancellationPolicy, CancelRefundCt (refund management)
- Category, Permission, Lists (master data)

## Main Entry Points
**Server**: server.js (Port 3000)
**Routes**: 20+ route modules including:
- /api/auth: Authentication endpoints
- /api/operations: Operational management
- /api/billing: Billing and invoicing
- /api/tours: Tour management
- /api/enquiries: Enquiry handling
- /api/pdf: PDF generation
- /api/admin: Admin panel endpoints
- /api/reports: Reporting endpoints

## Features
- **Authentication**: JWT-based with bcrypt password hashing
- **Real-time Communication**: Socket.io with authenticated connections
- **PDF Generation**: Dynamic invoice, receipt, and travel documents
- **Email Notifications**: Nodemailer integration for transactional emails
- **Cron Jobs**: Automated feedback requests, pre-departure messages, PDF generation, loyalty updates
- **File Uploads**: Multer integration for image and document handling
- **API Validation**: Express-validator and Joi schemas
- **CORS Support**: Configurable cross-origin requests

## Key Technologies
- Express.js for HTTP server and routing
- Socket.io for WebSocket communication
- MySQL2 with promise support for database
- Supabase for cloud PostgreSQL alternative
- Puppeteer for PDF generation
- EJS templating for dynamic documents
- JWT and bcrypt for security

## Environment Variables
- APP_NAME, APP_ENV, PORT: Application settings
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS: MySQL credentials
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY: Supabase configuration
- JWT_SECRET: JWT signing key
- MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD: Email configuration
- HUGGINGFACE_API_KEY, HUGGINGFACE_MODEL: AI model integration
- CLIENT_ORIGIN: Frontend origin for CORS

## Notes
- Testing framework (Jest) is configured but no tests are currently implemented
- Application uses both MySQL and Supabase configurations for flexibility
- Extensive middleware for authentication, validation, and error handling
- Cron jobs handle automated business processes
- Static files served from /uploads and /pdfs directories
