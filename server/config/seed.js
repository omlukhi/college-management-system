const bcrypt = require('bcryptjs');
const { mysqlPool, connectMongoDB } = require('./db');
const mongoose = require('mongoose');
const { Assignment, StudyMaterial, Notification, AttendanceLog, Gallery } = require('../models/mongodbModels');

async function seed() {
  console.log('Starting database seeding...');
  
  // 1. Connect databases
  await connectMongoDB();

  // 2. Setup MySQL tables (in case not created by script)
  // Let's get a connection
  const connection = await mysqlPool.getConnection();
  try {
    // Enable foreign keys check during operations
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Truncate existing data
    console.log('Clearing existing MySQL data...');
    const tables = [
      'contacts', 'events', 'notices', 'placements', 'transport', 'hostels',
      'book_loans', 'library_books', 'results', 'exams', 'fees', 'attendance',
      'timetable', 'subjects', 'students', 'teachers', 'courses', 'departments', 'users'
    ];
    for (const table of tables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
    }
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // 3. Clear MongoDB collections
    console.log('Clearing MongoDB collections...');
    await Assignment.deleteMany({});
    await StudyMaterial.deleteMany({});
    await Notification.deleteMany({});
    await AttendanceLog.deleteMany({});
    await Gallery.deleteMany({});

    // 4. Create Users (hashed passwords)
    console.log('Seeding Users...');
    const adminHash = await bcrypt.hash('admin123', 10);
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const studentHash = await bcrypt.hash('student123', 10);

    // Insert Users
    const [adminUser] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      ['admin@college.com', adminHash, 'admin']
    );
    const [teacherUser] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      ['teacher@college.com', teacherHash, 'teacher']
    );
    const [studentUser] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      ['student@college.com', studentHash, 'student']
    );

    // 5. Seed Departments
    console.log('Seeding Departments...');
    const [deptBCA] = await connection.query(
      'INSERT INTO departments (name, code, description) VALUES (?, ?, ?)',
      ['Computer Applications', 'CA', 'Department of Computer Applications running BCA & MCA courses']
    );
    const [deptScience] = await connection.query(
      'INSERT INTO departments (name, code, description) VALUES (?, ?, ?)',
      ['Information Science', 'IS', 'Department of Information Science']
    );

    // 6. Seed Courses
    console.log('Seeding Courses...');
    const [courseBCA] = await connection.query(
      'INSERT INTO courses (department_id, name, duration_years, semester_count) VALUES (?, ?, ?, ?)',
      [deptBCA.insertId, 'Bachelor of Computer Applications (BCA)', 3, 6]
    );
    const [courseMCA] = await connection.query(
      'INSERT INTO courses (department_id, name, duration_years, semester_count) VALUES (?, ?, ?, ?)',
      [deptBCA.insertId, 'Master of Computer Applications (MCA)', 2, 4]
    );

    // 7. Seed Teachers
    console.log('Seeding Teachers...');
    const [teacher] = await connection.query(
      'INSERT INTO teachers (user_id, employee_id, first_name, last_name, phone, address, department_id, qualification, salary, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [teacherUser.insertId, 'EMP1001', 'Dr. Ramesh', 'Sharma', '9876543210', 'Flat 402, Royal Residency, Delhi', deptBCA.insertId, 'Ph.D in Computer Science', 85000.00, '2020-06-15']
    );

    // 8. Seed Students
    console.log('Seeding Students...');
    const [student] = await connection.query(
      'INSERT INTO students (user_id, enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id, semester, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [studentUser.insertId, 'STU2026001', 'Amit', 'Kumar', '2004-05-14', 'Male', '9812345678', 'H.No. 125, Sector-14, Gurgaon', deptBCA.insertId, courseBCA.insertId, 1, '2026-06-01']
    );

    // 9. Seed Subjects
    console.log('Seeding Subjects...');
    // BCA Semester 1 Subjects
    const [subC] = await connection.query(
      'INSERT INTO subjects (course_id, semester, name, code, credit_hours) VALUES (?, ?, ?, ?, ?)',
      [courseBCA.insertId, 1, 'Programming in C', 'BCA-101', 4]
    );
    const [subMath] = await connection.query(
      'INSERT INTO subjects (course_id, semester, name, code, credit_hours) VALUES (?, ?, ?, ?, ?)',
      [courseBCA.insertId, 1, 'Mathematical Foundation', 'BCA-102', 3]
    );
    const [subWeb] = await connection.query(
      'INSERT INTO subjects (course_id, semester, name, code, credit_hours) VALUES (?, ?, ?, ?, ?)',
      [courseBCA.insertId, 1, 'Web Technologies', 'BCA-103', 4]
    );

    // 10. Seed Timetable
    console.log('Seeding Timetable...');
    await connection.query(
      'INSERT INTO timetable (course_id, semester, subject_id, teacher_id, day_of_week, start_time, end_time, classroom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [courseBCA.insertId, 1, subC.insertId, teacher.insertId, 'Monday', '09:00:00', '10:30:00', 'Room-101']
    );
    await connection.query(
      'INSERT INTO timetable (course_id, semester, subject_id, teacher_id, day_of_week, start_time, end_time, classroom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [courseBCA.insertId, 1, subWeb.insertId, teacher.insertId, 'Monday', '10:45:00', '12:15:00', 'Lab-3']
    );

    // 11. Seed Attendance Summary
    console.log('Seeding Attendance Summary...');
    await connection.query(
      'INSERT INTO attendance (student_id, subject_id, total_classes, attended_classes) VALUES (?, ?, ?, ?)',
      [student.insertId, subC.insertId, 20, 17]
    );
    await connection.query(
      'INSERT INTO attendance (student_id, subject_id, total_classes, attended_classes) VALUES (?, ?, ?, ?)',
      [student.insertId, subWeb.insertId, 18, 12]
    );

    // 12. Seed Fees
    console.log('Seeding Fees...');
    await connection.query(
      'INSERT INTO fees (student_id, semester, amount, due_date, paid_date, status, payment_method, receipt_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [student.insertId, 1, 45000.00, '2026-07-31', '2026-06-10', 'Paid', 'UPI', 'REC-2026001001']
    );
    await connection.query(
      'INSERT INTO fees (student_id, semester, amount, due_date, status) VALUES (?, ?, ?, ?, ?)',
      [student.insertId, 2, 45000.00, '2027-01-31', 'Pending']
    );

    // 13. Seed Exams & Results
    console.log('Seeding Exams and Results...');
    const [exam] = await connection.query(
      'INSERT INTO exams (name, course_id, semester, subject_id, exam_date, max_marks) VALUES (?, ?, ?, ?, ?, ?)',
      ['Internal Assessment I', courseBCA.insertId, 1, subC.insertId, '2026-07-10', 50]
    );
    await connection.query(
      'INSERT INTO results (student_id, exam_id, subject_id, internal_marks, external_marks, grade, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [student.insertId, exam.insertId, subC.insertId, 18, 25, 'A', 'Pass']
    );

    // 14. Seed Library Books
    console.log('Seeding Library Books...');
    const [book] = await connection.query(
      'INSERT INTO library_books (title, author, isbn, quantity, available_quantity, rack_no) VALUES (?, ?, ?, ?, ?, ?)',
      ['Let Us C', 'Yashavant Kanetkar', '978-8183331630', 10, 9, 'Rack-A']
    );
    await connection.query(
      'INSERT INTO book_loans (book_id, student_id, issue_date, due_date, status) VALUES (?, ?, ?, ?, ?)',
      [book.insertId, student.insertId, '2026-07-01', '2026-07-15', 'Issued']
    );

    // 15. Seed Hostel Room
    console.log('Seeding Hostels...');
    await connection.query(
      'INSERT INTO hostels (student_id, room_no, hostel_name, mess_card_no, rent) VALUES (?, ?, ?, ?, ?)',
      [student.insertId, 'B-302', 'Vishweshwaraya Boys Hostel', 'MESS-8812', 6500.00]
    );

    // 16. Seed Transport Route
    console.log('Seeding Transport...');
    await connection.query(
      'INSERT INTO transport (student_id, route_name, bus_no, driver_name, driver_phone, fee) VALUES (?, ?, ?, ?, ?, ?)',
      [student.insertId, 'Dwarka to Campus Route 5', 'DL-1PB-4521', 'Satish Yadav', '9988776655', 3000.00]
    );

    // 17. Seed Placements
    console.log('Seeding Placements...');
    await connection.query(
      'INSERT INTO placements (student_id, company_name, package_lpa, interview_date, status, job_role) VALUES (?, ?, ?, ?, ?, ?)',
      [student.insertId, 'Infosys', 3.60, '2026-07-12', 'Shortlisted', 'Systems Engineer Trainee']
    );

    // 18. Seed Notices (MySQL backup)
    console.log('Seeding Notices (MySQL)...');
    await connection.query(
      'INSERT INTO notices (title, content, posted_by, target_role) VALUES (?, ?, ?, ?)',
      ['Semester Registration Open', 'All students must complete their Semester 1 registration and fee payments by 31st July.', 'Admin Office', 'all']
    );

    // 19. Seed Events
    console.log('Seeding Events...');
    await connection.query(
      'INSERT INTO events (title, description, event_date, location, type) VALUES (?, ?, ?, ?, ?)',
      ['Annual Tech Fest - Hackathon 2026', 'Inter-college coding and project design competition.', '2026-08-20', 'Seminar Hall 2 & Main Lab', 'cultural']
    );

    // 20. Seed Contacts Inquiry
    console.log('Seeding Contact Message...');
    await connection.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      ['Suresh Kumar', 'suresh@gmail.com', 'Admission Inquiry', 'What is the eligibility criteria for BCA admission 2026?']
    );

    // 21. Seed MongoDB Collections
    console.log('Seeding MongoDB Collections...');
    await Notification.create({
      title: 'Welcome to CMS',
      message: 'Your account has been successfully initialized in the College Management System.',
      senderRole: 'admin',
      targetRole: 'all'
    });

    await Gallery.create({
      albumName: 'Campus Life',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
      description: 'Main Administrative block and central lawns.'
    });

    await AttendanceLog.create({
      date: '2026-07-14',
      subjectId: subC.insertId,
      courseId: courseBCA.insertId,
      semester: 1,
      teacherId: teacher.insertId,
      records: [
        { studentId: student.insertId, status: 'Present' }
      ]
    });

    console.log('Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Seeding Error:', error);
  } finally {
    connection.release();
    mongoose.connection.close();
  }
}

// Execute if run directly
if (require.main === module) {
  seed();
}

module.exports = seed;
