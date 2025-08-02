import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import './Calendar.css';
import Login from './Login';

function App() {
  const [todos, setTodos] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      fetchTodos();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTodos();
    }
  }, [isLoggedIn, selectedDate]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`https://localhost:8080/api/todos?date=${selectedDate.toISOString().split('T')[0]}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTodos(prevTodos => ({
        ...prevTodos,
        [selectedDate.toDateString()]: data
      }));
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleDateChange = (date) => {
    if (isLoggedIn) {
      setSelectedDate(date);
    }
  };

  const handleLogin = () => {
    // Redirect to OAuth 2 login page
    window.location.href = '/auth/login';
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = async () => {
    const dateKey = selectedDate.toDateString();
    if (inputValue.trim()) {
      try {
        const response = await fetch('https://localhost:8080/api/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: selectedDate.toISOString().split('T')[0],
            text: inputValue.trim(),
            completed: false,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newTodo = await response.json();
        setTodos(prevTodos => {
          const updatedTodos = { ...prevTodos };
          if (!updatedTodos[dateKey]) {
            updatedTodos[dateKey] = [];
          }
          updatedTodos[dateKey].push(newTodo);
          return updatedTodos;
        });
        setInputValue('');
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const handleToggleTodo = async (index) => {
    const dateKey = selectedDate.toDateString();
    const todoToUpdate = todos[dateKey][index];
    try {
      const response = await fetch(`https://localhost:8080/api/todos/${todoToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todoToUpdate, completed: !todoToUpdate.completed }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTodo = await response.json();
      setTodos(prevTodos => {
        const newTodos = { ...prevTodos };
        newTodos[dateKey][index] = updatedTodo;
        return newTodos;
      });
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleDeleteTodo = async (index) => {
    const dateKey = selectedDate.toDateString();
    const todoToDelete = todos[dateKey][index];
    try {
      const response = await fetch(`https://localhost:8080/api/todos/${todoToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTodos(prevTodos => {
        const newTodos = { ...prevTodos };
        newTodos[dateKey] = newTodos[dateKey].filter((_, i) => i !== index);
        return newTodos;
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleEditTodo = (index) => {
    const dateKey = selectedDate.toDateString();
    setEditIndex(index);
    setEditValue(todos[dateKey][index].text);
  };

  const handleUpdateTodo = async () => {
    const dateKey = selectedDate.toDateString();
    const todoToUpdate = todos[dateKey][editIndex];
    try {
      const response = await fetch(`https://localhost:8080/api/todos/${todoToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todoToUpdate, text: editValue }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTodo = await response.json();
      setTodos(prevTodos => {
        const newTodos = { ...prevTodos };
        newTodos[dateKey][editIndex] = updatedTodo;
        return newTodos;
      });
      setEditIndex(-1);
      setEditValue('');
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const getTileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    if (view === 'month' && todos[dateKey] && todos[dateKey].length > 0) {
      const maxTodos = 2; // Maximum number of todos to show
      const todosToShow = todos[dateKey].slice(0, maxTodos);
      const hasMore = todos[dateKey].length > maxTodos;
      
      console.log(`Date: ${dateKey}, Total todos: ${todos[dateKey].length}, Has more: ${hasMore}`);
      
      return (
        <div className="todo-preview">
          {todosToShow.map((todo, index) => (
            <div key={index} className={`todo-item-preview ${todo.completed ? 'completed' : ''}`}>{todo.text}</div>
          ))}
          {hasMore && <div className="todo-item-preview more-indicator">+{todos[dateKey].length - maxTodos}개 할일</div>}
        </div>
      );
    }
    return null;
  };

  const dateKey = selectedDate.toDateString();
  const selectedTodos = todos[dateKey] || [];

  const TodoApp = () => {
    const navigate = useNavigate();
    
    const handleLogin = () => {
      navigate('/login');
    };
    
    return (
    <div className="App">
      <div className="header">
        <h1>할 일 목록</h1>
        <button className="login-button" onClick={handleLogin}>
          {isLoggedIn ? <span className="login-icon">👤</span> : <span>로그인</span>}
        </button>
      </div>
      <div className={`main-container ${!isLoggedIn ? 'disabled' : ''}`}>
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={getTileContent}
            locale="ko-KR"
          />
        </div>
        <div className="todo-list-container">
          <div className="header-container">
            <h2>{selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
            <div className="success-rate">
              <span>할일 성공률: {selectedTodos.length > 0 ? Math.round((selectedTodos.filter(todo => todo.completed).length / selectedTodos.length) * 100) : 0}%</span>
            </div>
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTodo();
                }
              }}
              placeholder="새로운 할 일을 추가하세요"
            />
            <button onClick={handleAddTodo}>추가</button>
          </div>
          <ul>
            {selectedTodos.map((todo, index) => (
              <li key={index} className={todo.completed ? 'completed' : ''}>
                {editIndex === index ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateTodo();
                        }
                      }}
                      onBlur={handleUpdateTodo}
                      autoFocus
                    />
                  </div>
                ) : (
                  <>
                    <span onDoubleClick={() => handleEditTodo(index)}>{todo.text}</span>
                    <div className="button-container">
                      <button className={`check-button ${todo.completed ? 'completed' : ''}`} onClick={() => handleToggleTodo(index)}>
                        {todo.completed ? '↶' : '✓'}
                      </button>
                      <button className="delete-button" onClick={() => handleDeleteTodo(index)}>×</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoApp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;