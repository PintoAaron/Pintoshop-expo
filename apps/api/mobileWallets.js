import client from '../api/client';

// Fetch all mobile wallets for a customer
const getMobileWallets = (customerId) =>
  client.get(`/customers/${customerId}/mobile-wallets/`);

// Add a new mobile wallet
const addMobileWallet = (customerId, data) =>
  client.post(`/customers/${customerId}/mobile-wallets/`, data);

// Send OTP to a wallet
const sendWalletOtp = (customerId, walletId) =>
  client.get(`/customers/${customerId}/mobile-wallets/${walletId}/send_otp`);

// Verify wallet with OTP
const verifyWalletOtp = (customerId, walletId, otp) =>
  client.patch(`/customers/${customerId}/mobile-wallets/${walletId}/verify/`, { otp });

export default {
  getMobileWallets,
  addMobileWallet,
  sendWalletOtp,
  verifyWalletOtp,
};
