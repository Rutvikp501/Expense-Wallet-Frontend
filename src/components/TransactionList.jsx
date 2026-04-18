export default function TransactionList({ transactions }) {
  if (!transactions?.length) return <p className="empty">No transactions yet.</p>;

  return (
    <div className="txn-list">
      {transactions.map((t) => (
        <div key={t.id} className={`txn-row ${t.status}`}>
          <div className="txn-left">
            <span className="txn-vendor">{t.vendor_name}</span>
            <span className="txn-meta">{t.requested_by_name} · {new Date(t.created_at).toLocaleTimeString()}</span>
          </div>
          <div className="txn-right">
            <span className="txn-amount">₹{parseFloat(t.amount).toLocaleString('en-IN')}</span>
            <span className={`txn-status ${t.status}`}>{t.status}</span>
            {t.balance_after != null && (
              <span className="txn-balance-after">→ ₹{parseFloat(t.balance_after).toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}