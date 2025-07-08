import { useState, useEffect } from "react";
import logo from "./assets/logo.png"; // adjust path if needed

function App() {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });

  const [goal, setGoal] = useState("");
  const [tempGoal, setTempGoal] = useState("");
  const [activeItemId, setActiveItemId] = useState(null);
  const total = items.reduce((sum, item) => sum + item.kcal, 0);
  const remaining = goal ? goal - total : null;
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calorie-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [visibleHistoryDeletes, setVisibleHistoryDeletes] = useState({});

  useEffect(() => {
    const savedGoal = localStorage.getItem("goal");
    if (savedGoal) setGoal(Number(savedGoal));

    const savedItems = localStorage.getItem("items");
    if (savedItems) setItems(JSON.parse(savedItems));
  }, []);

  useEffect(() => {
    if (goal) {
      localStorage.setItem("goal", goal);
    }
  }, [goal]);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!food || !calories) return;

    const newItem = {
      id: Date.now(),
      name: food,
      kcal: Number(calories),
    };

    setItems([...items, newItem]);
    setFood("");
    setCalories("");
    const isInHistory = history.some(
      (entry) => entry.name.toLowerCase() === food.toLowerCase()
    );

    if (!isInHistory) {
      const updatedHistory = [
        ...history,
        { name: food, kcal: Number(calories) },
      ];
      setHistory(updatedHistory);
      localStorage.setItem("calorie-history", JSON.stringify(updatedHistory));
    }
  }

  function handleDelete(id) {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  }
  function handleDeleteHistory(indexToDelete) {
    const newHistory = history.filter((_, i) => i !== indexToDelete);
    setHistory(newHistory);
    localStorage.setItem("calorie-history", JSON.stringify(newHistory));
  }
  function handleReset() {
    const confirmReset = window.confirm(
      "This will clear everything including your goal. Proceed?"
    );
    if (!confirmReset) return;

    setItems([]);
    setGoal("");
    setTempGoal("");

    localStorage.removeItem("items");
    localStorage.removeItem("goal");
  }

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          color: "#2C3E50",
          minHeight: "100vh",
        }}
      >
        <div style={{ position: "absolute", top: "1.5rem", right: "2rem" }}>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              padding: "0.4rem 0.8rem",
              backgroundColor: "#555555",
              color: "white",
              fontSize: "14px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            History
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            minHeight: "100vh",
            padding: "1rem 2rem",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              padding: "0 1rem", // ✅ horizontal padding for small screens
              boxSizing: "border-box", // ✅ makes padding work correctly
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                flexWrap: "wrap", // 🟢 wrap on small screens
                textAlign: "center",
                gap: "0.5rem",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  height: "80px", // slightly smaller to match text better
                  width: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />
              <h1
                style={{
                  margin: 0,
                  color: "#002529", // fixed: added the missing #
                  fontSize: "2rem",
                  lineHeight: "1", // reduces space above/below text
                }}
              >
                Calorie Tracker
              </h1>
            </div>

            {!goal && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
                  Set Daily Goal (kcal):
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  style={{
                    padding: "0.4rem",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100px",
                    marginRight: "0.5rem",
                  }}
                />
                <button
                  onClick={() => {
                    setGoal(Number(tempGoal));
                    localStorage.setItem("goal", tempGoal);
                    setTempGoal("");
                  }}
                  style={{
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#198450",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Food (e.g. 2 apples)"
                value={food}
                onChange={(e) => setFood(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  marginRight: "0.5rem",
                  border: "1px solid #ccd6dd",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  color: "#2C3E50",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  marginRight: "0.5rem",
                  border: "1px solid #ccd6dd",
                  borderRadius: "6px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  color: "#2C3E50",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#e8ecf1", // ✅ light gray-blue
                  color: "#2C3E50",
                  border: "1px solid #d3dce6", // soft border
                  padding: "0.4rem 0.8rem", // ✅ smaller, matches input height
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "500",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#dce3eb")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#e8ecf1")}
              >
                Add
              </button>
            </form>

            <ul style={{ padding: 0, listStyle: "none" }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  onDoubleClick={() =>
                    setActiveItemId(activeItemId === item.id ? null : item.id)
                  }
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    borderLeft: "5px solid #2C3E50", // navy accent line
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    borderRadius: "6px",
                    padding: "0.8rem 1rem",
                    marginBottom: "0.8rem",
                    color: "#2C3E50",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    {item.name} — {item.kcal} kcal
                  </span>
                  {activeItemId === item.id && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "#FF7F7F",
                        color: "white",
                        border: "none",
                        padding: "3px 8px",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>

            <h4
              style={{ color: "#2C3E50", marginTop: "1rem", fontWeight: "500" }}
            >
              🔥 Total: {total} kcal
            </h4>

            {goal && (
              <h4
                style={{
                  color: "#e53935", // always red
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                🍃 Left: {remaining} kcal
              </h4>
            )}

            {showHistory && (
              <div
                style={{
                  position: "fixed",
                  top: "0",
                  right: "0",
                  height: "100%",
                  width: "300px",
                  backgroundColor: "#e3e8f0",

                  padding: "1rem",
                  overflowY: "auto",
                  zIndex: 1000,
                }}
              >
                <div
                  onClick={() => setShowHistory(false)}
                  style={{
                    width: "40px",
                    height: "5px",
                    backgroundColor: "gray",
                    borderRadius: "10px",
                    margin: "0 auto 1rem auto",
                    cursor: "pointer",
                  }}
                  title="Click to hide"
                ></div>

                <h3 style={{ color: "002529" }}>Food History</h3>
                {history.length === 0 ? (
                  <p>No history yet.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {history.map((entry, index) => (
                      <li
                        key={index}
                        onDoubleClick={() =>
                          setVisibleHistoryDeletes((prev) => ({
                            ...prev,
                            [index]: !prev[index],
                          }))
                        }
                        style={{
                          backgroundColor: "white",
                          padding: "0.5rem",
                          marginBottom: "0.5rem",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          position: "relative",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <strong>{entry.name}</strong>
                          <br />
                          {entry.kcal} kcal
                        </div>

                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() =>
                              setItems([
                                ...items,
                                {
                                  id: Date.now(),
                                  name: entry.name,
                                  kcal: entry.kcal,
                                },
                              ])
                            }
                            style={{
                              padding: "0.3rem 0.6rem",
                              backgroundColor: "gray",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Add
                          </button>

                          {visibleHistoryDeletes[index] && (
                            <button
                              onClick={() => handleDeleteHistory(index)}
                              style={{
                                backgroundColor: "transparent",
                                color: "red",
                                border: "none",
                                fontSize: "18px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                padding: 0,
                                margin: 0,
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {items.length > 0 && (
              <button
                onClick={handleReset}
                style={{
                  marginTop: "2rem",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "0.4rem 0.8rem",
                  fontSize: "14px",
                  cursor: "pointer",
                  opacity: 0.8,
                }}
              >
                Reset Everything
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
