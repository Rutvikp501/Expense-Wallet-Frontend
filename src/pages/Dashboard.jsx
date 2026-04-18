import { useEffect, useState, useCallback } from 'react';
import { getBusinessUnits, getWallet, getTransactions, getUsers } from '../api/client';
import WalletCard from '../components/WalletCard';
import TransactionList from '../components/TransactionList';
import PaymentForm from '../components/PaymentForm';
import SimulationPanel from '../components/SimulationPanel';

export default function Dashboard() {
  const [units, setUnits]         = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [wallet, setWallet]       = useState(null);
  const [transactions, setTxns]   = useState([]);
  const [users, setUsers]         = useState([]);
  const [walletLoading, setWL]    = useState(false);

  useEffect(() => {
    getBusinessUnits().then((r) => {
      setUnits(r.data.data);
      if (r.data.data.length) setActiveTab(r.data.data[0].id);
    });
  }, []);

  const loadTabData = useCallback(async (buId) => {
    setWL(true);
    const [w, t, u] = await Promise.all([
      getWallet(buId),
      getTransactions(buId),
      getUsers(buId),
    ]);
    setWallet(w.data.data);
    setTxns(t.data.data);
    setUsers(u.data.data);
    setWL(false);
  }, []);

  useEffect(() => {
    if (activeTab) loadTabData(activeTab);
  }, [activeTab, loadTabData]);

  const refresh = () => loadTabData(activeTab);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Expense Wallet Manager</h1>
      </header>

      <nav className="bu-tabs">
        {units.map((bu) => (
          <button
            key={bu.id}
            className={`tab ${activeTab === bu.id ? 'active' : ''}`}
            onClick={() => setActiveTab(bu.id)}
          >
            {bu.name}
          </button>
        ))}
      </nav>

      {activeTab && (
        <div className="tab-content">
          <div className="left-panel">
            <WalletCard wallet={wallet} loading={walletLoading} />
            <PaymentForm walletId={wallet?.id} users={users} onSuccess={refresh} />
            <SimulationPanel walletId={wallet?.id} users={users} onDone={refresh} />
          </div>
          <div className="right-panel">
            <h3>Transaction History</h3>
            <TransactionList transactions={transactions} />
          </div>
        </div>
      )}
    </div>
  );
}