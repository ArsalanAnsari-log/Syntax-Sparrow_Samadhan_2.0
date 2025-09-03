# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

todos = [
    {"id": 1, "task": "Learn React"},
    {"id": 2, "task": "Build API with Flask"}
]
next_id = 3

@app.route("/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)

@app.route("/todos", methods=["POST"])
def add_todo():
    global next_id
    data = request.get_json()
    if not data or "task" not in data:
        return jsonify({"error": "missing task"}), 400
    new_todo = {"id": next_id, "task": data["task"]}
    todos.append(new_todo)
    next_id += 1
    return jsonify(new_todo), 201

@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    global todos
    todos = [t for t in todos if t["id"] != todo_id]
    return jsonify({"message": "deleted"})

if __name__ == "__main__":
    app.run(debug=True)
