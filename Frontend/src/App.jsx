
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [page, setPage] = useState("home");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [token, setToken] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    domainInterest: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      setMessage("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowForm(true);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const domainOptions = selectedEvent?.title
  ?.toLowerCase()
  .includes("web")
  ? [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "UI/UX Design",
      "Web Security",
    ]
  : [
      "Machine Learning",
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Data Science",
    ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/registrations`,
        {
          eventId: selectedEvent._id,
          ...formData,
        }
      );

      setMessage(response.data.message);
      setFormData({
        name: "",
        email: "",
        college: "",
        domainInterest: "",
      });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/admin/login`,
        {
          email: adminEmail,
          password: adminPassword,
        }
      );

      setToken(response.data.token);
      setPage("dashboard");
      setAdminPassword("");
      fetchRegistrations(response.data.token);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const fetchRegistrations = async (authToken, searchText = "") => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/registrations`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: {
            search: searchText,
          },
        }
      );

      setRegistrations(response.data);
    } catch (error) {
      setMessage("Unable to load registrations.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRegistrations(token, search);
  };

  const handleLogout = () => {
    setToken("");
    setRegistrations([]);
    setAdminEmail("");
    setAdminPassword("");
    setSearch("");
    setPage("home");
    setMessage("");
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h2>EventSphere</h2>

        <div>
          <a href="#home" onClick={() => setPage("home")}>Home</a>
          <a href="#events" onClick={() => setPage("home")}>Events</a>
          <a
            href="#admin"
            onClick={() => {
              setPage(token ? "dashboard" : "admin");
              setMessage("");
            }}
          >
            Admin Login
          </a>
        </div>
      </nav>

      {page === "home" && (
        <>
          <section className="welcome" id="home">
            <h1>Welcome to EventSphere</h1>
            <p>
              Discover and register for exciting events.
              Find opportunities to learn, connect and grow.
            </p>
            <a href="#events" className="explore-btn">
              Explore Events
            </a>
          </section>

          <section className="events" id="events">
            <h2>Upcoming Events</h2>
            <p>Explore our latest events and workshops.</p>

            {message && <p className="message">{message}</p>}

            {loading ? (
              <p>Loading events...</p>
            ) : (
              <div className="event-list">
                {events.map((event) => (
                  <div className="event-card" key={event._id}>
                    <h3>{event.title}</h3>
                    <p>
                      Date: {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p>{event.description}</p>
                    <p>
                      Available Seats: {event.capacity - event.registeredCount}
                    </p>
                    <p>Registered: {event.registeredCount}</p>

                    <button
                      onClick={() => handleRegister(event)}
                      disabled={event.registeredCount >= event.capacity}
                    >
                      {event.registeredCount >= event.capacity
                        ? "Event Full"
                        : "Register Now"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showForm && selectedEvent && (
              <div className="registration-form">
                <h2>Event Registration</h2>
                <p>Selected Event: {selectedEvent.title}</p>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="text"
                    name="college"
                    placeholder="College / Organization"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />

                  <select
  name="domainInterest"
  value={formData.domainInterest}
  onChange={handleChange}
  required
>
  <option value="">Select Domain Interest</option>

  {domainOptions.map((domain) => (
    <option key={domain} value={domain}>
      {domain}
    </option>
  ))}
</select>

                  <button type="submit">Submit Registration</button>
                </form>

                <button onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            )}
          </section>
        </>
      )}

      {page === "admin" && (
        <section className="admin-section">
          <div className="admin-box">
            <h2>Admin Login</h2>
            <p>Login to manage event registrations.</p>

            {message && <p className="message">{message}</p>}

            <form onSubmit={handleAdminLogin}>
              <input
                type="email"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              <button type="submit">Login</button>
            </form>
          </div>
        </section>
      )}

      {page === "dashboard" && (
        <section className="dashboard">
          <div className="dashboard-heading">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Manage all event participants here.</p>
            </div>

            <button onClick={handleLogout}>Logout</button>
          </div>

          <h3>Registered Participants ({registrations.length})</h3>

          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search name, email or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchRegistrations(token);
              }}
            >
              Clear
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College</th>
                  <th>Event</th>
                  <th>Domain</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {registrations.length > 0 ? (
                  registrations.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.college}</td>
                      <td>{item.event?.title || "Event"}</td>
                      <td>{item.domainInterest}</td>
                      <td>
                        <span className="status-badge">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No registrations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <footer>
        <p>© 2026 EventSphere. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
