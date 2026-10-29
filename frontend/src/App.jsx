import { useEffect, useMemo, useState } from "react";

const API = "/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load tasks");
      setTasks(await response.json());
    } catch {
      setError("API se connect nahi ho raha. Check karo Docker Compose chal raha hai.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function addTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Task add nahi hua");
      setTasks((current) => [data, ...current]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!response.ok) throw new Error("Task update nahi hua");
      const updated = await response.json();
      setTasks((current) => current.map((item) => item._id === updated._id ? updated : item));
    } catch (err) { setError(err.message); }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Task delete nahi hua");
      setTasks((current) => current.filter((item) => item._id !== id));
    } catch (err) { setError(err.message); }
  }

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  const completed = tasks.filter((task) => task.completed).length;

  return (
    <main className="page">
      <section className="app-shell">
        <div className="eyebrow"><span className="pulse" /> DEVOPS PORTFOLIO PROJECT</div>
        <header>
          <div>
            <p className="overline">PLAN. BUILD. DEPLOY.</p>
            <h1>Task Manager<span>.</span></h1>
            <p className="subtitle">Small steps. Reliable delivery.</p>
          </div>
          <div className="counter"><strong>{tasks.length}</strong><span>Total tasks</span></div>
        </header>

        <div className="stats">
          <div><span className="stat-dot blue" /><strong>{tasks.length - completed}</strong><span>In progress</span></div>
          <div><span className="stat-dot green" /><strong>{completed}</strong><span>Completed</span></div>
          <div><span className="stat-dot purple" /><strong>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</strong><span>Progress</span></div>
        </div>

        <form className="add-form" onSubmit={addTask}>
          <label htmlFor="task-title">ADD A TASK</label>
          <div className="input-row">
            <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deploy app to Kubernetes..." maxLength={200} />
            <button type="submit" disabled={!title.trim()}>+ Add task</button>
          </div>
        </form>

        <div className="list-heading">
          <h2>Your tasks <span>{visibleTasks.length}</span></h2>
          <div className="filters">
            {["all", "active", "completed"].map((item) => (
              <button key={item} className={filter === item ? "filter selected" : "filter"}
                onClick={() => setFilter(item)} type="button">{item}</button>
            ))}
          </div>
        </div>

        {error && <div className="error" role="alert">{error}</div>}
        {loading ? <p className="empty">Loading tasks...</p> : visibleTasks.length === 0 ? (
          <div className="empty"><span className="empty-icon">✓</span><strong>No tasks here yet</strong><p>Add a task above to get started.</p></div>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className={task.completed ? "task completed" : "task"} key={task._id}>
                <button className="check" aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  onClick={() => toggleTask(task)} type="button">{task.completed ? "✓" : ""}</button>
                <span className="task-title">{task.title}</span>
                <span className="task-status">{task.completed ? "DONE" : "ACTIVE"}</span>
                <button className="delete" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task._id)} type="button">×</button>
              </li>
            ))}
          </ul>
        )}

        <footer><span><i /> API + MongoDB</span><span>Built for the DevOps journey</span></footer>
      </section>
    </main>
  );
}
