import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://expense-wallet-backend.onrender.com/api',
});
// Business Units
export const createBusinessUnit = (payload) =>
  api.post('/admin/business-units', payload);

// Users
export const createUser   = (payload) => api.post('/admin/users', payload);
export const deleteUser   = (userId)  => api.delete(`/admin/users/${userId}`);
export const getAdminUsers = (buId)   => api.get(`/admin/business-units/${buId}/users`);

// Wallet top-up
export const topUpWallet    = (walletId, payload) => api.post(`/admin/wallets/${walletId}/topup`, payload);
export const getTopUpHistory = (walletId)          => api.get(`/admin/wallets/${walletId}/topup-history`);

export const getBusinessUnits = () => api.get('/business-units');
export const getWallet = (buId) => api.get(`/business-units/${buId}/wallet`);
export const getTransactions = (buId) => api.get(`/business-units/${buId}/transactions`);
export const getUsers = (buId) => api.get(`/business-units/${buId}/users`);

export const submitPayment = (payload) =>
  api.post('/payments', {
    ...payload,
    idempotency_key: payload.idempotency_key || uuidv4(),
  });

/**
 * Fire N concurrent payment requests simultaneously.
 * Returns array of settled promises.
 */
export const simulateConcurrentPayments = (walletId, userIds, amount, vendorName, count) => {
  const requests = Array.from({ length: count }, (_, i) =>
    submitPayment({
      wallet_id:  walletId,
      user_id:    userIds[i % userIds.length],
      amount,
      vendor_name: vendorName,
      idempotency_key: uuidv4(),
    }).then((r) => ({ status: 'fulfilled', data: r.data }))
      .catch((e) => ({ status: 'rejected', reason: e.response?.data || e.message }))
  );
  return Promise.all(requests);
};
