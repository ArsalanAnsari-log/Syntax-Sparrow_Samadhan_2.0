from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to access API

students = [
    {"id": 1, "name": "Arshuuu", "course": "CSE"},
    {"id": 2, "name": "Vansh", "course": "IT"},
    {"id": 3, "name": "Mitali", "course": "ECE"}
]

@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
