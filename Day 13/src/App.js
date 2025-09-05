import { useState, useEffect } from "react"; 

function NotesApp() {
  const API_URL = "https://demofornow.pythonanywhere.com/notes";

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch notes
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Add Note
  const addNote = () => {
    if (!title.trim() || !content.trim()) return;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
      .then((res) => res.json())
      .then((newNote) => {
        setNotes([...notes, newNote]);
        setTitle("");
        setContent("");
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  // Delete Note
  const deleteNote = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setNotes(notes.filter((n) => n.id !== id));
      })
      .catch((err) => console.error("Error deleting note:", err));
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        borderRadius: "12px",
        background: "#ffffff", // white background
        color: "#000000", // black text
        fontFamily: "system-ui, sans-serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>📝 Notes App</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#f9f9f9", // light gray
            color: "#000",
          }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note Content"
          rows="4"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "#f9f9f9", // light gray
            color: "#000",
          }}
        />
        <button
          onClick={addNote}
          style={{
            marginTop: "10px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#007bff", // simple blue
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Add Note
        </button>
      </div>

      <div>
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              padding: "15px",
              borderRadius: "8px",
              background: "#f1f1f1", // light gray
              marginBottom: "12px",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button
              onClick={() => deleteNote(note.id)}
              style={{
                marginTop: "10px",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#dc3545", // simple red
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesApp;
