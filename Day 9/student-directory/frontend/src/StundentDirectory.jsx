import React, { useEffect, useState } from "react";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📖 Student Directory</h1>
      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id} className="p-3 bg-gray-100 rounded-lg shadow">
            <p><strong>{s.name}</strong></p>
            <p>{s.course}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
