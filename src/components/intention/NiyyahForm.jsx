import { useState } from 'react';

function NiyyahForm({ onSubmit }) {
  const [intention, setIntention] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (intention.trim()) {
      onSubmit(intention.trim());
      setIntention('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '100%'
    }}>
      <label htmlFor="intention" style={{ fontWeight: 600, color: '#1F2937', fontSize: '1.1rem' }}>
        What is your intention for this session?
      </label>
      <input
        id="intention"
        type="text"
        value={intention}
        onChange={e => setIntention(e.target.value)}
        placeholder="e.g. Finish project report, memorize Quran, etc."
        style={{
          width: '100%',
          fontSize: '1.05rem',
        }}
        autoFocus
      />
      <button
        type="submit"
        className="btn"
        style={{ width: '100%', marginTop: '8px' }}
        disabled={!intention.trim()}
      >
        Set Intention
      </button>
    </form>
  );
}

export default NiyyahForm;