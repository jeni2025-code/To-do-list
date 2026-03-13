import { useState, useEffect } from 'react'
import './App.css'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [category, setCategory] = useState('Personal')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setTodos(data)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
    } finally {
      setLoading(false)
    }
  }

  async function addTodo(e) {
    e.preventDefault()
    if (!newTodo.trim()) return
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTodo.trim(),
          priority,
          category,
          due_date: dueDate || null
        }),
      })
      const data = await res.json()
      setTodos([data, ...todos])
      setNewTodo('')
      setDueDate('')
    } catch (err) {
      console.error('Failed to add todo:', err)
    }
  }

  async function toggleTodo(todo) {
    try {
      const res = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      const data = await res.json()
      setTodos(todos.map((t) => (t.id === todo.id ? data : t)))
    } catch (err) {
      console.error('Failed to toggle todo:', err)
    }
  }

  async function deleteTodo(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setTodos(todos.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Failed to delete todo:', err)
    }
  }

  async function saveEdit(id) {
    if (!editText.trim()) return
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editText.trim() }),
      })
      const data = await res.json()
      setTodos(todos.map((t) => (t.id === id ? data : t)))
      setEditingId(null)
      setEditText('')
    } catch (err) {
      console.error('Failed to update todo:', err)
    }
  }

  function startEdit(todo) {
    setEditingId(todo.id)
    setEditText(todo.title)
  }

  const completedCount = todos.filter((t) => t.completed).length
  const progressPercent = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100)

  const isOverdue = (dateStr) => {
    if (!dateStr) return false
    return new Date(dateStr) < new Date() && !dateStr.includes(new Date().toISOString().split('T')[0])
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Maestro</h1>
        <p className="subtitle">Your Productivity Orchestrator</p>
      </header>

      <section className="stats-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>Daily Progress</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{progressPercent}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          {completedCount} of {todos.length} tasks completed
        </p>
      </section>

      <section className="input-section">
        <form onSubmit={addTodo} className="add-form">
          <div className="main-input-group">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Conduct a new symphony of tasks..."
              className="add-input"
            />
            <div className="form-meta">
              <select className="select-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
              <select className="select-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
              </select>
              <input 
                type="date" 
                className="date-input" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="add-btn">Compose</button>
        </form>
      </section>

      {loading ? (
        <div className="loading-spinner">Tuning your workspace...</div>
      ) : (
        <ul className="todo-list">
          {todos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              A quiet stage... Add your first task above!
            </div>
          )}
          {todos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="todo-checkbox"
              />
              
              <div className="todo-content">
                {editingId === todo.id ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="add-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      autoFocus
                    />
                    <button onClick={() => saveEdit(todo.id)} className="add-btn" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                ) : (
                  <>
                    <span className="todo-title" onDoubleClick={() => startEdit(todo)}>
                      {todo.title}
                    </span>
                    <div className="todo-meta">
                      <span className={`badge badge-priority-${todo.priority.toLowerCase()}`}>
                        {todo.priority}
                      </span>
                      <span className="badge badge-category">{todo.category}</span>
                      {todo.due_date && (
                        <span className={isOverdue(todo.due_date) ? 'overdue' : ''}>
                          Due: {new Date(todo.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="todo-actions">
                <button onClick={() => startEdit(todo)} className="action-btn" title="Edit">
                  ✏️
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="action-btn delete-btn-action" title="Delete">
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
