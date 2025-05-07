import { useState } from 'react'
import NiyyahForm from './components/intention/NiyyahForm'
import FocusTimer from './components/timer/FocusTimer'
import BreakTimer from './components/timer/BreakTimer'
import ReflectionForm from './components/reflection/ReflectionForm'
import Dashboard from './components/dashboard/Dashboard'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('intention'); // 'intention', 'focus', 'break', 'reflection', or 'dashboard'
  const [intention, setIntention] = useState('');
  const [focusDuration, setFocusDuration] = useState(0); // in seconds

  // Navigation items
  const navItems = [
    { key: 'intention', label: 'Intention' },
    { key: 'focus', label: 'Focus Timer' },
    { key: 'reflection', label: 'Reflection' },
    { key: 'dashboard', label: 'Dashboard' },
  ];

  const handleIntentionSubmit = (intentionText) => {
    setIntention(intentionText);
    setCurrentView('focus');
  };

  const handleFocusComplete = (durationUsed) => {
    setFocusDuration(durationUsed);
    setCurrentView('break');
  };

  const handleBreakComplete = () => {
    setCurrentView('reflection');
  };

  const handleReflectionSubmit = (reflection, ratings) => {
    const session = {
      intention,
      focusDuration,
      reflection,
      ratings,
      timestamp: Date.now(),
    };
    const sessions = JSON.parse(localStorage.getItem('barakahflow_sessions') || '[]');
    sessions.push(session);
    localStorage.setItem('barakahflow_sessions', JSON.stringify(sessions));
    setCurrentView('dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F3F4F6',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        background: 'white',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 2px 8px rgba(31,41,55,0.06)',
        padding: '16px 0 12px 0',
        marginBottom: '32px',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        {/* Logo Placeholder */}
        <div style={{
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#4F46E5',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginRight: '32px',
        }}>
          <span style={{
            display: 'inline-block',
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #4F46E5 60%, #10B981 100%)',
            borderRadius: '50%',
            marginRight: '8px',
          }}></span>
          BarakahFlow
        </div>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentView(item.key)}
            className="btn"
            style={{
              background: currentView === item.key ? '#4F46E5' : 'transparent',
              color: currentView === item.key ? 'white' : '#1F2937',
              boxShadow: currentView === item.key ? '0 2px 8px rgba(16,185,129,0.10)' : 'none',
              border: currentView === item.key ? 'none' : '1px solid transparent',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '8px 18px',
              borderRadius: '6px',
              transition: 'background 0.2s, color 0.2s, box-shadow 0.2s',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        minHeight: '0',
      }}>
        {currentView === 'intention' && (
          <div className="card" style={{width: '100%', maxWidth: 500}}>
            <NiyyahForm onSubmit={handleIntentionSubmit} />
          </div>
        )}
        {currentView === 'focus' && (
          <div className="card" style={{width: '100%', maxWidth: 500}}>
            <FocusTimer onComplete={handleFocusComplete} />
          </div>
        )}
        {currentView === 'break' && (
          <div className="card" style={{width: '100%', maxWidth: 500}}>
            <BreakTimer onComplete={handleBreakComplete} />
          </div>
        )}
        {currentView === 'reflection' && (
          <div className="card" style={{width: '100%', maxWidth: 600}}>
            <ReflectionForm 
              onSubmit={handleReflectionSubmit}
              intention={intention}
              focusDuration={focusDuration}
            />
          </div>
        )}
        {currentView === 'dashboard' && (
          <div className="card" style={{width: '100%', maxWidth: 900}}>
            <Dashboard />
          </div>
        )}
        {/* Fallback if none match */}
        {["intention","focus","break","reflection","dashboard"].includes(currentView) ? null : (
          <div style={{color: 'red', textAlign: 'center'}}>No view matched. currentView: {currentView}</div>
        )}
      </main>
    </div>
  )
}

export default App
