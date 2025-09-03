// frontend/src/App.jsx
import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/todos")
      .then((r) => r.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  async function addTodo() {
    if (!task.trim()) return;
    const res = await fetch("http://127.0.0.1:5000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    });
    if (res.ok) {
      const t = await res.json();
      setTodos((s) => [...s, t]);
      setTask("");
    }
  }

  async function deleteTodo(id) {
    await fetch(`http://127.0.0.1:5000/todos/${id}`, { method: "DELETE" });
    setTodos((s) => s.filter((t) => t.id !== id));
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600 }}>
      <h1>To-Do</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="New task"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo} style={{ padding: "8px 12px" }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((t) => (
          <li key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: 8, border: "1px solid #eee", marginBottom: 8 }}>
            <span>{t.task}</span>
            <button onClick={() => deleteTodo(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
