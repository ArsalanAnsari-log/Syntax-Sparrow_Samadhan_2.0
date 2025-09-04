import React from "react";

function App() {
  const products = [
    {
      id: 1,
      name: "Raspberry Pi 4",
      price: "Rs 8000.00",
      description: "A small and powerful single-board computer.",
      image: "data:image/jpeg;base64,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",
    },
    {
      id: 2,
      name: "Arduino Uno",
      price: "Rs 500.00",
      description: "An open-source microcontroller board based on ATmega328P.",
      image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Arduino_Uno_-_R3.jpg",
    },
    {
      id: 3,
      name: "Dell Laptop",
      price: "RS 60,000.00",
      description: "High performance laptop for coding and design.",
      image: "https://saudewala.in/cdn/shop/files/51DxiTCVEGL.jpg?v=1698932193&width=1214",
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#2d3436" }}>💻 Product Store</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <div style={{ padding: "15px" }}>
              <h2 style={{ margin: "10px 0", fontSize: "20px", color: "#2d3436" }}>
                {product.name}
              </h2>
              <p style={{ margin: "5px 0", fontSize: "16px", color: "#636e72" }}>
                {product.description}
              </p>
              <p style={{ margin: "8px 0", fontWeight: "bold", color: "#0984e3" }}>
                {product.price}
              </p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "10px 16px",
                  backgroundColor: "#0984e3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0652DD")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0984e3")}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
