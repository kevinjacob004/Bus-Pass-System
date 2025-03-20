
## Prerequisites

- Node.js 
- MySQL Server
- VS Code with the VS Code REST Client Plugin

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bus-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE bus_backend;
```

4. Configure environment variables:
Create a `.env` file in the root directory and add:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=bus_backend
JWT_SECRET=your_jwt_secret_key_here
```

5. Set up the database:
```bash
# Generate migration files based on your schema
npm run db:generate

# Push the schema changes to the database
npm run db:push

# (Optional) Seed the database with sample data
npm run seeddb
```

## Database Management

The project uses Drizzle Kit for database migrations and management. Available commands:

- `npm run db:generate` - Generate migration files based on schema changes
- `npm run db:push` - Push schema changes to the database
- `npm run db:drop` - Drop all tables
- `npm run db:check` - Check for schema changes
- `npm run db:studio` - Open Drizzle Studio to manage your database

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Testing

The project includes REST Client test files in the `requests` directory. To use them:

1. Install the "REST Client" extension in VS Code
2. Open any `.http` file in the `requests` directory
3. Click "Send Request" above each request to test

### Default Users

After running the seeder, you can use these accounts:

- Admin: admin@example.com / password123
- Staff: staff@example.com / password123
- Student: student1@example.com / password123

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user

### Users (Staff/Admin only)
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get specific user

