import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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

const SITH_RANKS = [
  { title: 'Acolyte', required: 0 },
  { title: 'Apprentice', required: 100 },
  { title: 'Sith Lord', required: 200 },
  { title: 'Sith Master', required: 300 },
  { title: 'Darth', required: 400 },
  { title: 'Emperor', required: 500 }
];

const SITH_AVATARS = [
  { name: 'Darth Vader', color: '#1a0000', unlock: 0 },
  { name: 'Darth Maul', color: '#2d0606', unlock: 5 },
  { name: 'Emperor Palpatine', color: '#222233', unlock: 15 },
  { name: 'Count Dooku', color: '#2a161a', unlock: 30 },
  { name: 'Kylo Ren', color: '#1a0d0d', unlock: 50 }
];

const SITH_BADGES = [
  { name: 'First Pomodoro', condition: (count) => count >= 1 },
  { name: 'Order 66', condition: (count) => count >= 66 },
  { name: 'Sith Streak 3', condition: (streak) => streak >= 3 },
  { name: 'Sith Streak 7', condition: (streak) => streak >= 7 }
];

const SITH_MOTIVATION = [
  'You have grown stronger in the Dark Side.',
  'Another step towards ultimate power.',
  'The Force is with you, young Sith.',
  'Your chains are breaking.',
  'Impressive. Most impressive.',
  'You are fulfilling your destiny.'
];

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  const [quote, setQuote] = useState(SITH_QUOTES[0]);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [avatarIdx, setAvatarIdx] = useState(0);

  // Pomodoro timer state
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Section refs for scrolling
  const tasksRef = useRef(null);
  const pomoRef = useRef(null);
  const calendarRef = useRef(null);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarTasks, setCalendarTasks] = useState({}); // { 'YYYY-MM-DD': [task, ...] }
  const [calendarTaskInput, setCalendarTaskInput] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [xp, setXp] = useState(0);
  const [lastPomodoroDate, setLastPomodoroDate] = useState(getTodayKey());
  const [streak, setStreak] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [rewardMsg, setRewardMsg] = useState('');

  // Track which tasks have just been completed for animation
  const [justCompleted, setJustCompleted] = useState([]);

  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sith_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authError, setAuthError] = useState('');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });

  // Simple in-memory user store for demo
  const [userStore, setUserStore] = useState(() => {
    const saved = localStorage.getItem('sith_user_store');
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    localStorage.setItem('sith_user_store', JSON.stringify(userStore));
  }, [userStore]);

  // Update timer when pomodoroMinutes changes (if not running)
  React.useEffect(() => {
    if (!isRunning) setSecondsLeft(pomodoroMinutes * 60);
  }, [pomodoroMinutes, isRunning]);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setTimeout(onPomodoroComplete, 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(pomodoroMinutes * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, done: false, rewarded: false }]);
      setTask('');
    }
  };

  const toggleTask = idx => {
    setTasks(tasks => {
      const newTasks = tasks.map((t, i) => {
        if (i === idx) {
          if (!t.done && !t.rewarded) {
            // Mark as just completed for animation
            setJustCompleted(jc => [...jc, idx]);
            return { ...t, done: true, rewarded: true };
          } else if (t.done) {
            return { ...t, done: false };
          }
        }
        return t;
      });
      if (!tasks[idx].done && !tasks[idx].rewarded) {
        setXp(xp => xp + 10);
      }
      return newTasks;
    });
    // Remove animation after it plays
    setTimeout(() => setJustCompleted(jc => jc.filter(i => i !== idx)), 700);
  };

  const removeTask = idx => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const randomQuote = () => {
    const next = SITH_QUOTES[Math.floor(Math.random() * SITH_QUOTES.length)];
    setQuote(next);
  };

  const currentAvatar = SITH_AVATARS[avatarIdx];

  // Determine background style based on selected Sith
  let bgImage = null;
  if (currentAvatar.name === 'Darth Vader') bgImage = '/darthvader.png';
  if (currentAvatar.name === 'Darth Maul') bgImage = '/darthmaul.png';
  if (currentAvatar.name === 'Emperor Palpatine') bgImage = '/ep.png';
  if (currentAvatar.name === 'Count Dooku') bgImage = '/cd.png';
  if (currentAvatar.name === 'Kylo Ren') bgImage = '/kr.png';

  const backgroundStyle = bgImage
    ? {
        background: `linear-gradient(rgba(10,10,10,0.65), rgba(10,10,10,0.78)), url('${bgImage}') center center / cover no-repeat`,
        minHeight: '100vh',
        color: '#b1060f',
      }
    : {
        background: `linear-gradient(135deg, ${currentAvatar.color} 0%, #1a0d0d 100%)`,
        minHeight: '100vh',
        color: '#b1060f',
      };

  // Sidebar navigation
  const scrollToSection = (ref) => {
    setSidebarOpen(false);
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calendar logic
  const getDateKey = (date) => date.toISOString().slice(0, 10);
  const selectedDateKey = getDateKey(calendarDate);
  const selectedDateTasks = calendarTasks[selectedDateKey] || [];

  const addCalendarTask = () => {
    if (calendarTaskInput.trim()) {
      setCalendarTasks(prev => ({
        ...prev,
        [selectedDateKey]: [...selectedDateTasks, calendarTaskInput.trim()]
      }));
      setCalendarTaskInput('');
    }
  };

  // Pomodoro complete logic
  const onPomodoroComplete = () => {
    const today = getTodayKey();
    setPomodoroCount((prev) => prev + 1);
    setXp((prev) => prev + pomodoroMinutes);
    // Streak logic
    if (lastPomodoroDate === today) {
      // Already did one today, streak unchanged
    } else if (
      new Date(today).getTime() - new Date(lastPomodoroDate).getTime() === 86400000
    ) {
      setStreak((prev) => prev + 1);
    } else {
      setStreak(1);
    }
    setLastPomodoroDate(today);
    // Show reward modal/message
    setRewardMsg(
      `${SITH_MOTIVATION[Math.floor(Math.random() * SITH_MOTIVATION.length)]}\n+${pomodoroMinutes} XP earned!`
    );
    setShowReward(true);
  };

  // Sith rank logic
  const currentRankIdx = SITH_RANKS.map(r => r.required).filter(r => xp >= r).length - 1;
  const currentRank = SITH_RANKS[currentRankIdx];
  const nextRank = SITH_RANKS[currentRankIdx + 1];
  const rankProgress = nextRank ? (xp - currentRank.required) / (nextRank.required - currentRank.required) : 1;

  // Temporarily unlock all avatars
  const unlockedAvatars = SITH_AVATARS;
  const handleAvatarChange = (idx) => setAvatarIdx(idx);

  // Badges
  const earnedBadges = SITH_BADGES.filter(b => b.condition(pomodoroCount, streak));

  useEffect(() => {
    if (user) localStorage.setItem('sith_user', JSON.stringify(user));
    else localStorage.removeItem('sith_user');
  }, [user]);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModal(true);
    setAuthError('');
    setAuthForm({ username: '', password: '' });
  };
  const closeAuth = () => setAuthModal(false);

  const handleAuthInput = e => {
    setAuthForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSignUp = e => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) {
      setAuthError('Please enter username and password.');
      return;
    }
    if (userStore[authForm.username]) {
      setAuthError('Username already exists.');
      return;
    }
    setUserStore(store => ({ ...store, [authForm.username]: { password: authForm.password } }));
    setUser({ username: authForm.username, guest: false });
    setAuthModal(false);
  };

  const handleSignIn = e => {
    e.preventDefault();
    if (!authForm.username || !authForm.password) {
      setAuthError('Please enter username and password.');
      return;
    }
    if (!userStore[authForm.username] || userStore[authForm.username].password !== authForm.password) {
      setAuthError('Invalid username or password.');
      return;
    }
    setUser({ username: authForm.username, guest: false });
    setAuthModal(false);
  };

  const handleGuest = () => {
    setUser({ username: 'Guest', guest: true });
    setAuthModal(false);
  };

  const handleLogout = () => setUser(null);

  return (
    <div className="SithLayout">
      {/* Auth Modal */}
      {authModal && (
        <div className="SithRewardModal" onClick={closeAuth}>
          <div className="SithRewardContent" onClick={e => e.stopPropagation()}>
            <h2>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
            <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={authForm.username}
                onChange={handleAuthInput}
                autoFocus
                style={{ marginBottom: '0.7rem', width: '100%' }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={authForm.password}
                onChange={handleAuthInput}
                style={{ marginBottom: '0.7rem', width: '100%' }}
              />
              {authError && <div style={{ color: '#b1060f', marginBottom: '0.7rem' }}>{authError}</div>}
              <button className="SithButton" type="submit" style={{ width: '100%' }}>
                {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>
            <button className="SithButton" style={{ width: '100%', marginTop: '0.7rem' }} onClick={handleGuest}>
              Continue as Guest
            </button>
            <div style={{ marginTop: '0.7rem' }}>
              {authMode === 'signin' ? (
                <span>Don&apos;t have an account? <button className="SithButton" style={{ padding: '0.2rem 0.7rem', fontSize: '0.95rem' }} onClick={() => setAuthMode('signup')}>Sign Up</button></span>
              ) : (
                <span>Already have an account? <button className="SithButton" style={{ padding: '0.2rem 0.7rem', fontSize: '0.95rem' }} onClick={() => setAuthMode('signin')}>Sign In</button></span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Top right auth buttons */}
      <div className="SithAuthTopRight">
        {user ? (
          <>
            <span className="SithUserStatus">{user.guest ? 'Guest' : user.username}</span>
            <button className="SithButton" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="SithButton" onClick={() => openAuth('signin')}>Sign In</button>
            <button className="SithButton" onClick={() => openAuth('signup')}>Sign Up</button>
          </>
        )}
      </div>
      {/* Reward Modal */}
      {showReward && (
        <div className="SithRewardModal" onClick={() => setShowReward(false)}>
          <div className="SithRewardContent">
            <h2>Pomodoro Complete!</h2>
            <p>{rewardMsg}</p>
            <button className="SithButton" onClick={() => setShowReward(false)}>Close</button>
          </div>
        </div>
      )}
      {/* Sidebar overlay for mobile/desktop */}
      <div className={`SithSidebarOverlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <nav className={`SithSidebarDrawer${sidebarOpen ? ' open' : ''}`}>
        <div className="SithSidebarTitle">
          <button className="SithSidebarClose" onClick={() => setSidebarOpen(false)}>&times;</button>
        </div>
        <ul>
          <li><button onClick={() => scrollToSection(tasksRef)}>Tasks</button></li>
          <li><button onClick={() => scrollToSection(pomoRef)}>Pomodoro</button></li>
          <li><button onClick={() => scrollToSection(calendarRef)}>Calendar</button></li>
        </ul>
      </nav>
      <div className="SithApp" style={backgroundStyle}>
        <header className="SithHeader">
          <button className="SithSidebarMenuBtn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="SithAvatarRow">
            <span className="SithAvatarName">{currentAvatar.name}</span>
            <div className="SithAvatarPicker">
              {SITH_AVATARS.map((a, i) => (
                <button
                  key={a.name}
                  className={`SithAvatarPickBtn ${i === avatarIdx ? 'selected' : ''}`}
                  onClick={() => handleAvatarChange(i)}
                  title={a.name}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <div className="SithRankBar">
            <span className="SithRank">{currentRank.title} ({xp} XP)</span>
            <div className="SithRankProgress">
              <div className="SithRankProgressFill" style={{ width: `${rankProgress * 100}%` }} />
            </div>
            {nextRank && <span className="SithRankNext">Next: {nextRank.title} ({nextRank.required} XP)</span>}
          </div>
          <div className="SithStreak">🔥 Streak: {streak} days</div>
          <div className="SithBadges">
            {earnedBadges.map(b => <span key={b.name} className="SithBadge">{b.name}</span>)}
          </div>
          <h1>Order 66 Productivity</h1>
          <p className="SithMotto">"{quote}"</p>
          <div className="SithHeaderActions">
            <button className="SithButton" onClick={randomQuote}>Inspire Me</button>
            <a
              className="SithButton SithSpotifyBtn"
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Spotify
            </a>
          </div>
        </header>
        <main>
          <section className="SithSection" ref={tasksRef}>
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
                  {t.done && justCompleted.includes(i) && <div className="SithTaskLight" />}
                  <span onClick={() => toggleTask(i)}>{t.text}</span>
                  <button className="SithRemove" onClick={() => removeTask(i)}>X</button>
                </li>
              ))}
            </ul>
          </section>
          <section className="SithSection" ref={pomoRef}>
            <h2>Pomodoro Timer</h2>
            <div className="SithPomodoroSettings">
              <label htmlFor="pomodoro-minutes">Minutes: </label>
              <input
                id="pomodoro-minutes"
                type="number"
                min="1"
                max="120"
                value={pomodoroMinutes}
                onChange={e => setPomodoroMinutes(Math.max(1, Math.min(120, Number(e.target.value))))}
                disabled={isRunning}
              />
            </div>
            <div className="SithPomodoro">
              <div className="SithTimerDisplay">{formatTime(secondsLeft)}</div>
              <div className="SithTimerControls">
                <button className="SithButton" onClick={startTimer} disabled={isRunning || secondsLeft === 0}>Start</button>
                <button className="SithButton" onClick={pauseTimer} disabled={!isRunning}>Pause</button>
                <button className="SithButton" onClick={resetTimer}>Reset</button>
              </div>
              {secondsLeft === 0 && <div className="SithTimerEnd">Pomodoro Complete! Embrace your power.</div>}
            </div>
          </section>
          <section className="SithSection" ref={calendarRef}>
            <h2>Calendar</h2>
            <div className="SithCalendarWrap">
              <Calendar
                onChange={setCalendarDate}
                value={calendarDate}
                className="SithCalendar"
              />
              <div className="SithCalendarTasks">
                <h3>Tasks for {selectedDateKey}</h3>
                <ul>
                  {selectedDateTasks.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
                <div className="SithTodoInput">
                  <input
                    type="text"
                    value={calendarTaskInput}
                    onChange={e => setCalendarTaskInput(e.target.value)}
                    placeholder="Add a task for this day"
                  />
                  <button className="SithButton" onClick={addCalendarTask}>Add</button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
