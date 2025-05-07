import { useState, useEffect } from 'react';

const TIMER_PRESETS = [
  { label: '25/5', focus: 25, break: 5 },
  { label: '45/15', focus: 45, break: 15 },
  { label: '60/20', focus: 60, break: 20 },
];

function FocusTimer({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default to 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(TIMER_PRESETS[0]);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [initialDuration, setInitialDuration] = useState(25 * 60); // Track the session's starting duration

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete(initialDuration); // Pass the focus duration in seconds
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, initialDuration]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(selectedPreset.focus * 60);
    setInitialDuration(selectedPreset.focus * 60);
    setIsActive(false);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.focus * 60);
    setInitialDuration(preset.focus * 60);
    setIsActive(false);
  };

  const handleCustomTimeChange = (minutes) => {
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
    setInitialDuration(minutes * 60);
    setIsActive(false);
  };

  return (
    <div style={{
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      alignItems: 'center',
    }}>
      <h2 style={{
        color: '#333',
        marginBottom: '0',
        fontWeight: 700
      }}>Focus Session</h2>

      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '0',
      }}>
        {TIMER_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetChange(preset)}
            className="btn"
            style={{
              background: selectedPreset.label === preset.label ? '#4F46E5' : '#E5E7EB',
              color: selectedPreset.label === preset.label ? 'white' : '#374151',
              fontWeight: 600,
              boxShadow: selectedPreset.label === preset.label ? '0 2px 8px rgba(16,185,129,0.10)' : 'none',
              border: 'none',
              padding: '8px 16px',
              minWidth: '80px',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '0',
      }}>
        <label htmlFor="customTime" style={{fontWeight: 500}}>Custom Time (minutes):</label>
        <input
          type="number"
          id="customTime"
          min="1"
          max="120"
          value={customMinutes}
          onChange={(e) => handleCustomTimeChange(parseInt(e.target.value) || 25)}
          style={{
            width: '70px',
            fontSize: '1rem',
          }}
        />
      </div>
      
      <div style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        margin: '0 0 10px 0',
        letterSpacing: '2px',
        color: '#4F46E5',
      }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{
        display: 'flex',
        gap: '14px',
        justifyContent: 'center',
        marginTop: '0',
      }}>
        <button 
          onClick={() => setIsActive(!isActive)}
          className="btn"
          style={{
            background: isActive ? '#10B981' : '#4F46E5',
            color: 'white',
            minWidth: '110px',
          }}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>

        <button 
          onClick={resetTimer}
          className="btn"
          style={{
            background: '#6B7280',
            color: 'white',
            minWidth: '110px',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default FocusTimer; 