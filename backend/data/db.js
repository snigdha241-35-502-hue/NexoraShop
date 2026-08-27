/**
 * NexoraShop persistent local database.
 * Products are saved to backend/data/store.json so new products survive
 * backend restarts. No external database is required.
 */
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");

const storePath = path.join(__dirname, "store.json");
const now = () => new Date().toISOString();

const seedProducts = [
  { name:"AeroFit Wireless Earbuds", description:"Noise-cancelling wireless earbuds with 30h battery life.", price:79.99, category:"Electronics", stock:42, image:"https://picsum.photos/seed/earbuds/500/500", rating:4.6 },
  { name:"Nimbus Running Shoes", description:"Lightweight breathable running shoes for daily training.", price:129.0, category:"Footwear", stock:15, image:"https://picsum.photos/seed/shoes/500/500", rating:4.4 },
  { name:"Lumen Desk Lamp", description:"Adjustable LED desk lamp with 5 brightness levels.", price:34.5, category:"Home", stock:60, image:"https://picsum.photos/seed/lamp/500/500", rating:4.8 },
  { name:"Voyage Leather Backpack", description:"Water-resistant leather backpack with laptop sleeve.", price:89.99, category:"Accessories", stock:8, image:"https://picsum.photos/seed/backpack/500/500", rating:4.5 },
  { name:"Pulse Smartwatch", description:"Fitness smartwatch with heart-rate & sleep tracking.", price:149.99, category:"Electronics", stock:5, image:"https://picsum.photos/seed/watch/500/500", rating:4.3 },
  { name:"Terra Ceramic Mug Set", description:"Set of 4 handcrafted ceramic mugs, 350ml each.", price:24.99, category:"Home", stock:100, image:"https://picsum.photos/seed/mug/500/500", rating:4.7 }
].map(p => ({ id: uuid(), ...p }));

let store;
try {
  store = JSON.parse(fs.readFileSync(storePath, "utf8"));
} catch {
  store = {
    products: seedProducts,
    orders: [],
    tickets: []
  };
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

const users = [
  { id: uuid(), name:"Nexora Admin", email:"admin@nexorashop.com", password:bcrypt.hashSync("admin123",10), role:"admin", createdAt:now() },
  { id: uuid(), name:"Jamie Rivera", email:"jamie@example.com", password:bcrypt.hashSync("customer123",10), role:"customer", createdAt:now() }
];

const products = store.products || [];
const orders = store.orders || [];
const tickets = store.tickets || [];

function saveStore() {
  fs.writeFileSync(storePath, JSON.stringify({ products, orders, tickets }, null, 2));
}

function saveProducts() {
  saveStore();
}

module.exports = { users, products, orders, tickets, uuid, now, saveProducts };
