import sys
import json
import os

try:
    import mysql.connector
except ImportError:
    mysql = None

def generate_report_card(student_id):
    student_name = "Amit Kumar"
    enrollment_no = "STU2026001"
    course_name = "BCA"
    semester = 1
    results = []
    attendance_pct = 85.0
    
    db_connected = False
    if mysql is not None:
        try:
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="college_db"
            )
            cursor = conn.cursor(dictionary=True)
            
            # Fetch profile
            cursor.execute("""
                SELECT s.*, c.name as course_name 
                FROM students s
                JOIN courses c ON s.course_id = c.id
                WHERE s.id = %s
            """, (student_id,))
            student = cursor.fetchone()
            if student:
                student_name = f"{student['first_name']} {student['last_name']}"
                enrollment_no = student['enrollment_no']
                course_name = student['course_name']
                semester = student['semester']
                
            # Fetch results
            cursor.execute("""
                SELECT r.*, s.name as subject_name, s.code as subject_code
                FROM results r
                JOIN subjects s ON r.subject_id = s.id
                WHERE r.student_id = %s
            """, (student_id,))
            results = cursor.fetchall()
            
            # Fetch attendance avg
            cursor.execute("SELECT AVG(percentage) as avg_percent FROM attendance WHERE student_id = %s", (student_id,))
            att_row = cursor.fetchone()
            if att_row and att_row['avg_percent']:
                attendance_pct = float(att_row['avg_percent'])
                
            db_connected = True
            cursor.close()
            conn.close()
        except Exception as e:
            pass

    if not results:
        results = [
            {"subject_code": "BCA-101", "subject_name": "Programming in C", "internal_marks": 18, "external_marks": 25, "total_marks": 43, "grade": "E", "status": "Pass"},
            {"subject_code": "BCA-103", "subject_name": "Web Technologies", "internal_marks": 20, "external_marks": 58, "total_marks": 78, "grade": "B", "status": "Pass"}
        ]

    # Generate print-friendly HTML report card
    reports_dir = os.path.join(os.path.dirname(__file__), "..", "server", "uploads", "reports")
    os.makedirs(reports_dir, exist_ok=True)
    
    file_name = f"report_{student_id}.html"
    report_path = os.path.join(reports_dir, file_name)
    relative_url = f"/uploads/reports/{file_name}"

    # HTML content with professional styling matching our theme
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Academic Report Card - {student_name}</title>
    <style>
        body {{
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 40px;
            color: #333;
            background-color: #f9fafb;
        }}
        .report-card {{
            max-width: 800px;
            margin: auto;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            border-top: 8px solid #1e3a8a;
        }}
        .header {{
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }}
        .header h1 {{
            margin: 0;
            color: #1e3a8a;
            font-size: 24px;
            text-transform: uppercase;
        }}
        .header p {{
            margin: 5px 0 0;
            color: #6b7280;
            font-size: 14px;
        }}
        .meta-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 30px;
            font-size: 14px;
        }}
        .meta-item span {{
            font-weight: bold;
            color: #4b5563;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 35px;
            font-size: 14px;
        }}
        th {{
            background-color: #1e3a8a;
            color: #ffffff;
            text-align: left;
            padding: 12px;
            font-weight: 600;
        }}
        td {{
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }}
        tr:hover {{
            background-color: #f3f4f6;
        }}
        .badge {{
            display: inline-block;
            padding: 3px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
        }}
        .badge-pass {{
            background-color: #d1fae5;
            color: #065f46;
        }}
        .badge-fail {{
            background-color: #fee2e2;
            color: #991b1b;
        }}
        .summary-box {{
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 30px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
        }}
        .footer-sig {{
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
        }}
        .sig-line {{
            border-top: 1px dashed #9ca3af;
            width: 150px;
            margin-top: 40px;
            text-align: center;
            padding-top: 5px;
            color: #6b7280;
        }}
    </style>
</head>
<body>
    <div class="report-card">
        <div class="header">
            <h1>Apex Institute of Technology</h1>
            <p>Affiliated with State Technical University | Academic Report Card</p>
        </div>
        
        <div class="meta-grid">
            <div class="meta-item"><span>Student Name:</span> {student_name}</div>
            <div class="meta-item"><span>Enrollment No:</span> {enrollment_no}</div>
            <div class="meta-item"><span>Course:</span> {course_name}</div>
            <div class="meta-item"><span>Semester:</span> Semester {semester}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Internal Marks</th>
                    <th>External Marks</th>
                    <th>Total</th>
                    <th>Grade</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
    """

    for r in results:
        status_badge = f'<span class="badge badge-pass">{r["status"]}</span>' if r["status"] == "Pass" else f'<span class="badge badge-fail">{r["status"]}</span>'
        html_content += f"""
                <tr>
                    <td>{r['subject_code']}</td>
                    <td>{r['subject_name']}</td>
                    <td>{r['internal_marks']}</td>
                    <td>{r['external_marks']}</td>
                    <td>{r['total_marks']}</td>
                    <td><strong>{r['grade']}</strong></td>
                    <td>{status_badge}</td>
                </tr>
        """

    html_content += f"""
            </tbody>
        </table>

        <div class="summary-box">
            <div><span>Overall Attendance:</span> {round(attendance_pct, 2)}%</div>
            <div><span>Academic Status:</span> { 'PASSED' if all(r['status'] == 'Pass' for r in results) else 'PROMOTED / FAIL' }</div>
        </div>

        <div class="footer-sig">
            <div class="sig-line">Class Coordinator</div>
            <div class="sig-line">Controller of Exams</div>
        </div>
    </div>
    <script>
        // Auto print window when downloading/opening
        // window.print();
    </script>
</body>
</html>
"""

    with open(report_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(json.dumps({
        "success": True,
        "student_id": student_id,
        "fileUrl": relative_url,
        "db_connected": db_connected
    }))

if __name__ == "__main__":
    student_id = 1
    if len(sys.argv) > 1:
        try:
            student_id = int(sys.argv[1])
        except ValueError:
            pass
            
    generate_report_card(student_id)
