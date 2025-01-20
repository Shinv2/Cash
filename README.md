# Shopping Website

A full-stack e-commerce website built with Angular, NestJS, and PostgreSQL.

## Features

- User Authentication (Login/Register)
- Product Management
- Shopping Cart
- Admin Dashboard
- Responsive Design

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Angular CLI
- NestJS CLI

## Setup Instructions

### Database Setup

1. Install PostgreSQL and create a database:
```bash
psql -U postgres
\i backend/database/init.sql
```

2. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the database credentials

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run start:dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

## Default Admin Account

- Email: admin@example.com
- Password: admin123

## API Documentation

The API documentation is available at `http://localhost:3000/api` when running the backend server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
