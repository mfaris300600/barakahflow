import { useEffect, useState } from 'react';

function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    streak: 0,
    totalSessions: 0,
    totalFocusTime: 0, // minutes
    averageRatings: { focus: 0, presence: 0, barakah: 0 }
  });

  useEffect(() => {
    const loaded = JSON.parse(localStorage.getItem('barakahflow_sessions') || '[]');
    setSessions(loaded);
    // Calculate stats
    if (loaded.length > 0) {
      // Sort sessions by timestamp descending
      const sorted = [...loaded].sort((a, b) => b.timestamp - a.timestamp);
      // Total sessions
      const totalSessions = loaded.length;
      // Total focus time (in minutes)
      const totalFocusTime = Math.round(loaded.reduce((sum, s) => sum + (s.focusDuration || 0), 0) / 60);
      // Average ratings
      const avg = (key) => loaded.reduce((sum, s) => sum + (s.ratings?.[key] || 0), 0) / totalSessions;
      const averageRatings = {
        focus: avg('focus').toFixed(1),
        presence: avg('presence').toFixed(1),
        barakah: avg('barakah').toFixed(1)
      };
      // Streak calculation (days in a row with a session)
      let streak = 1;
      let prev = new Date(sorted[0].timestamp);
      for (let i = 1; i < sorted.length; i++) {
        const curr = new Date(sorted[i].timestamp);
        const diff = (prev - curr) / (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          streak++;
          prev = curr;
        } else {
          break;
        }
      }
      setStats({ streak, totalSessions, totalFocusTime, averageRatings });
    } else {
      setStats({
        streak: 0,
        totalSessions: 0,
        totalFocusTime: 0,
        averageRatings: { focus: 0, presence: 0, barakah: 0 }
      });
    }
  }, []);

  const StatCard = ({ title, value, subtitle }) => (
    <div className="card" style={{
      padding: '20px',
      textAlign: 'center',
      marginBottom: 0,
      boxShadow: '0 1px 4px rgba(31,41,55,0.04)'
    }}>
      <h3 style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '5px', fontWeight: 600 }}>{title}</h3>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>{value}</div>
      {subtitle && <div style={{ color: '#6B7280', fontSize: '0.95rem' }}>{subtitle}</div>}
    </div>
  );

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0',
      width: '100%'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#1F2937',
        marginBottom: '30px',
        fontWeight: 700
      }}>Your BarakahFlow Dashboard</h2>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatCard 
          title="Current Streak" 
          value={`${stats.streak} days`}
          subtitle="Keep it up!"
        />
        <StatCard 
          title="Total Sessions" 
          value={stats.totalSessions}
          subtitle="Focus sessions completed"
        />
        <StatCard 
          title="Total Focus Time" 
          value={`${stats.totalFocusTime} min`}
          subtitle="Time spent in deep work"
        />
        <StatCard 
          title="Avg. Focus Rating" 
          value={stats.averageRatings.focus}
          subtitle="/5"
        />
        <StatCard 
          title="Avg. Presence Rating" 
          value={stats.averageRatings.presence}
          subtitle="/5"
        />
        <StatCard 
          title="Avg. Barakah Rating" 
          value={stats.averageRatings.barakah}
          subtitle="/5"
        />
      </div>

      {/* Recent Sessions */}
      <div className="card" style={{
        padding: '24px',
        marginBottom: 0,
        boxShadow: '0 1px 4px rgba(31,41,55,0.04)'
      }}>
        <h3 style={{
          color: '#1F2937',
          marginBottom: '20px',
          fontWeight: 700
        }}>Recent Sessions</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sessions.length === 0 && <div style={{color:'#888'}}>No sessions yet. Start your first session!</div>}
          {sessions.slice().reverse().slice(0, 10).map((session, index) => (
            <div 
              key={index}
              className="card"
              style={{
                padding: '18px',
                backgroundColor: '#F9FAFB',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                marginBottom: 0,
                boxShadow: '0 1px 4px rgba(31,41,55,0.04)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontWeight: '600', color: '#1F2937' }}>{session.intention}</div>
                <div style={{ color: '#6B7280', fontWeight: 500 }}>{new Date(session.timestamp).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.98rem', color: '#6B7280', marginBottom: '4px' }}>
                <div>Duration: {Math.round((session.focusDuration || 0) / 60)} min</div>
                <div>Focus: {session.ratings?.focus || '-'} /5</div>
                <div>Presence: {session.ratings?.presence || '-'} /5</div>
                <div>Barakah: {session.ratings?.barakah || '-'} /5</div>
              </div>
              {session.reflection && (
                <div style={{marginTop:'8px', color:'#374151', fontStyle:'italic', fontSize:'1.01rem'}}>
                  "{session.reflection}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 