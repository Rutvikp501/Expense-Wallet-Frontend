import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { submitPayment } from '../api/client';

export default function PaymentForm({ walletId, users, onSuccess }) {
  const [form, setForm] = useState({ user_id: '', amount: '', vendor_name: '', description: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await submitPayment({
        wallet_id:      walletId,
        user_id:        parseInt(form.user_id),
        amount:         parseFloat(form.amount),
        vendor_name:    form.vendor_name,
        description:    form.description,
        idempotency_key: uuidv4(),
      });
      setResult({ ok: true, data: res.data.data });
      onSuccess();
    } catch (err) {
      setResult({ ok: false, data: err.response?.data });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>Submit Payment</h3>
      <select name="user_id" value={form.user_id} onChange={handleChange} required>
        <option value="">Select user</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <input name="amount"      type="number" placeholder="Amount (INR)" min="1" step="0.01"
             value={form.amount}      onChange={handleChange} required />
      <input name="vendor_name" type="text"   placeholder="Vendor name"
             value={form.vendor_name} onChange={handleChange} required />
      <input name="description" type="text"   placeholder="Description (optional)"
             value={form.description} onChange={handleChange} />
      <button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay'}</button>

      {result && (
        <div className={`pay-result ${result.ok ? 'success' : 'error'}`}>
          {result.ok
            ? `✓ Payment #${result.data.paymentId} succeeded. New balance: ₹${result.data.balanceAfter?.toLocaleString('en-IN')}`
            : `✗ ${result.data?.data?.reason || result.data?.error || 'Error'}`
          }
        </div>
      )}
    </form>
  );
}