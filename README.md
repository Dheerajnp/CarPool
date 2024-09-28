

# CarPool

CarPool is a ride-sharing application designed to make commuting more enjoyable and affordable. This project consists of both a frontend and a backend, built using modern web technologies.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- User Authentication (Signup, Login, Forgot Password)
- Profile Management
- Ride Creation and Search
- Real-time Chat between Riders and Drivers
- Document Upload and Verification
- Payment Integration
- Notifications

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Formik & Yup (for form handling and validation)
- Axios (for API requests)
- Tailwind CSS (for styling)
- React Router (for navigation)
- Redux (for state management)
- Toast Notifications

### Backend

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose for ORM)
- JWT (for authentication)
- Stripe (for payment processing)
- Nodemailer (for sending emails)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Yarn or npm

### Clone the Repository

```bash
git clone https://github.com/yourusername/carpool.git
cd carpool
```

### Install Dependencies

#### Frontend

```bash
cd Frontend
yarn install
# or
npm install
```

#### Backend

```bash
cd Backend
yarn install
# or
npm install
```

## Usage

### Running the Frontend

```bash
cd Frontend
yarn dev
# or
npm run dev
```

### Running the Backend

```bash
cd Backend
yarn start
# or
npm start
```

### Environment Variables

Create a `.env` file in the `Backend` directory and add the following environment variables:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

## Project Structure

### Frontend

```
Frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── redux/
│   ├── utils/
│   ├── validationSchema/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.js
├── package.json
└── README.md
```

### Backend

```
Backend/
├── src/
│   ├── application/
│   │   ├── interfaces/
│   │   ├── repository/
│   │   ├── usecases/
│   ├── entities/
│   ├── framework/
│   ├── presentation/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   ├── utils/
│   ├── server.ts
│   └── app.ts
├── .eslintrc.js
├── package.json
└── README.md
```

