import { useState } from 'react';
import { createUser } from '../../api/client';

export default function AddUserForm({ businessUnits, onCreated }) {
  const [form, setForm] = useState({
    business_unit_id: '', name: '', email: '', role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await createUser({
        business_unit_id: parseInt(form.business_unit_id),
        name:  form.name.trim(),
        email: form.email.trim().toLowerCase(),
        role:  form.role,
      });
      const bu = businessUnits.find((b) => b.id === parseInt(form.business_unit_id));
      setResult({ ok: true, message: `${res.data.data.name} added to ${bu?.name || 'BU'}` });
      setForm({ business_unit_id: form.business_unit_id, name: '', email: '', role: 'admin' });
      onCreated(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to create user';
      setResult({ ok: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-card">
      <h3 className="admin-section-title">Add user to business unit</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="field">
          <label>Business unit</label>
          <select name="business_unit_id" value={form.business_unit_id} onChange={set} required>
            <option value="">Select BU</option>
            {businessUnits.map((bu) => (
              <option key={bu.id} value={bu.id}>{bu.name} ({bu.code})</option>
            ))}
          </select>
        </div>
        <div className="form-row-2">
          <div className="field">
            <label>Full name</label>
            <input name="name" placeholder="e.g. Priya Menon" value={form.name} onChange={set} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" placeholder="priya@company.com" value={form.email} onChange={set} required />
          </div>
        </div>
        <div className="field">
          <label>Role</label>
          <select name="role" value={form.role} onChange={set}>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding…' : 'Add user'}
        </button>
        {result && (
          <p className={`form-result ${result.ok ? 'ok' : 'err'}`}>{result.message}</p>
        )}
      </form>
    </div>
  );
}