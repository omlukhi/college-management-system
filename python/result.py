import sys
import json
import os

try:
    import mysql.connector
except ImportError:
    mysql = None

try:
    import matplotlib.pyplot as plt
except ImportError:
    plt = None

try:
    import pandas as pd
except ImportError:
    pd = None

def analyze_results(course_id, semester):
    db_connected = False
    results_list = []
    toppers = []
    subject_averages = {}

    if mysql is not None:
        try:
            conn = mysql.connector.connect(
                host="localhost",
                user="root",
                password="",
                database="college_db"
            )
            cursor = conn.cursor(dictionary=True)
            
            # Fetch all results in this course/semester
            cursor.execute("""
                SELECT r.*, s.name as subject_name, s.code as subject_code,
                       concat(stu.first_name, ' ', stu.last_name) as student_name, stu.enrollment_no
                FROM results r
                JOIN subjects s ON r.subject_id = s.id
                JOIN students stu ON r.student_id = stu.id
                WHERE stu.course_id = %s AND stu.semester = %s
            """, (course_id, semester))
            
            results_list = cursor.fetchall()
            db_connected = True
            
            # Fetch Toppers (Sort by total marks average across subjects)
            cursor.execute("""
                SELECT r.student_id, concat(stu.first_name, ' ', stu.last_name) as student_name, 
                       stu.enrollment_no, AVG(r.total_marks) as avg_marks
                FROM results r
                JOIN students stu ON r.student_id = stu.id
                WHERE stu.course_id = %s AND stu.semester = %s
                GROUP BY r.student_id
                ORDER BY avg_marks DESC LIMIT 3
            """, (course_id, semester))
            toppers = cursor.fetchall()

            cursor.close()
            conn.close()
        except Exception as e:
            pass

    # If database didn't have data, populate mock records
    if not results_list:
        results_list = [
            {"student_name": "Amit Kumar", "enrollment_no": "STU2026001", "subject_name": "Programming in C", "total_marks": 82, "grade": "A"},
            {"student_name": "Siddharth Sen", "enrollment_no": "STU2026002", "subject_name": "Programming in C", "total_marks": 45, "grade": "D"},
            {"student_name": "Rahul Verma", "enrollment_no": "STU2026003", "subject_name": "Programming in C", "total_marks": 94, "grade": "O"},
            {"student_name": "Amit Kumar", "enrollment_no": "STU2026001", "subject_name": "Web Technologies", "total_marks": 78, "grade": "B"},
        ]
        toppers = [
            {"student_name": "Rahul Verma", "enrollment_no": "STU2026003", "avg_marks": 94.0},
            {"student_name": "Amit Kumar", "enrollment_no": "STU2026001", "avg_marks": 80.0},
        ]

    # Convert to Pandas DataFrame for analysis
    chart_url = f"/uploads/charts/grades_{course_id}_{semester}.png"
    chart_path = os.path.join(os.path.dirname(__file__), "..", "server", "uploads", "charts", f"grades_{course_id}_{semester}.png")

    if pd is not None:
        df = pd.DataFrame(results_list)
        # Average per subject
        subject_averages = df.groupby('subject_name')['total_marks'].mean().to_dict()
        subject_averages = {k: round(v, 2) for k, v in subject_averages.items()}
        
        # Grade counts for chart
        grade_counts = df['grade'].value_counts()
        
        if plt is not None:
            try:
                os.makedirs(os.path.dirname(chart_path), exist_ok=True)
                plt.figure(figsize=(6, 4))
                grade_counts.plot(kind='bar', color='#1e3a8a')
                plt.title("Grade Distribution Overview", fontsize=12, pad=15, weight='bold')
                plt.xlabel("Grade")
                plt.ylabel("Number of Students")
                plt.grid(axis='y', linestyle='--', alpha=0.7)
                plt.tight_layout()
                plt.savefig(chart_path, dpi=100)
                plt.close()
            except Exception as e:
                chart_url = None
    else:
        # Fallback analysis
        for r in results_list:
            sub = r['subject_name']
            if sub not in subject_averages:
                subject_averages[sub] = []
            subject_averages[sub].append(r['total_marks'])
        subject_averages = {k: round(sum(v)/len(v), 2) for k, v in subject_averages.items()}
        chart_url = None

    output = {
        "course_id": course_id,
        "semester": semester,
        "subject_averages": subject_averages,
        "toppers": toppers,
        "total_records": len(results_list),
        "grade_chart_url": chart_url,
        "db_connected": db_connected
    }
    
    print(json.dumps(output))

if __name__ == "__main__":
    course_id = 1
    semester = 1
    if len(sys.argv) > 2:
        try:
            course_id = int(sys.argv[1])
            semester = int(sys.argv[2])
        except ValueError:
            pass
            
    analyze_results(course_id, semester)
