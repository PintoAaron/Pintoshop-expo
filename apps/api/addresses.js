import client from './client';

const getAddresses = (customerId) => client.get(`/customers/${customerId}/addresses/`);

export default {
  getAddresses,
};
