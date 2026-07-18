import sys
import json
import os

# Fallback in case libraries aren't installed
try:
    import mysql.connector
except ImportError:
    mysql = None

try:
    import matplotlib.pyplot as plt
except ImportError:
    plt = None

def get_attendance(student_id):
    # Default values in case DB connection fails
    total_classes = 20
    attended_classes = 16
    student_name = "Amit Kumar"
    subject_details = []

    # Database query
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
            
            # Fetch student name
            cursor.execute("SELECT concat(first_name, ' ', last_name) as name FROM students WHERE id = %s", (student_id,))
            student = cursor.fetchone()
            if student:
                student_name = student['name']

            # Fetch attendance per subject
            cursor.execute("""
                SELECT a.*, s.name as subject_name, s.code as subject_code 
                FROM attendance a
                JOIN subjects s ON a.subject_id = s.id
                WHERE a.student_id = %s
            """, (student_id,))
            
            rows = cursor.fetchall()
            if rows:
                subject_details = rows
                total_classes = sum(r['total_classes'] for r in rows)
                attended_classes = sum(r['attended_classes'] for r in rows)
                db_connected = True
            
            cursor.close()
            conn.close()
        except Exception as e:
            pass

    # Percentage
    percentage = (attended_classes / total_classes * 100) if total_classes > 0 else 0.0

    # Chart Generation
    chart_url = f"/uploads/charts/attendance_{student_id}.png"
    chart_path = os.path.join(os.path.dirname(__file__), "..", "server", "uploads", "charts", f"attendance_{student_id}.png")

    if plt is not None:
        try:
            # Ensure folder exists
            os.makedirs(os.path.dirname(chart_path), exist_ok=True)
            
            plt.figure(figsize=(5, 5))
            labels = ['Attended', 'Absent']
            sizes = [attended_classes, total_classes - attended_classes]
            colors = ['#1e3a8a', '#e11d48'] # Dark Blue and Red
            explode = (0.05, 0)
            
            plt.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140,
                    textprops={'fontsize': 12, 'weight': 'bold'})
            plt.title(f"Attendance Analysis: {student_name}", fontsize=14, pad=20, weight='bold')
            plt.tight_layout()
            plt.savefig(chart_path, dpi=100)
            plt.close()
        except Exception as e:
            chart_url = None
    else:
        chart_url = None

    # Print final output in JSON format
    result = {
        "student_id": student_id,
        "student_name": student_name,
        "total_classes": total_classes,
        "attended_classes": attended_classes,
        "percentage": round(percentage, 2),
        "status": "Shortage" if percentage < 75.0 else "Eligible",
        "chart_url": chart_url,
        "db_connected": db_connected,
        "subjects": subject_details
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    # Get studentId from argument
    student_id = 1
    if len(sys.argv) > 1:
        try:
            student_id = int(sys.argv[1])
        except ValueError:
            pass
            
    get_attendance(student_id)
