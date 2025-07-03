import React, { useState } from 'react';
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

function App() {
  const [quote, setQuote] = useState(SITH_QUOTES[0]);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

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
      </main>
    </div>
  );
}

export default App;
