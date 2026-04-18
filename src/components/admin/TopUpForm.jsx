import { useState } from 'react';
import { topUpWallet, getTopUpHistory } from '../../api/client';

export default function TopUpForm({ businessUnits, onTopUp }) {
  const [form, setForm]       = useState({ wallet_id: '', amount: '', remarks: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const selectedBU = businessUnits.find((b) => b.wallet_id === parseInt(form.wallet_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await topUpWallet(parseInt(form.wallet_id), {
        amount:  parseFloat(form.amount),
        remarks: form.remarks.trim() || null,
      });
      const d = res.data.data;
      setResult({
        ok: true,
        message: `Topped up ₹${d.topUpAmount.toLocaleString('en-IN')}. New balance: ₹${d.balanceAfter.toLocaleString('en-IN')}`,
      });
      setForm({ ...form, amount: '', remarks: '' });
      onTopUp(d);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Top-up failed';
      setResult({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!form.wallet_id) return;
    const res = await getTopUpHistory(parseInt(form.wallet_id));
    setHistory(res.data.data);
    setShowHistory(true);
  };

  return (
    <div className="admin-card">
      <h3 className="admin-section-title">Top up wallet</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="field">
          <label>Business unit</label>
          <select name="wallet_id" value={form.wallet_id} onChange={set} required>
            <option value="">Select BU</option>
            {businessUnits.map((bu) => (
              <option key={bu.wallet_id} value={bu.wallet_id}>
                {bu.name} ({bu.code}) — ₹{parseFloat(bu.balance).toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>
        {selectedBU && (
          <div className="current-balance-display">
            Current balance: <strong>₹{parseFloat(selectedBU.balance).toLocaleString('en-IN')}</strong>
          </div>
        )}
        <div className="form-row-2">
          <div className="field">
            <label>Top-up amount (INR)</label>
            <input
              name="amount" type="number" placeholder="e.g. 25000"
              value={form.amount} onChange={set} min="0" step="500" required
            />
          </div>
          <div className="field">
            <label>Remarks (optional)</label>
            <input name="remarks" placeholder="e.g. Q2 budget allocation" value={form.remarks} onChange={set} />
          </div>
        </div>
        {form.amount && selectedBU && (
          <div className="topup-preview">
            After top-up: ₹{(parseFloat(selectedBU.balance) + parseFloat(form.amount || 0)).toLocaleString('en-IN')}
          </div>
        )}
        <div className="topup-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing…' : 'Add funds'}
          </button>
          {form.wallet_id && (
            <button type="button" className="btn-secondary" onClick={loadHistory}>
              View history
            </button>
          )}
        </div>
        {result && (
          <p className={`form-result ${result.ok ? 'ok' : 'err'}`}>{result.message}</p>
        )}
      </form>

      {showHistory && history.length > 0 && (
        <div className="topup-history">
          <div className="topup-history-title">Top-up history</div>
          {history.map((h) => (
            <div key={h.id} className="topup-history-row">
              <div>
                <span className="topup-amount">+₹{parseFloat(h.amount).toLocaleString('en-IN')}</span>
                {h.remarks && <span className="topup-remarks"> — {h.remarks}</span>}
              </div>
              <div className="topup-meta">
                ₹{parseFloat(h.balance_before).toLocaleString('en-IN')} → ₹{parseFloat(h.balance_after).toLocaleString('en-IN')} &middot; {new Date(h.created_at).toLocaleDateString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}