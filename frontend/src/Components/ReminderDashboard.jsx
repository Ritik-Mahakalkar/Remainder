import React, { useState, useEffect } from "react";
import axios from "axios";

const ReminderDashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [reminders, setReminders] = useState([]);

  const user_id = 1; // hardcoded for now, or use from auth

  const fetchReminders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/reminders/${user_id}`);
      setReminders(res.data);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/reminders", {
        user_id,
        title,
        description,
        date,
      });
      console.log("Reminder added:", response.data);
      fetchReminders(); // refresh the list
      setTitle("");
      setDescription("");
      setDate("");
    } catch (err) {
      console.error("Error adding reminder:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reminders/${id}`);
      fetchReminders(); // refresh
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  const timeLeft = (reminderDate) => {
    const now = new Date();
    const reminderTime = new Date(reminderDate);
    const diffInMilliseconds = reminderTime - now;
    
    if (diffInMilliseconds <= 0) {
      return "Expired";
    }
    
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (diffInHours > 0) {
      return `in ${diffInHours} hours`;
    }
    if (diffInMinutes > 0) {
      return `in ${diffInMinutes} minutes`;
    }

    return "soon";
  };

  return (
    <div className="container mt-5">

      <div className="card mb-4">
        <div className="card-header">
          <h5>Add a New Reminder</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                placeholder="Reminder title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Reminder description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Add Reminder</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5> Reminders</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Date & Time</th>
                  <th>Time Left</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((reminder) => (
                  <tr key={reminder.id}>
                    <td>{reminder.title}</td>
                    <td>{reminder.description}</td>
                    <td>{new Date(reminder.date).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-info text-dark">{timeLeft(reminder.date)}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderDashboard;
