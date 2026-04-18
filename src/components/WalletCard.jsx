export default function WalletCard({ wallet, loading }) {
  if (loading) return <div className="wallet-card loading">Loading...</div>;
  if (!wallet)  return null;

  return (
    <div className="wallet-card">
      <div className="wallet-label">Available Balance</div>
      <div className="wallet-balance">
        ₹{parseFloat(wallet.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </div>
      <div className="wallet-currency">{wallet.currency} · {wallet.business_unit_name}</div>
      <div className="wallet-updated">Updated {new Date(wallet.updated_at).toLocaleTimeString()}</div>
    </div>
  );
}