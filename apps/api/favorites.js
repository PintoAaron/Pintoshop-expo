import client from './client';


const getFavorites = (customerId) =>
  client.get(`/customers/${customerId}/favorites/`);

const addFavorite = (customerId, productId) =>
  client.post(`/customers/${customerId}/favorites/`, { product_id: productId });

const removeFavorite = (customerId, favoriteId) =>
  client.delete(`/customers/${customerId}/favorites/${favoriteId}/`);

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
};
