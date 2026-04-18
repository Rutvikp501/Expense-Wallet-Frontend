import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import './index.css';

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div>
      <nav style={{ background: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '1rem', padding: '.6rem 2rem' }}>
        <span style={{ color: 'white', fontWeight: 600, fontSize: '1rem', flex: 1 }}>Expense Wallets</span>
        {['dashboard', 'admin'].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: '.35rem .9rem', border: '1px solid',
              borderColor: page === p ? 'white' : 'rgba(255,255,255,.3)',
              borderRadius: 6, background: page === p ? 'white' : 'transparent',
              color: page === p ? '#1a1a2e' : 'white',
              fontSize: '.85rem', cursor: 'pointer', textTransform: 'capitalize',
            }}
          >
            {p}
          </button>
        ))}
      </nav>
      {page === 'dashboard' ? <Dashboard /> : <AdminPage />}
    </div>
  );
}