import { useState } from 'react';
import { simulateConcurrentPayments } from '../api/client';

export default function SimulationPanel({ walletId, users, onDone }) {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const run = async (scenario) => {
    setRunning(true);
    setResults(null);

    const userIds = users.map((u) => u.id);
    let outcomes;

    if (scenario === 'valid') {
      // 10 payments of 500 simultaneously
      outcomes = await simulateConcurrentPayments(walletId, userIds, 500, 'Concurrent Test Vendor', 10);
    } else {
      // 2 payments of 1500 on a wallet with 2000 — requires wallet to be at 2000 first
      // (user should reset wallet manually or use the edge-case BU)
      outcomes = await simulateConcurrentPayments(walletId, userIds, 1500, 'Edge Case Vendor', 2);
    }

    const succeeded = outcomes.filter((o) => o.status === 'fulfilled' && o.data?.data?.status === 'success').length;
    const failed    = outcomes.filter((o) => o.status === 'fulfilled' && o.data?.data?.status === 'failed').length;
    const errored   = outcomes.filter((o) => o.status === 'rejected').length;

    setResults({ outcomes, succeeded, failed, errored });
    setRunning(false);
    onDone();
  };

  return (
    <div className="simulation-panel">
      <h3>Concurrency Simulation</h3>
      <div className="sim-buttons">
        <button onClick={() => run('valid')}   disabled={running}>
          {running ? 'Running...' : '▶ Run: 10× ₹500 simultaneously'}
        </button>
        <button onClick={() => run('edge')}    disabled={running} className="danger">
          {running ? 'Running...' : '▶ Run: 2× ₹1500 (edge case)'}
        </button>
      </div>

      {results && (
        <div className="sim-results">
          <div className="sim-summary">
            <span className="ok">✓ {results.succeeded} succeeded</span>
            <span className="fail">✗ {results.failed} failed (business)</span>
            {results.errored > 0 && <span className="err">⚠ {results.errored} errored</span>}
          </div>
          <div className="sim-detail">
            {results.outcomes.map((o, i) => (
              <div key={i} className={`sim-row ${o.data?.data?.status || 'error'}`}>
                #{i + 1}: {o.status === 'fulfilled'
                  ? `${o.data.data.status} — ${o.data.data.status === 'success'
                    ? `balance → ₹${o.data.data.balanceAfter?.toLocaleString('en-IN')}`
                    : o.data.data.reason}`
                  : `ERROR: ${o.reason.data.reason}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}