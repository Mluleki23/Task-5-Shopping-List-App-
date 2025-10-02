# Database Setup with JSON Server

## Overview
This app uses `json-server` to create a fake REST API using `Db.json` as the database.

## Setup Instructions

### 1. Install json-server
First, install the json-server package:
```bash
npm install
```

### 2. Start the JSON Server
Open a **NEW terminal** and run:
```bash
npm run server
```

This will start the JSON server on `http://localhost:5000`

### 3. Start the Development Server
In your **ORIGINAL terminal**, run:
```bash
npm run dev
```

This will start Vite on `http://localhost:5173` (or another port if 5173 is busy)

## Important Notes

- **You need TWO terminals running**:
  - Terminal 1: `npm run server` (JSON Server on port 5000)
  - Terminal 2: `npm run dev` (Vite dev server)

- **Registration data** will be saved to `src/data/Db.json`
- **Shopping list data** can also be saved to `Db.json` (when you uncomment the shopping list code)

## Database Structure

The `Db.json` file contains:
```json
{
  "users": [
    {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john@example.com",
      "password": "password123",
      "cell": "0123456789"
    }
  ],
  "shoppingList": []
}
```

## API Endpoints

Once json-server is running, you can access:

- **GET** `http://localhost:5000/users` - Get all users
- **POST** `http://localhost:5000/users` - Create a new user
- **GET** `http://localhost:5000/users/:id` - Get a specific user
- **PUT** `http://localhost:5000/users/:id` - Update a user
- **DELETE** `http://localhost:5000/users/:id` - Delete a user

## Troubleshooting

### Port 5000 is already in use
If port 5000 is busy, change the port in `package.json`:
```json
"server": "json-server --watch src/data/Db.json --port 5001"
```

Then update the API URL in your code from `http://localhost:5000` to `http://localhost:5001`

### Cannot connect to server
Make sure:
1. JSON server is running (`npm run server`)
2. The port is correct (5000 by default)
3. No firewall is blocking the connection
