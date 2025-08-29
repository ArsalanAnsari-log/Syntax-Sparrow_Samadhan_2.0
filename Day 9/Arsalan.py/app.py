import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Database Setup ---
def init_db():
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            course TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- CRUD Routes ---

# CREATE
@app.route("/api/students", methods=["POST"])
def create_student():
    data = request.json
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("INSERT INTO students (name, age, course) VALUES (?, ?, ?)",
                   (data["name"], data["age"], data["course"]))
    conn.commit()
    student_id = cursor.lastrowid
    conn.close()
    return jsonify({"id": student_id, **data}), 201

# READ ALL
@app.route("/api/students", methods=["GET"])
def get_students():
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students")
    rows = cursor.fetchall()
    conn.close()
    students = [{"id": row[0], "name": row[1], "age": row[2], "course": row[3]} for row in rows]
    return jsonify(students)

# READ ONE
@app.route("/api/students/<int:id>", methods=["GET"])
def get_student(id):
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id=?", (id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({"id": row[0], "name": row[1], "age": row[2], "course": row[3]})
    return jsonify({"error": "Student not found"}), 404

# UPDATE
@app.route("/api/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.json
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE students SET name=?, age=?, course=? WHERE id=?",
                   (data["name"], data["age"], data["course"], id))
    conn.commit()
    conn.close()
    return jsonify({"id": id, **data})

# DELETE
@app.route("/api/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM students WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Student deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=5500)
