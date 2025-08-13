# Replit.md - Brouwerij Noordergloed Kombucha Platform

## Overview

This is a modern e-commerce website for artisanal kombucha and workshop bookings based in Groningen, Netherlands. The application features a product catalog for handmade ginger and berry kombucha, a dedicated workshops page with capacity-managed enrollment system, admin dashboard, email notifications, and responsive design with dark mode support.

**Recent Changes (Jan 2025):**
- Migrated from MemStorage to DatabaseStorage with PostgreSQL for persistent data
- Implemented workshop enrollment system with capacity tracking and "Volgeboekt" status
- Added dedicated /workshops page with workshop registration functionality  
- Restored Chicken Shoyu image for workshop display
- Database seeding automatically creates kombucha products and admin user on first run

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and better development experience
- **Styling**: Tailwind CSS for utility-first styling with shadcn/ui component library
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express-session for admin authentication
- **Email Service**: Gmail SMTP for transactional emails (with fallback Mailjet configuration)

### Database Schema
The application uses PostgreSQL with five main tables:
- **products**: Stores kombucha and workshop product information with stock management
- **orders**: Handles kombucha orders with customer details and delivery information  
- **workshopOrders**: Manages kombucha workshop bookings with date-based scheduling
- **contactMessages**: Stores customer inquiries and feedback
- **adminUsers**: Admin authentication with hashed passwords and role management

## Key Components

### Product Management
- Product catalog with stock indicators and real-time updates
- Dual product types: kombucha (direct purchase) and workshops (booking system)
- Admin CRUD operations for product management
- Stock tracking with low-stock alerts

### Order System  
- **Kombucha Orders**: Direct ordering with customer information and delivery options
- **Workshop Bookings**: Capacity-managed enrollment system (12 spots per workshop)
- **Workshop Registration**: Dedicated /workshops page with name, email, phone collection
- **Capacity Tracking**: Real-time stock updates with "Volgeboekt" status when full
- Order status management (pending, confirmed, completed, cancelled)
- Email confirmations for all order types

### Authentication
- Session-based admin authentication
- Protected admin routes and dashboard
- Role-based access control

### Email Notifications
- Automated customer confirmations
- Admin notifications for new orders
- Ramen event confirmations when minimum capacity reached
- Contact form submissions

## Data Flow

1. **Product Display**: Client fetches products from `/api/products`, displays with real-time stock
2. **Order Placement**: 
   - Syrup orders go to `/api/orders/syrup`
   - Ramen orders go to `/api/orders/ramen`
3. **Email Flow**: Order creation triggers email notifications via Gmail SMTP
4. **Admin Management**: Protected dashboard allows product/order management
5. **Real-time Updates**: TanStack Query handles cache invalidation for live updates

## External Dependencies

### Email Service
- **Primary**: Gmail SMTP (dckessler95@gmail.com) with app password
- **Fallback**: Mailjet API configuration available but not actively used
- Handles order confirmations, admin notifications, and contact submissions

### Database
- **Production**: Neon PostgreSQL serverless database
- **ORM**: Drizzle with type-safe schema definitions
- Connection pooling for efficient database operations

### UI Components
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Underlying primitive components
- **Lucide Icons**: Consistent icon system
- **Google Fonts**: Inter and Playfair Display typography

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild compiles Express server to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `MAILJET_API_KEY` & `MAILJET_SECRET_KEY`: Email service credentials (optional)
- Gmail credentials embedded in code for primary email service

### Production Considerations
- Session secret should be environment-specific in production
- HTTPS required for secure sessions
- Database connection pooling configured for serverless deployment
- Static assets served efficiently with proper caching headers

### Development Workflow
- `npm run dev`: Starts development server with hot reload
- `npm run db:push`: Applies database schema changes
- `npm run build`: Creates production build
- `npm start`: Runs production server

The application is designed for easy deployment on platforms like Replit, with automatic asset serving and proper path resolution for both development and production environments.