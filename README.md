# Trollen Backend

## Table of content

- [Trollen Backend](#trollen-backend)
  - [Table of content](#table-of-content)
  - [About](#about)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [Clone the repository](#clone-the-repository)
    - [Install dependencies](#install-dependencies)
    - [Configure environment variables](#configure-environment-variables)
    - [Start the server](#start-the-server)
  - [Features](#features)
  - [Tests](#tests)
  - [Documentation](#documentation)
  - [Authors](#authors)

## About

Trollen Backend is a robust Node.js server application that powers the Trollen platform. It provides a RESTful API for character management and user interactions, built with security and scalability in mind.

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Real-time Communication**: Socket.IO
- **Security Middleware**: 
  - Helmet for enhanced security headers
  - CORS for cross-origin resource sharing
  - Express Validator for input validation
- **Development Tools**:
  - Morgan for HTTP request logging
  - Debug for debugging
  - Dotenv for environment variable management

## Installation

### Clone the repository

```bash
git clone https://github.com/Trollen/trollen-backend.git
cd trollen-backend
```

### Install dependencies

```bash
yarn install
```

### Configure environment variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
```

### Start the server

```bash
yarn start
```

The server will start on the configured port (default: 3000).

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Character Management**: CRUD operations for character data
- **Real-time Updates**: Socket.IO integration for live updates
- **Input Validation**: Request validation using Express Validator
- **Error Handling**: Centralized error handling middleware
- **Security**: Implementation of security best practices using Helmet
- **Database Integration**: MongoDB integration using Mongoose
- **API Documentation**: Comprehensive API documentation

## Tests

To run the test suite:

```bash
npm test
```

## Documentation

API documentation is available at `/api-docs` when running the server locally.

## Authors

- Nicolas Portier
- Agathe Lejour 
- Pierre Boisnard
- Maxime Besnard

For questions and support, please open an issue in the repository.
