# College Management System

A full-stack College Management System developed as a final-year BCA/MCA project. The system helps manage students, faculty, courses, attendance, examinations, fees, notices, library, hostel, transport, and placements through a simple and user-friendly web interface.

The project uses React.js for the frontend, Node.js and Express.js for the backend, MySQL for relational data, MongoDB for document storage, and Python for analytics and report generation.

---

## Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap 5
- Chart.js
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (File Upload)
- QR Code Generator

### Database
- **MySQL**
  - Users
  - Students
  - Teachers
  - Departments
  - Courses
  - Subjects
  - Timetable
  - Attendance
  - Exams
  - Results
  - Fees
  - Library
  - Hostel
  - Transport
  - Placements

- **MongoDB**
  - Study Materials
  - Assignments
  - Notifications
  - Gallery
  - Attendance Logs

### Python
- Pandas
- Matplotlib
- CSV Report Generation
- Student Result Analysis

---

# Project Structure

```
college-management-system/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── models/
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── mysql.sql
│   └── mongodb.js
│
├── python/
│   ├── analytics.py
│   ├── attendance.py
│   ├── report.py
│   └── result.py
│
└── README.md
```

---

# Features

### Admin
- Dashboard
- Student Management
- Faculty Management
- Department Management
- Course & Subject Management
- Timetable Management
- Attendance Management
- Fee Management
- Examination & Result Management
- Notice Board
- Placement Management
- Hostel Management
- Transport Management
- Library Management

### Teacher
- View Dashboard
- Manage Attendance
- Upload Study Materials
- View Timetable
- View Students
- Publish Notices

### Student
- View Profile
- View Attendance
- View Timetable
- Check Results
- View Fee Status
- Download Study Materials
- Read Notices

---

# Database

### MySQL
Stores all structured data such as users, students, teachers, courses, attendance, examinations, fees, library records, hostel details, transport information, and placements.

### MongoDB
Stores documents including assignments, study materials, notifications, gallery images, and attendance logs.

---

# Installation

## Prerequisites

Install the following software before running the project.

- Node.js (v16 or above)
- Python 3
- MySQL Server or XAMPP
- MongoDB Community Server

---

## Backend Setup

Move to the server folder.

```bash
cd server
```

Install packages.

```bash
npm install
```

Configure the `.env` file with your MySQL and MongoDB credentials.

Seed the sample database.

```bash
npm run seed
```

Start the backend.

```bash
npm run dev
```

Backend URL

```
http://localhost:5000
```

---

## Frontend Setup

Move to the client folder.

```bash
cd client
```

Install packages.

```bash
npm install
```

Run the application.

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Database Setup

1. Start MySQL and MongoDB.
2. Create a database named:

```
college_db
```

3. Import

```
database/mysql.sql
```

4. Run

```bash
npm run seed
```

to insert sample data.

---

# Default Login

### Administrator

```
Email:
admin@college.com

Password:
admin123
```

### Teacher

```
Email:
teacher@college.com

Password:
teacher123
```

### Student

```
Email:
student@college.com

Password:
student123
```

---

# Future Improvements

- Online Admission
- Online Fee Payment
- Email Notifications
- SMS Alerts
- Student ID Card Generation
- Mobile Application
- AI-based Student Performance Analysis

---

# License

This project was developed for educational purposes as a BCA/MCA final-year project.