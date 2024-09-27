# money-loan-app

For run application : node app.js 

Simple API for borrowing money between two people using Node.js and Express, user can borrow money from each other.

Key Features:
- API to borrow money between two people
- API to give money back
- Summary of all debt lists
- API to list all transactions
- Authentication and Credentials using JWT

MongoDB Collection Structure:

users:

    {
    
        "_id": ObjectId,
        
        "username": String,
        
        "balance": Number,
        
        "password": String,
        
        "createdAt": Date
        
    }

transactions: 

    {
    
        "_id": ObjectId,
        
        "borrowerId": ObjectId,
        
        "lenderId": ObjectId,
        
        "amount": Number,
        
        "type": "borrow" | "repayment",
        
        "date": Date
        
    }

debts:

    {
        "_id": ObjectId,
        
        "borrowerId": ObjectId,
        
        "lenderId": ObjectId,
        
        "amountOwed": Number
        
    }

Testing the API
Host: http://localhost:8001
- Register a user: POST /api/v1/register
- Login a user: POST /api/v1/login

example response token :

    {
    
    "success": true,
    
    "message": "Login success.",
    
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmYzYzAxMjFjNjA0NWZkY2Y3YTk
    
    4MGYiLCJpYXQiOjE3MjczNDU5NTAsImV4cCI6MTcyNzM0OTU1MH0.12SUW_K30kbaURpcVRDiKft_FdErkYpcOhxlKbYPSg4"
    
    }
    
    
Header:

Content-Type: application/json

Authorization: Bearer <JWT_TOKEN>


- Borrow money: POST /api/v1/borrow (requires a JWT token)
- Repay money: POST /api/v1/repay (requires a JWT token)
- View all debts: GET /api/v1/debts (requires a JWT token)
- View all transactions: GET /api/v1/transactions (requires a JWT token)
- View debts for specific user: GET /api/v1/debts/< userId > (requires a JWT token)
- View transactions for specific user: GET /api/v1/transactions/< userId > (requires a JWT token)
