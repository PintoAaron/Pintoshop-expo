import authStorage from '../auth/storage';
import client from './client';

// Shop API endpoints
const endpoints = {
    products: '/products/',
    collections: '/collections/', 
    carts: '/carts/',
    customers: '/customers/',
    orders: '/orders/'
};

// Products API
const getProducts = () => client.get(endpoints.products);
const getProduct = (id) => client.get(`${endpoints.products}${id}/`);
const getUserProducts = () => client.get('/products/me/');
const updateProduct = (id, productData) => client.put(`${endpoints.products}${id}/`, productData);
const deleteProduct = (id) => client.delete(`${endpoints.products}${id}/`);

// Collections API  
const getCollections = () => client.get(endpoints.collections);
const getCollection = (id) => client.get(`${endpoints.collections}${id}/`);

// Cart API
// Removed getCarts, createCart, getCart, deleteCart to avoid direct /carts/ requests

// Cart Items API
const addToCart = async (cartId, productId, quantity = 1) => {
    return client.post(`${endpoints.carts}${cartId}/items/`, {
        product_id: productId,
        quantity: quantity
    });
};

const updateCartItem = (cartId, itemId, quantity) => {
    return client.patch(`${endpoints.carts}${cartId}/items/${itemId}/`, {
        quantity: quantity
    });
};

const removeFromCart = (cartId, itemId) => {
    return client.delete(`${endpoints.carts}${cartId}/items/${itemId}/`);
};

const getCartItems = (cartId) => client.get(`${endpoints.carts}${cartId}/items/`);

// Customers API
const getCustomers = () => client.get(endpoints.customers);
const createCustomer = (customer) => client.post(endpoints.customers, customer);
const getCustomer = (id) => client.get(`${endpoints.customers}${id}/`);
const getCustomerMe = () => client.get(`${endpoints.customers}me/`);
const updateCustomer = (id, customer) => client.put(`${endpoints.customers}${id}/`, customer);

// Orders API
const getOrders = () => client.get(endpoints.orders);
const createOrder = (orderData) => client.post(endpoints.orders, orderData);
const getOrder = (id) => client.get(`${endpoints.orders}${id}/`);
const updateOrder = (id, orderData) => client.patch(`${endpoints.orders}${id}/`, orderData);

// Removed getUserCart to avoid direct /carts/ requests. Use /customers/{customer_id}/cart/ instead.

export default {
    // Products
    getProducts,
    getProduct,
    getUserProducts,
    updateProduct,
    deleteProduct,
    
    // Collections
    getCollections,
    getCollection,
    
    // Cart management
    // Removed getCarts, createCart, getCart, deleteCart, getUserCart
    
    // Cart items
    addToCart,
    updateCartItem,
    removeFromCart,
    getCartItems,
    
    // Customers
    getCustomers,
    createCustomer,
    getCustomer,
    getCustomerMe,
    updateCustomer,
    
    // Orders
    getOrders,
    createOrder,
    getOrder,
    updateOrder
};
