import client from './client';

const updateCartItem = (cartId, itemId, quantity) =>
  client.patch(`/carts/${cartId}/items/${itemId}/`, { quantity });

const removeItemFromCart = (cartId, itemId) =>
  client.delete(`/carts/${cartId}/items/${itemId}/`);

const getCart = (cartId) =>
  client.get(`/carts/${cartId}/`);

const getOrCreateCart = (customerId) =>
  client.get(`/customers/${customerId}/cart/`);

const addItemToCart = (cartId, productId, quantity) =>
  client.post(`/carts/${cartId}/items/`, {
    product_id: productId,
    quantity,
  });

export default {
  getOrCreateCart,
  addItemToCart,
  getCart,
  updateCartItem,
  removeItemFromCart,
};
