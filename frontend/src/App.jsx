import { useState, useEffect } from 'react'
import './App.css'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
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
        body: JSON.stringify({ title: newTodo.trim() }),
      })
      const data = await res.json()
      setTodos([data, ...todos])
      setNewTodo('')
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

  return (
    <div className="app">
      <div className="container">
        <h1>Todo List</h1>
        <p className="subtitle">
          {todos.length === 0
            ? 'No tasks yet. Add one below!'
            : `${completedCount} of ${todos.length} completed`}
        </p>

        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="add-input"
          />
          <button type="submit" className="add-btn">
            Add
          </button>
        </form>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="todo-checkbox"
                />
                {editingId === todo.id ? (
                  <div className="edit-group">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                      className="edit-input"
                      autoFocus
                    />
                    <button onClick={() => saveEdit(todo.id)} className="save-btn">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="todo-title" onDoubleClick={() => startEdit(todo)}>
                      {todo.title}
                    </span>
                    <div className="todo-actions">
                      <button onClick={() => startEdit(todo)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => deleteTodo(todo.id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
