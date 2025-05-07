import { useState, useEffect } from 'react';

const BREAK_PRESETS = [
  { label: '5 min', duration: 5 },
  { label: '10 min', duration: 10 },
  { label: '15 min', duration: 15 },
];

function BreakTimer({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // Default to 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(BREAK_PRESETS[0]);
  const [customMinutes, setCustomMinutes] = useState(5);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimeLeft(selectedPreset.duration * 60);
    setIsActive(false);
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.duration * 60);
    setIsActive(false);
  };

  const handleCustomTimeChange = (minutes) => {
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
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
        color: '#92400E',
        marginBottom: '0',
        fontWeight: 700
      }}>Break Time</h2>

      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '0',
      }}>
        {BREAK_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetChange(preset)}
            className="btn"
            style={{
              background: selectedPreset.label === preset.label ? '#92400E' : '#FCD34D',
              color: selectedPreset.label === preset.label ? 'white' : '#92400E',
              fontWeight: 600,
              boxShadow: selectedPreset.label === preset.label ? '0 2px 8px rgba(146,64,14,0.10)' : 'none',
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
        <label htmlFor="customBreakTime" style={{fontWeight: 500}}>Custom Time (minutes):</label>
        <input
          type="number"
          id="customBreakTime"
          min="1"
          max="30"
          value={customMinutes}
          onChange={(e) => handleCustomTimeChange(parseInt(e.target.value) || 5)}
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
        color: '#92400E',
      }}>
        {formatTime(timeLeft)}
      </div>

      <div style={{
        marginBottom: '0',
        padding: '15px',
        backgroundColor: 'white',
        borderRadius: '6px',
        width: '100%',
        maxWidth: '350px',
        boxShadow: '0 1px 4px rgba(146,64,14,0.06)'
      }}>
        <p style={{ marginBottom: '10px', color: '#92400E', fontWeight: 600 }}>Take a moment to:</p>
        <ul style={{ textAlign: 'left', listStyleType: 'none', padding: 0, color: '#92400E' }}>
          <li>• Stretch your body</li>
          <li>• Take deep breaths</li>
          <li>• Make dhikr</li>
        </ul>
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
            background: isActive ? '#10B981' : '#92400E',
            color: 'white',
            minWidth: '110px',
          }}
        >
          {isActive ? 'Pause' : 'Start Break'}
        </button>

        <button 
          onClick={resetTimer}
          className="btn"
          style={{
            background: '#B45309',
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

export default BreakTimer; 