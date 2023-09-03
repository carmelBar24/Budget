# Personal Budgeting Application
This is a personal budgeting application that allows users to manage their expenses and budget. Users can register, log in, add costs, update costs, and view their budget based on  category filter.

## Installation
1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run npm install to install the required dependencies.

## Usage
1. Start the application by running npm start in the terminal.
2. Access the application in your browser at http://localhost:3000.

## Routes and Examples:

### Register User
Endpoint: POST /register
Request Body:
```json
{
    "username": "david",
    "password": "123123"
}
```
### Log In User
Endpoint: POST /login
Request Body:
```json
{
    "username": "david",
    "password": "123123"
}
```
### Get User Budget
Endpoint: GET /budget

Query Parameters:

user_id: User's ID
category (Optional): Budget category filter

### Add Cost Entry
Endpoint: POST /addCost
Request Body:
```json
{
    "description": "see a movie",
    "category": "other",
    "sum": "5"
}
```
### Update Cost Entry
Endpoint: POST /updateCost
Request Body:
```json
{
    "cost_id": "8d6caa28-830e-4d8f-be32-4eda01b6fc0a",
    "sum": "5"
}
```
### Remove Cost Entry
Endpoint: DELETE /removeCost
Request Body:
```json
{
    "cost_id": "b83d64fe-a247-41a3-9b02-e89aad40f672"
}
```

## Error Handling
For validation errors (wrong password, wrong name/ID), appropriate error responses will be returned.
For authentication validation errors, a 403 Forbidden status will be returned.
For other errors, relevant error messages will be returned.

## Authorization
All requests require the Authorization(excluding login/register) header with a bearer token obtained from the login route.

## Testing
You can use a tool like Postman to test the various endpoints and scenarios outlined above.
