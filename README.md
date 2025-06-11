# Bike Rental System

A comprehensive bike rental management system built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Bike inventory management
- Booking system
- Location management
- Accessory and insurance management
- Admin and operator dashboards
- Email notifications
- Reporting system

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bike-rental-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/bikeRentalDB
   JWT_SECRET=your_jwt_secret_here
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_USER=your_email@ethereal.email
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## Database Seeding

To populate the database with initial data:
```bash
npm run seed
```

## API Documentation

The API endpoints are organized into the following groups:

- Authentication (/api/auth)
- User Operations (/api/users)
- Admin Operations (/api/admin)
- Public Data (/api)

Detailed API documentation will be available at /api-docs when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 