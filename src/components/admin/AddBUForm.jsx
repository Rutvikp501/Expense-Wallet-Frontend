import { useState } from 'react';
import { createBusinessUnit } from '../../api/client';

export default function AddBUForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '', code: '', initial_balance: '', users_count: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await createBusinessUnit({
        name:            form.name.trim(),
        code:            form.code.trim().toUpperCase(),
        initial_balance: parseFloat(form.initial_balance) || 0,
      });
      setResult({ ok: true, message: `"${res.data.data.bu.name}" created with wallet ₹${parseFloat(res.data.data.wallet.balance).toLocaleString('en-IN')}` });
      setForm({ name: '', code: '', initial_balance: '' });
      onCreated(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to create BU';
      setResult({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-section-title">Add business unit</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row-2">
          <div className="field">
            <label>BU name</label>
            <input name="name" placeholder="e.g. Legal" value={form.name} onChange={set} required />
          </div>
          <div className="field">
            <label>Code (2–4 letters)</label>
            <input
              name="code" placeholder="e.g. LEG" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              maxLength={4} required
            />
          </div>
        </div>
        <div className="field">
          <label>Opening wallet balance (INR)</label>
          <input
            name="initial_balance" type="number" placeholder="e.g. 50000"
            value={form.initial_balance} onChange={set} min="0" step="1000"
          />
          <span className="field-hint">Leave 0 if you will top-up later</span>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating…' : 'Create business unit'}
        </button>
        {result && (
          <p className={`form-result ${result.ok ? 'ok' : 'err'}`}>{result.message}</p>
        )}
      </form>
    </div>
  );
}