# MedCare Installation & Setup Guide

Complete step-by-step guide to set up and run the MedCare Healthcare Management System.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Database Configuration](#database-configuration)
4. [Environment Setup](#environment-setup)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher (comes with Node.js)
- **MySQL**: v8.0 or higher
- **RAM**: 4GB minimum
- **Disk Space**: 500MB free space

### Recommended Requirements
- **Node.js**: v18.x or v20.x
- **MySQL**: v8.0.30 or higher
- **RAM**: 8GB or more
- **SSD**: For better database performance

### Required Software
1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **MySQL Server** - [Download here](https://dev.mysql.com/downloads/)
3. **Git** (optional) - [Download here](https://git-scm.com/)
4. **Code Editor** - VS Code recommended

---

## Installation Steps

### Step 1: Verify Prerequisites

Check if Node.js and npm are installed:
```bash
node --version
# Should output: v16.x.x or higher

npm --version
# Should output: v8.x.x or higher
```

Check if MySQL is installed and running:
```bash
mysql --version
# Should output: mysql Ver 8.0.x or higher
```

### Step 2: Download the Project

**Option A: Clone from Git** (if using version control)
```bash
git clone <repository-url>
cd MedCare
```

**Option B: Extract from ZIP**
```bash
# Extract the MedCare.zip file to your desired location
cd MedCare
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mysql2
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- nodemon (dev dependency)

### Step 4: Install Frontend Dependencies

```bash
cd ../vite-project
npm install
```

This will install:
- react & react-dom
- react-router-dom
- axios
- vite
- tailwindcss
- eslint
- And other dependencies

---

## Database Configuration

### Step 1: Start MySQL Server

**Windows:**
```bash
# MySQL should start automatically with Windows
# Or start manually:
net start MySQL80
```

**macOS:**
```bash
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
```

### Step 2: Access MySQL

```bash
mysql -u root -p
# Enter your MySQL root password
```

### Step 3: Create Database

```sql
CREATE DATABASE medcare_db;
exit;
```

### Step 4: Import Database Schema

From the backend directory:

```bash
# Import main schema
mysql -u root -p medcare_db < database.sql

# Import seed data
mysql -u root -p medcare_db < final-data.sql

# Import notifications migration
mysql -u root -p medcare_db < migrations/add_notifications.sql
```

**Alternative: Use Setup Script**
```bash
node scripts/setupDatabase.mjs
```

### Step 5: Verify Database Setup

```bash
mysql -u root -p medcare_db
```

```sql
SHOW TABLES;
# Should show: users, doctors, patients, appointments, etc.

SELECT COUNT(*) FROM users;
# Should show some test users

exit;
```

---

## Environment Setup

### Backend Environment Variables

Create `.env` file in the `backend` directory:

```bash
cd backend
touch .env  # or create manually
```

Add the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=medcare_db
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

### Frontend Environment Variables

Create `.env` file in the `vite-project` directory:

```bash
cd ../vite-project
touch .env  # or create manually
```

Add the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
✅ Connected to MySQL database: medcare_db
```

**Terminal 2 - Frontend:**
```bash
cd vite-project
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Option 2: Using Process Manager (Optional)

Install `concurrently`:
```bash
npm install -g concurrently
```

Create a script in the root MedCare directory to run both:
```bash
concurrently "cd backend && npm run dev" "cd vite-project && npm run dev"
```

### Access the Application

1. **Frontend**: Open browser to `http://localhost:5173`
2. **Backend API**: Available at `http://localhost:5000`
3. **API Test**: Navigate to `http://localhost:5000/api/doctors`

---

## Testing

### Test Login Credentials

Use these credentials to test different user roles:

**Admin Account:**
```
Email: admin@medcare.com
Password: admin123
```

**Doctor Account:**
```
Email: sarah.johnson@medcare.com
Password: doctor123
```

**Patient Account:**
```
Email: john.doe@medcare.com
Password: patient123
```

### Manual Testing Checklist

- [ ] Can register a new patient account
- [ ] Can login as patient/doctor/admin
- [ ] Patient can browse doctors
- [ ] Patient can book appointment
- [ ] Doctor can view appointments
- [ ] Doctor can create prescription
- [ ] Admin can view all users
- [ ] Notifications are working
- [ ] Reviews can be added

### API Testing

Use tools like:
- **Postman** - Import API collection
- **Thunder Client** - VS Code extension
- **cURL** - Command line testing

Example cURL test:
```bash
curl http://localhost:5000/api/doctors
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Backend won't start - "Cannot connect to database"

**Solutions:**
1. Verify MySQL is running:
   ```bash
   mysql -u root -p
   ```
2. Check `.env` credentials match MySQL
3. Ensure database `medcare_db` exists
4. Check MySQL is running on port 3306

#### Issue: Frontend shows "Network Error" or "API Failed"

**Solutions:**
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend `.env`
3. Check browser console for CORS errors
4. Ensure both servers are running

#### Issue: "Port 5000 already in use"

**Solutions:**
1. Find and kill the process:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <process_id> /F

   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```
2. Or change PORT in backend `.env`

#### Issue: "bcrypt" or "node-gyp" errors during install

**Solutions:**
1. Install build tools:
   ```bash
   # Windows
   npm install --global windows-build-tools

   # macOS
   xcode-select --install

   # Linux
   sudo apt-get install build-essential
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

#### Issue: Database tables not created

**Solutions:**
1. Re-run database setup:
   ```bash
   mysql -u root -p medcare_db < backend/database.sql
   ```
2. Check SQL file for syntax errors
3. Verify MySQL user has CREATE privileges

#### Issue: JWT Token errors

**Solutions:**
1. Clear browser localStorage
2. Verify JWT_SECRET is set in `.env`
3. Re-login to get new token

#### Issue: Tailwind styles not working

**Solutions:**
1. Rebuild the project:
   ```bash
   cd vite-project
   npm run build
   ```
2. Clear browser cache
3. Verify tailwind.config.js is correct

---

## Production Deployment

### Backend Deployment

1. **Set Production Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=your_production_db_host
   DB_USER=your_production_db_user
   DB_PASSWORD=your_production_db_password
   JWT_SECRET=strong_random_secret_key
   CORS_ORIGIN=https://yourdomain.com
   ```

2. **Use Production Database:**
   - Create production MySQL database
   - Import schema (without test data)
   - Configure secure connection

3. **Use Process Manager:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name medcare-api
   pm2 save
   pm2 startup
   ```

### Frontend Deployment

1. **Build for Production:**
   ```bash
   cd vite-project
   npm run build
   ```

2. **Update API URL:**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

3. **Deploy `dist` folder to:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Nginx server

### Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Use environment variables for secrets
- [ ] Enable MySQL security features
- [ ] Set up monitoring and logging
- [ ] Regular security updates

### Performance Optimization

- [ ] Enable MySQL query cache
- [ ] Add database indexes
- [ ] Use CDN for frontend assets
- [ ] Enable Gzip compression
- [ ] Implement API caching
- [ ] Database connection pooling
- [ ] Code minification (automatic with Vite)

---

## Additional Resources

### Documentation
- [Backend Documentation](../backend/README.md)
- [Frontend Documentation](../vite-project/README.md)
- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Vite Guide](https://vitejs.dev/guide/)

### Community & Support
- GitHub Issues: Report bugs and request features
- Email: support@medcare.com
- Documentation: Read the docs first

---

## Next Steps

After successful installation:

1. **Explore the Application**
   - Test all user roles
   - Try different features
   - Check responsive design on mobile

2. **Customize**
   - Update branding and colors
   - Modify Tailwind theme
   - Add your own features

3. **Deploy**
   - Follow production deployment guide
   - Set up monitoring
   - Configure backups

---

**Congratulations!** 🎉 You have successfully set up MedCare Healthcare Management System.

For issues or questions, refer to the troubleshooting section or contact support.
