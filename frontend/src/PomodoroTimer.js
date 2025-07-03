import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_SESSION = 25; // minutes
const DEFAULT_BREAK = 5; // minutes
const DEFAULT_LONG_BREAK = 15; // minutes
const CYCLES_BEFORE_LONG_BREAK = 4;

const beepUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

function PomodoroTimer() {
  const [sessionLength, setSessionLength] = useState(DEFAULT_SESSION);
  const [breakLength, setBreakLength] = useState(DEFAULT_BREAK);
  const [longBreakLength, setLongBreakLength] = useState(DEFAULT_LONG_BREAK);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SESSION * 60);
  const [cycles, setCycles] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setTimeLeft((isSession ? sessionLength : (cycles % CYCLES_BEFORE_LONG_BREAK === 0 && cycles !== 0 ? longBreakLength : breakLength)) * 60);
    // eslint-disable-next-line
  }, [sessionLength, breakLength, longBreakLength, isSession]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSwitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [isRunning]);

  const handleSwitch = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (isSession) {
      setIsSession(false);
      setTimeLeft((cycles % CYCLES_BEFORE_LONG_BREAK === 0 && cycles !== 0 ? longBreakLength : breakLength) * 60);
    } else {
      setIsSession(true);
      setCycles(c => c + 1);
      setTimeLeft(sessionLength * 60);
    }
  };

  const handleStartPause = () => {
    setIsRunning(r => !r);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsSession(true);
    setCycles(0);
    setTimeLeft(sessionLength * 60);
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    setShowSettings(false);
    setIsRunning(false);
    setIsSession(true);
    setCycles(0);
    setTimeLeft(sessionLength * 60);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="SithPomodoro">
      <div style={{fontSize: 40, textAlign: 'center', color: isSession ? '#fff' : '#ff2d2d', textShadow: '0 0 8px #ff2d2d88'}}>
        {formatTime(timeLeft)}
      </div>
      <div style={{textAlign: 'center', margin: '0.5rem 0 1rem 0'}}>
        <span style={{fontWeight: 'bold', color: '#ff2d2d'}}>{isSession ? 'Session' : (cycles % CYCLES_BEFORE_LONG_BREAK === 0 && cycles !== 0 ? 'Long Break' : 'Break')}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10}}>
        <button className="SithButton" onClick={handleStartPause}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className="SithButton" onClick={handleReset}>Reset</button>
        <button className="SithButton" onClick={() => setShowSettings(s => !s)}>Settings</button>
      </div>
      <div style={{textAlign: 'center', marginBottom: 10, color: '#fff'}}>
        <span>Cycles completed: <b>{cycles}</b></span>
      </div>
      {showSettings && (
        <form onSubmit={handleSettingsSave} style={{background: '#2d0606', padding: 10, borderRadius: 8, border: '1px solid #ff2d2d', marginBottom: 10, color: '#fff'}}>
          <div style={{marginBottom: 8}}>
            <label>Session (min): <input type="number" min="1" max="60" value={sessionLength} onChange={e => setSessionLength(Number(e.target.value))} style={{background: '#1a0000', color: '#fff', border: '1px solid #ff2d2d', borderRadius: 4, marginLeft: 4}} /></label>
          </div>
          <div style={{marginBottom: 8}}>
            <label>Break (min): <input type="number" min="1" max="30" value={breakLength} onChange={e => setBreakLength(Number(e.target.value))} style={{background: '#1a0000', color: '#fff', border: '1px solid #ff2d2d', borderRadius: 4, marginLeft: 4}} /></label>
          </div>
          <div style={{marginBottom: 8}}>
            <label>Long Break (min): <input type="number" min="1" max="60" value={longBreakLength} onChange={e => setLongBreakLength(Number(e.target.value))} style={{background: '#1a0000', color: '#fff', border: '1px solid #ff2d2d', borderRadius: 4, marginLeft: 4}} /></label>
          </div>
          <button className="SithButton" type="submit">Save</button>
        </form>
      )}
      <audio ref={audioRef} src={beepUrl} preload="auto" />
    </div>
  );
}

export default PomodoroTimer; 