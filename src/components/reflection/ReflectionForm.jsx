import { useState } from 'react';

function ReflectionForm({ onSubmit, intention, focusDuration }) {
  const [reflection, setReflection] = useState('');
  const [ratings, setRatings] = useState({
    focus: 3,
    presence: 3,
    barakah: 3
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reflection, ratings);
  };

  const RatingScale = ({ label, value, onChange }) => (
    <div style={{ marginBottom: '15px' }}>
      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>{label}</label>
      <div style={{ display: 'flex', gap: '10px' }}>
        {[1, 2, 3, 4, 5].map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => onChange(number)}
            className="btn"
            style={{
              background: value === number ? '#4F46E5' : '#E5E7EB',
              color: value === number ? 'white' : '#374151',
              fontWeight: 600,
              border: 'none',
              padding: '8px 12px',
              minWidth: '40px',
              boxShadow: value === number ? '0 2px 8px rgba(16,185,129,0.10)' : 'none',
            }}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      width: '100%'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '0',
        fontWeight: 700
      }}>Session Reflection</h2>

      <div style={{ marginBottom: '0' }}>
        <label 
          htmlFor="reflection" 
          style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontWeight: 500,
            fontSize: '1.1rem',
            color: '#1F2937'
          }}
        >
          What aspect of Barakah did you notice in your session today?
        </label>
        <textarea
          id="reflection"
          rows="4"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          style={{
            width: '100%',
            fontSize: '1.05rem',
          }}
          placeholder="Share your thoughts..."
        />
      </div>

      <RatingScale 
        label="Focus" 
        value={ratings.focus} 
        onChange={(value) => setRatings({...ratings, focus: value})} 
      />
      
      <RatingScale 
        label="Presence" 
        value={ratings.presence} 
        onChange={(value) => setRatings({...ratings, presence: value})} 
      />
      
      <RatingScale 
        label="Barakah" 
        value={ratings.barakah} 
        onChange={(value) => setRatings({...ratings, barakah: value})} 
      />

      <button 
        type="submit"
        className="btn"
        style={{ width: '100%', marginTop: '8px' }}
      >
        Save Reflection
      </button>
    </form>
  );
}

export default ReflectionForm; 