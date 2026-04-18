import { useEffect, useState } from 'react';
import { getBusinessUnits } from '../api/client';
import AddBUForm   from '../components/admin/AddBUForm';
import AddUserForm from '../components/admin/AddUserForm';
import TopUpForm   from '../components/admin/TopUpForm';
import './AdminPage.css';

export default function AdminPage() {
  const [units, setUnits]   = useState([]);
  const [activeTab, setTab] = useState('bu');

  useEffect(() => {
    getBusinessUnits().then((r) => setUnits(r.data.data));
  }, []);

  // Callbacks from child forms — update local state without refetching everything
  const onBUCreated = ({ bu, wallet }) => {
    setUnits((prev) => [...prev, { ...bu, wallet_id: wallet.id, balance: wallet.balance, currency: 'INR' }]);
  };

  const onUserCreated = () => {
    // no state to update in parent; user list lives in BU detail
  };

  const onTopUp = ({ businessUnitId, balanceAfter }) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === businessUnitId ? { ...u, balance: balanceAfter } : u))
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin panel</h2>
        <p className="admin-subheading">Manage business units, users, and wallet funds</p>
      </div>

      <div className="admin-tabs">
        {[
          { key: 'bu',     label: 'Add BU'      },
          { key: 'user',   label: 'Add user'    },
          { key: 'topup',  label: 'Top up wallet' },
        ].map((t) => (
          <button
            key={t.key}
            className={`admin-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <div className="admin-form-area">
          {activeTab === 'bu'    && <AddBUForm   onCreated={onBUCreated} />}
          {activeTab === 'user'  && <AddUserForm  businessUnits={units} onCreated={onUserCreated} />}
          {activeTab === 'topup' && <TopUpForm    businessUnits={units} onTopUp={onTopUp} />}
        </div>

        <div className="admin-summary-area">
          <div className="admin-card">
            <h3 className="admin-section-title">Current business units</h3>
            {units.length === 0 && <p className="empty-state">No BUs yet</p>}
            {units.map((bu, i) => {
              const colors = ['#E6F1FB','#E1F5EE','#EEEDFE','#FAECE7','#FAEEDA','#EAF3DE'];
              const texts  = ['#0C447C','#085041','#3C3489','#712B13','#633806','#27500A'];
              const c = i % colors.length;
              return (
                <div key={bu.id} className="admin-bu-row">
                  <div className="admin-bu-avatar" style={{ background: colors[c], color: texts[c] }}>
                    {bu.code?.slice(0, 2)}
                  </div>
                  <div className="admin-bu-info">
                    <span className="admin-bu-name">{bu.name}</span>
                    <span className="admin-bu-meta">{bu.code} · Wallet #{bu.wallet_id}</span>
                  </div>
                  <div className="admin-bu-balance">
                    ₹{parseFloat(bu.balance || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}