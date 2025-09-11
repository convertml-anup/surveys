# Survey Application Setup

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Start MongoDB
Make sure MongoDB is running on your system (default: localhost:27017)

### 4. Start Backend Server
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

### 5. Start Frontend Application
```bash
npm start
```
Application will run on http://localhost:3000

## Features
- Create surveys using SurveyJS Creator
- Save surveys to MongoDB
- View all created surveys in Survey Management page
- Table view with survey details and timestamps