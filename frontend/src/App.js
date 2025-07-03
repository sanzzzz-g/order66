import React, { useState, useEffect } from 'react';
import './App.css';
import PomodoroTimer from './PomodoroTimer';

const SITH_QUOTES = [
  'Peace is a lie, there is only passion.',
  'Through passion, I gain strength.',
  'Through strength, I gain power.',
  'Through power, I gain victory.',
  'Through victory, my chains are broken.',
  'The Force shall free me.'
];

function getTodayString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

function App() {
  const [quote, setQuote] = useState(SITH_QUOTES[0]);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('pomodoroHistory');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  }, [history]);

  const handleClearHistory = () => {
    setHistory({});
  };

  const today = getTodayString();
  const todayHistory = history[today] || [];
  const sessionLength = 25;
  const todayPomodoros = todayHistory.filter(h => h.type === 'work').length;
  const todayFocusMinutes = todayPomodoros * sessionLength;

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, done: false }]);
      setTask('');
    }
  };

  const toggleTask = idx => {
    setTasks(tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };

  const removeTask = idx => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const randomQuote = () => {
    const next = SITH_QUOTES[Math.floor(Math.random() * SITH_QUOTES.length)];
    setQuote(next);
  };

  return (
    <div className="SithApp">
      <header className="SithHeader">
        <h1>Order 66 Productivity</h1>
        <p className="SithMotto">"{quote}"</p>
        <button className="SithButton" onClick={randomQuote}>Inspire Me</button>
      </header>
      <main>
        <section className="SithSection">
          <h2>To-Do List</h2>
          <div className="SithTodoInput">
            <input
              type="text"
              value={task}
              onChange={e => setTask(e.target.value)}
              placeholder="What is thy bidding, my master?"
            />
            <button className="SithButton" onClick={addTask}>Add</button>
          </div>
          <ul className="SithTodoList">
            {tasks.map((t, i) => (
              <li key={i} className={t.done ? 'done' : ''}>
                <span onClick={() => toggleTask(i)}>{t.text}</span>
                <button className="SithRemove" onClick={() => removeTask(i)}>X</button>
              </li>
            ))}
          </ul>
        </section>
        <section className="SithSection">
          <h2>Pomodoro Timer</h2>
          <PomodoroTimer />
        </section>
        <section className="SithSection">
          <h2>Stats & History</h2>
          <button className="SithButton" onClick={() => setShowStats(s => !s)}>{showStats ? 'Hide Stats' : 'Show Stats'}</button>
          {showStats && (
            <div style={{background: '#2d0606', color: '#fff', borderRadius: 8, padding: 12, marginTop: 10}}>
              <h3 style={{margin: '0 0 8px 0', color: '#ff2d2d'}}>Today's Stats</h3>
              <div>Pomodoros completed: <b>{todayPomodoros}</b></div>
              <div>Total focus time: <b>{todayFocusMinutes}</b> min</div>
              <h4 style={{margin: '12px 0 4px 0', color: '#ff2d2d'}}>History</h4>
              <ul style={{maxHeight: 120, overflowY: 'auto', padding: 0, margin: 0, listStyle: 'none'}}>
                {todayHistory.length === 0 && <li>No Pomodoros yet today.</li>}
                {todayHistory.map((h, i) => (
                  <li key={i} style={{marginBottom: 4}}>
                    {h.type === 'work' ? 'Pomodoro completed at ' : ''}
                    {new Date(h.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </li>
                ))}
              </ul>
              <button className="SithButton" style={{marginTop: 8}} onClick={handleClearHistory}>Clear History</button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
