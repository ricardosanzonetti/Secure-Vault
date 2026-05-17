// client/src/App.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import "./index.css";

function App() {

  // LOGIN / REGISTER MODE
  const [isLogin, setIsLogin] = useState(true);

  // ERROR HANDLING
  const [errorMessage, setErrorMessage] =
    useState("");

  // AUTH DATA
  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // USER SESSION
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) ||
      null
  );

  // NOTES
  const [notes, setNotes] = useState([]);

  // NOTE DATA
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });

  // EDIT MODE
  const [editingId, setEditingId] =
    useState(null);

  // SHOW/HIDE NOTE
  const [visibleNotes, setVisibleNotes] =
    useState({});

  // API URL
  const API =
    `${import.meta.env.VITE_API_URL}/api`;

  // FETCH NOTES
  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {

      const res = await axios.get(
        `${API}/notes`,
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      setNotes(res.data);

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to fetch notes"
      );
    }
  };

  // REGISTER
  const register = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/auth/register`,
        authData
      );

      setUser(res.data);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setAuthData({
        username: "",
        email: "",
        password: "",
      });

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Register failed"
      );
    }
  };

  // LOGIN
  const login = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/auth/login`,
        authData
      );

      setUser(res.data);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setAuthData({
        username: "",
        email: "",
        password: "",
      });

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("user");

    setUser(null);

    setNotes([]);

    setErrorMessage("");
  };

  // CREATE NOTE
  const createNote = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        `${API}/notes`,
        noteData,
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      setNotes([res.data, ...notes]);

      setNoteData({
        title: "",
        content: "",
      });

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to create note"
      );
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {

    try {

      await axios.delete(
        `${API}/notes/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      setNotes(
        notes.filter(
          (note) => note._id !== id
        )
      );

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to delete note"
      );
    }
  };

  // START EDIT
  const startEdit = (note) => {

    setEditingId(note._id);

    setNoteData({
      title: note.title,
      content: note.content,
    });

    setErrorMessage("");
  };

  // UPDATE NOTE
  const updateNote = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.put(
        `${API}/notes/${editingId}`,
        noteData,
        {
          headers: {
            Authorization:
              `Bearer ${user.token}`,
          },
        }
      );

      setNotes(
        notes.map((note) =>
          note._id === editingId
            ? res.data
            : note
        )
      );

      setEditingId(null);

      setNoteData({
        title: "",
        content: "",
      });

      setErrorMessage("");

    } catch (error) {

      setErrorMessage(
        error.response?.data?.message ||
        "Failed to update note"
      );
    }
  };

  // TOGGLE VISIBILITY
  const toggleVisibility = (id) => {

    setVisibleNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // AUTH SCREEN
  if (!user) {

    return (

      <div className="app">

        <div className="auth-container">

          <h1 className="logo">
            SECURE
            <br />
            VAULT
          </h1>

          {errorMessage && (
            <div className="error-box">
              {errorMessage}
            </div>
          )}

          <div className="security-box">
            <p>
              &gt; secure login initialized...
            </p>

            <p>
              &gt; AES-256 encryption active
            </p>

            <p>
              &gt; JWT authentication verified
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={
              isLogin ? login : register
            }
          >

            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={authData.username}
                onChange={(e) =>
                  setAuthData({
                    ...authData,
                    username: e.target.value,
                  })
                }
                required
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={authData.email}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={authData.password}
              onChange={(e) =>
                setAuthData({
                  ...authData,
                  password: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              {isLogin
                ? "LOGIN"
                : "REGISTER"}
            </button>

          </form>

          <p
            className="switch-mode"
            onClick={() =>
              setIsLogin(!isLogin)
            }
          >
            {isLogin
              ? "Create Account"
              : "Already have an account?"}
          </p>

        </div>

      </div>
    );
  }

  // DASHBOARD
  return (

    <div className="container">

      <div className="top-bar">

        <h1>SECURE VAULT</h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {errorMessage && (
        <div className="error-box">
          {errorMessage}
        </div>
      )}

      <div className="note-form">

        <h2>
          {editingId
            ? "Edit Secure Note"
            : "Create Secure Note"}
        </h2>

        <form
          onSubmit={
            editingId
              ? updateNote
              : createNote
          }
        >

          <input
            type="text"
            placeholder="Title"
            value={noteData.title}
            onChange={(e) =>
              setNoteData({
                ...noteData,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            placeholder="Write secure content..."
            value={noteData.content}
            onChange={(e) =>
              setNoteData({
                ...noteData,
                content: e.target.value,
              })
            }
            required
          />

          <button type="submit">
            {editingId
              ? "UPDATE NOTE"
              : "CREATE NOTE"}
          </button>

        </form>

      </div>

      <div className="notes-grid">

        {notes.map((note) => (

          <div
            key={note._id}
            className="note-card"
          >

            <h3>{note.title}</h3>

            <p>
              {visibleNotes[note._id]
                ? note.content
                : "••••••••••••••••"}
            </p>

            <div className="note-actions">

              <button
                className="view-btn"
                onClick={() =>
                  toggleVisibility(note._id)
                }
              >
                {visibleNotes[note._id]
                  ? "Hide"
                  : "View"}
              </button>

              <button
                className="edit-btn"
                onClick={() =>
                  startEdit(note)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteNote(note._id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default App;