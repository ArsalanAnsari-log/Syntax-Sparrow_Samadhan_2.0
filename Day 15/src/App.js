import React, { useEffect, useState } from "react";

/*
  Full frontend for Students + Todos + Notes + Auth (register/login)
  Works with backend at API_BASE (Flask app you provided).
  - Stores authenticated user in localStorage (no JWT needed for current backend).
  - If you later add JWT, small changes to save token and send Authorization header.
*/

const API_BASE = "https://demofornow.pythonanywhere.com"; // change to http://127.0.0.1:5000 if running locally

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const [route, setRoute] = useState(user ? "dashboard" : "auth"); // auth or dashboard

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setRoute("dashboard");
    } else {
      localStorage.removeItem("user");
      setRoute("auth");
    }
  }, [user]);

  const logout = () => setUser(null);

  return (
    <div style={{ minHeight: "100vh", background: "#0f1724", color: "#e6eef8", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <Header user={user} onLogout={logout} setRoute={setRoute} />
      <div style={{ maxWidth: 1100, margin: "24px auto" }}>
        {route === "auth" && <Auth onLogin={setUser} />}
        {route === "dashboard" && user && <Dashboard user={user} />}
      </div>
      <footer style={{ textAlign: "center", marginTop: 40, color: "#98a0b3" }}>
        built with ❤️ — connect to {API_BASE}
      </footer>
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header({ user, onLogout, setRoute }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Samadhan 2.0</h1>
        <div style={{ color: "#98a0b3", fontSize: 14 }}>Students · Todos · Notes</div>
      </div>

      <div>
        {!user ? (
          <button onClick={() => setRoute("auth")} style={buttonStyle}>Login / Register</button>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ color: "#cfe8ff" }}>{user.username}</div>
            <button onClick={onLogout} style={buttonStyle}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Auth (Register / Login) ---------------- */
function Auth({ onLogin }) {
  const [tab, setTab] = useState("login"); // login | register
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 700px", gap: 24 }}>
      <div style={{ padding: 20, borderRadius: 12, background: "#071024", minHeight: 300 }}>
        <h2 style={{ marginTop: 0, color: "#bfe1ff" }}>Welcome</h2>
        <p style={{ color: "#9fb6ce" }}>
          Use register to create an account, then login. This frontend stores the user in localStorage.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button onClick={() => setTab("login")} style={{ ...tabButtonStyle, ...(tab === "login" ? activeTabStyle : {}) }}>Login</button>
          <button onClick={() => setTab("register")} style={{ ...tabButtonStyle, ...(tab === "register" ? activeTabStyle : {}) }}>Register</button>
        </div>
      </div>

      <div style={{ padding: 20, borderRadius: 12, background: "#071424" }}>
        {tab === "login" ? <LoginForm onLogin={onLogin} /> : <RegisterForm onRegistered={(u) => { onLogin(u); }} />}
      </div>
    </div>
  );
}

function RegisterForm({ onRegistered }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const register = async () => {
    setStatus(null);
    if (!username.trim() || !password.trim()) return setStatus({ error: "username & password required" });
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ ok: data.message || "Registered" });
        // automatically login after register (call login endpoint)
        const loginRes = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          onRegistered(loginData.user || { username });
        }
      } else {
        setStatus({ error: data.error || "Registration failed" });
      }
    } catch (err) {
      setStatus({ error: "Network error" });
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Register</h3>
      <Input label="Username" value={username} onChange={setUsername} />
      <Input label="Password" type="password" value={password} onChange={setPassword} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={register} style={primaryButton}>Register</button>
      </div>
      <StatusBox status={status} />
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);

  const login = async () => {
    setStatus(null);
    if (!username.trim() || !password.trim()) return setStatus({ error: "username & password required" });
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user || { username });
      } else {
        setStatus({ error: data.error || "Login failed" });
      }
    } catch (err) {
      setStatus({ error: "Network error" });
    }
  };

  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Login</h3>
      <Input label="Username" value={username} onChange={setUsername} />
      <Input label="Password" type="password" value={password} onChange={setPassword} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={login} style={primaryButton}>Login</button>
      </div>
      <StatusBox status={status} />
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function Dashboard({ user }) {
  const [tab, setTab] = useState("students"); // students | todos | notes
  return (
    <div>
      <nav style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab("students")} style={{ ...navButton, ...(tab === "students" ? navActive : {}) }}>Students</button>
        <button onClick={() => setTab("todos")} style={{ ...navButton, ...(tab === "todos" ? navActive : {}) }}>Todos</button>
        <button onClick={() => setTab("notes")} style={{ ...navButton, ...(tab === "notes" ? navActive : {}) }}>Notes</button>
      </nav>

      <div>
        {tab === "students" && <StudentsPanel />}
        {tab === "todos" && <TodosPanel />}
        {tab === "notes" && <NotesPanel />}
      </div>
    </div>
  );
}

/* ---------------- Students Panel ---------------- */
function StudentsPanel() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [editing, setEditing] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE}/students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const add = async () => {
    if (!name.trim() || !course.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course }),
      });
      if (res.ok) {
        const newS = await res.json();
        setStudents((s) => [...s, newS]);
        setName(""); setCourse("");
      }
    } catch (err) { console.error(err); }
  };

  const startEdit = (s) => { setEditing(s); setName(s.name); setCourse(s.course); };
  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch(`${API_BASE}/students/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course }),
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents((arr) => arr.map((x) => x.id === updated.id ? updated : x));
        setEditing(null); setName(""); setCourse("");
      }
    } catch (err) { console.error(err); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete student?")) return;
    try {
      await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" });
      setStudents((arr) => arr.filter((s) => s.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={panelStyle}>
      <h3>Students</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} style={inputStyle} />
        {editing ? (
          <>
            <button onClick={saveEdit} style={primaryButton}>Save</button>
            <button onClick={() => { setEditing(null); setName(""); setCourse(""); }} style={mutedButton}>Cancel</button>
          </>
        ) : (
          <button onClick={add} style={primaryButton}>Add</button>
        )}
        <button onClick={fetchStudents} style={mutedButton}>Refresh</button>
      </div>

      <div>
        {students.length === 0 ? <div style={{ color: "#94a3b8" }}>No students yet</div> :
          students.map(s => (
            <div key={s.id} style={rowStyle}>
              <div>
                <div style={{ fontWeight: 700 }}>{s.name}</div>
                <div style={{ color: "#94a3b8" }}>{s.course}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(s)} style={smallButton}>Edit</button>
                <button onClick={() => del(s.id)} style={{ ...smallButton, background: "#ff6b6b" }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ---------------- Todos Panel ---------------- */
function TodosPanel() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_BASE}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTodos(); }, []);

  const add = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const newT = await res.json();
        setTodos((t) => [...t, newT]);
        setTitle("");
      }
    } catch (err) { console.error(err); }
  };

  const toggle = async (todo) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: todo.title, completed: !todo.completed }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTodos((arr) => arr.map((t) => t.id === updated.id ? updated : t));
      }
    } catch (err) { console.error(err); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete todo?")) return;
    try {
      await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
      setTodos((arr) => arr.filter((t) => t.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={panelStyle}>
      <h3>Todos</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="New todo..." value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} onKeyDown={(e)=> e.key==="Enter" && add()} />
        <button onClick={add} style={primaryButton}>Add</button>
        <button onClick={fetchTodos} style={mutedButton}>Refresh</button>
      </div>

      <div>
        {todos.length === 0 ? <div style={{ color: "#94a3b8" }}>No todos yet</div> :
          todos.map(t => (
            <div key={t.id} style={{ ...rowStyle, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={t.completed} onChange={() => toggle(t)} />
                <div style={{ textDecoration: t.completed ? "line-through" : "none" }}>{t.title}</div>
              </label>
              <div>
                <button onClick={() => del(t.id)} style={{ ...smallButton, background: "#ff6b6b" }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ---------------- Notes Panel ---------------- */
function NotesPanel() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${API_BASE}/notes`);
      const data = await res.json();
      setNotes(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchNotes(); }, []);

  const add = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        const newN = await res.json();
        setNotes((n) => [...n, newN]);
        setTitle(""); setContent("");
      }
    } catch (err) { console.error(err); }
  };

  const startEdit = (n) => { setEditing(n); setTitle(n.title); setContent(n.content); };
  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch(`${API_BASE}/notes/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        const updated = await res.json();
        setNotes((arr) => arr.map((x) => x.id === updated.id ? updated : x));
        setEditing(null); setTitle(""); setContent("");
      }
    } catch (err) { console.error(err); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete note?")) return;
    try {
      await fetch(`${API_BASE}/notes/${id}`, { method: "DELETE" });
      setNotes((arr) => arr.filter((n) => n.id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div style={panelStyle}>
      <h3>Notes</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
        <input placeholder="Content" value={content} onChange={e => setContent(e.target.value)} style={inputStyle} />
        {editing ? (
          <>
            <button onClick={saveEdit} style={primaryButton}>Save</button>
            <button onClick={() => { setEditing(null); setTitle(""); setContent(""); }} style={mutedButton}>Cancel</button>
          </>
        ) : (
          <button onClick={add} style={primaryButton}>Add</button>
        )}
        <button onClick={fetchNotes} style={mutedButton}>Refresh</button>
      </div>

      <div>
        {notes.length === 0 ? <div style={{ color: "#94a3b8" }}>No notes yet</div> :
          notes.map(n => (
            <div key={n.id} style={{ ...rowStyle, flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.title}</div>
                  <div style={{ color: "#94a3b8" }}>{n.content}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(n)} style={smallButton}>Edit</button>
                  <button onClick={() => del(n.id)} style={{ ...smallButton, background: "#ff6b6b" }}>Delete</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ---------------- UI Helpers & Styles ---------------- */
const Input = ({ label, type = "text", value, onChange }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 13, color: "#98a0b3", marginBottom: 6 }}>{label}</div>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#081327", color: "#e6eef8" }}
    />
  </div>
);

const StatusBox = ({ status }) => {
  if (!status) return null;
  return (
    <div style={{ marginTop: 12 }}>
      {status.error && <div style={{ color: "#ffb4b4" }}>{status.error}</div>}
      {status.ok && <div style={{ color: "#b5f3a8" }}>{status.ok}</div>}
    </div>
  );
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "none",
  background: "#1f6feb",
  color: "#fff",
  cursor: "pointer",
};

const primaryButton = { ...buttonStyle, fontWeight: 700 };
const mutedButton = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#253241", color: "#c6d3e6", cursor: "pointer" };
const tabButtonStyle = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#0b2840", color: "#9fb6ce", cursor: "pointer" };
const activeTabStyle = { background: "#124a78", color: "#e8f7ff" };

const panelStyle = { padding: 16, borderRadius: 12, background: "#071026" };
const inputStyle = { flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#081327", color: "#e6eef8" };
const rowStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", marginBottom: 10, borderRadius: 10, background: "#051428" };
const smallButton = { padding: "6px 10px", borderRadius: 8, border: "none", background: "#1f6feb", color: "#fff", cursor: "pointer" };
const navButton = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#071a2a", color: "#98a0b3", cursor: "pointer" };
const navActive = { background: "#0f4f8a", color: "#e6f6ff" };

export default App;
