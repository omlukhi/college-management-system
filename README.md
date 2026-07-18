# 🎓 College Management System

A full-stack **College Management System** developed as a final-year **BCA/MCA** project. This project helps manage daily college activities such as student records, faculty information, attendance, examinations, fees, library, hostel, transport, placements, and notices through a simple and user-friendly web interface.

---

## 📌 Project Overview

The main objective of this project is to digitize college management processes and reduce manual work. It provides separate dashboards for **Administrator**, **Teacher**, and **Student** users with role-based access.

---

## 🚀 Technologies Used

### Frontend
- React.js
- React Router DOM
- Axios
- Bootstrap 5
- Chart.js
- HTML5
- CSS3
- JavaScript (ES6)

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (File Upload)
- QR Code Generator

### Database
- MySQL
- MongoDB

### Python
- Pandas
- Matplotlib
- CSV Report Generation
- Student Result Analysis

---

## ✨ Features

### 👨‍💼 Admin Module
- Admin Dashboard
- Student Management
- Faculty Management
- Department Management
- Course Management
- Subject Management
- Attendance Management
- Timetable Management
- Fee Management
- Examination Management
- Result Management
- Library Management
- Hostel Management
- Transport Management
- Placement Management
- Notice Management

### 👨‍🏫 Teacher Module
- Teacher Dashboard
- Student Attendance
- Upload Study Materials
- View Timetable
- Publish Notices
- View Student Details

### 👨‍🎓 Student Module
- Student Dashboard
- View Profile
- View Attendance
- View Timetable
- View Results
- View Fee Status
- Download Study Materials
- Read Notices

---

## 📂 Project Structure

```text
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

## 💾 Database

### MySQL
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

### MongoDB
- Study Materials
- Assignments
- Notifications
- Gallery
- Attendance Logs

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/college-management-system.git
```

### Backend Setup

```bash
cd server
npm install
npm run seed
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🗄 Database Setup

1. Start MySQL Server.
2. Start MongoDB Server.
3. Create a database named:

```
college_db
```

4. Import:

```
database/mysql.sql
```

5. Insert sample data:

```bash
npm run seed
```

---

## 🔑 Default Login

### Administrator

```
Email    : admin@college.com
Password : admin123
```

### Teacher

```
Email    : teacher@college.com
Password : teacher123
```

### Student

```
Email    : student@college.com
Password : student123
```

---

## 📈 Future Enhancements

- Online Admission
- Online Fee Payment
- Email Notifications
- SMS Notifications
- Mobile Application
- AI-Based Student Performance Analysis
- Online Examination System
- Student ID Card Generation

---

## 👨‍💻 Author

**Lukhi Om Sanjaybhai**

Final Year BCA/MCA Student

---

## 📚 Academic Purpose

This project was developed as a **final-year academic project** to demonstrate full-stack web development using **React.js, Node.js, Express.js, MySQL, MongoDB, and Python**.

---

⭐ If you like this project, consider giving it a **Star** on GitHub.
