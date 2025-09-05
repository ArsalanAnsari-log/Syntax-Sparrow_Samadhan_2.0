import React, { useState } from "react";

const CounterPreview = () => {
  const [count, setCount] = useState(0);

  const [text, setText] = useState("");

  return (
    <div style={styles.container}>
      {/* Counter Section */}
      <div style={styles.card}>
        <h2>Counter</h2>
        <h3>{count}</h3>
        <div style={styles.buttonGroup}>
          <button onClick={() => setCount(count - 1)} style={styles.btn}>-</button>
          <button onClick={() => setCount(count + 1)} style={styles.btn}>+</button>
        </div>
      </div>

      {/* Live Text Preview Section */}
      <div style={styles.card}>
        <h2>Live Text Preview</h2>
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <p style={styles.preview}>
          Preview: <strong>{text || "..."}</strong>
        </p>
      </div>
    </div>
  );
};

// Simple inline styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "250px",
    padding: "20px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  btn: {
    padding: "10px 20px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#0077ff",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginTop: "10px",
  },
  preview: {
    marginTop: "15px",
    color: "#333",
  },
};

export default CounterPreview;
