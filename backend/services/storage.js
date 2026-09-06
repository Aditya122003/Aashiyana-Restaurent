const fs = require('fs');
const path = require('path');
const seedData = require('../data/seedData');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

class Storage {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = { ...seedData };
        this.save();
      }
    } catch (err) {
      console.error('Failed to load DB file, initializing with seed data:', err);
      this.data = { ...seedData };
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error writing to DB file:', err);
    }
  }

  getBranches() {
    return this.data.branches || [];
  }

  getBranchById(id) {
    return (this.data.branches || []).find(b => b.id === id || b.slug === id);
  }

  updateBranch(id, branchUpdates) {
    const branches = this.data.branches || [];
    const index = branches.findIndex(b => b.id === id);
    if (index === -1) return null;
    branches[index] = { ...branches[index], ...branchUpdates };
    this.data.branches = branches;
    this.save();
    return branches[index];
  }

  getCategories() {
    return this.data.categories || [];
  }

  getMenuItems(branchId = null) {
    const items = this.data.menuItems || [];
    if (!branchId) {
      return items;
    }
    // Augment with branch price if defined
    return items.map(item => {
      const branchOverride = item.branchPricing && item.branchPricing[branchId];
      if (branchOverride) {
        return {
          ...item,
          currentPrice: branchOverride.price !== undefined ? branchOverride.price : item.defaultPrice,
          isAvailable: branchOverride.available !== undefined ? branchOverride.available : true,
          image: branchOverride.image || item.image,
          hasBranchPrice: true
        };
      }
      return {
        ...item,
        currentPrice: item.defaultPrice,
        isAvailable: true,
        hasBranchPrice: false
      };
    });
  }

  getMenuItemById(id) {
    return (this.data.menuItems || []).find(i => i.id === id);
  }

  addMenuItem(itemData) {
    const items = this.data.menuItems || [];
    const newItem = {
      id: itemData.id || `dish-${Date.now()}`,
      name: itemData.name,
      category: itemData.category || 'restaurant',
      description: itemData.description || '',
      defaultPrice: Number(itemData.defaultPrice) || 0,
      unit: itemData.unit || 'Portion',
      isVeg: itemData.isVeg !== undefined ? Boolean(itemData.isVeg) : true,
      isPopular: Boolean(itemData.isPopular),
      rating: Number(itemData.rating) || 4.8,
      reviewsCount: Number(itemData.reviewsCount) || 10,
      image: itemData.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      branchPricing: itemData.branchPricing || {}
    };
    items.unshift(newItem);
    this.data.menuItems = items;
    this.save();
    return newItem;
  }

  updateMenuItem(id, updates) {
    const items = this.data.menuItems || [];
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    this.data.menuItems = items;
    this.save();
    return items[index];
  }

  updateBranchPrice(itemId, branchId, price, available, image) {
    const item = this.getMenuItemById(itemId);
    if (!item) return null;
    if (!item.branchPricing) item.branchPricing = {};
    item.branchPricing[branchId] = {
      price: Number(price),
      available: available !== undefined ? Boolean(available) : true,
      image: image || item.branchPricing[branchId]?.image || item.image
    };
    if (image && !item.image) {
      item.image = image;
    }
    this.save();
    return item;
  }

  deleteMenuItem(id) {
    const items = this.data.menuItems || [];
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    this.data.menuItems = filtered;
    this.save();
    return true;
  }

  getReservations(branchId = null, date = null) {
    let res = this.data.reservations || [];
    if (branchId && branchId !== 'all') {
      res = res.filter(r => r.branchId === branchId);
    }
    if (date) {
      res = res.filter(r => r.date === date);
    }
    return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getTodayReservations(branchId = null) {
    const today = new Date();
    const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    let res = this.getReservations(branchId, ymd);
    return res;
  }

  addReservation(resData) {
    const reservations = this.data.reservations || [];
    const newRes = {
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      branchId: resData.branchId,
      branchName: resData.branchName,
      customerName: resData.customerName,
      customerPhone: resData.customerPhone,
      customerEmail: resData.customerEmail || '',
      date: resData.date,
      timeSlot: resData.timeSlot,
      guests: Number(resData.guests) || 2,
      seatingPreference: resData.seatingPreference || 'Standard Seating',
      specialRequests: resData.specialRequests || '',
      status: 'Confirmed', // Confirmed, Completed, Cancelled
      createdAt: new Date().toISOString()
    };
    reservations.unshift(newRes);
    this.data.reservations = reservations;
    this.save();
    return newRes;
  }

  updateReservationStatus(id, status) {
    const reservations = this.data.reservations || [];
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) return null;
    reservations[index].status = status;
    this.data.reservations = reservations;
    this.save();
    return reservations[index];
  }

  getOrders(branchId = null, date = null) {
    let orders = this.data.orders || [];
    if (branchId && branchId !== 'all') {
      orders = orders.filter(o => o.branchId === branchId);
    }
    if (date) {
      orders = orders.filter(o => o.createdAt && o.createdAt.startsWith(date));
    }
    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  addOrder(orderData) {
    const orders = this.data.orders || [];
    const newOrder = {
      id: `ash-${Date.now().toString().slice(-6)}`,
      branchId: orderData.branchId,
      branchName: orderData.branchName,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      orderType: orderData.orderType || 'Takeaway',
      deliveryAddress: orderData.deliveryAddress || '',
      items: orderData.items || [],
      totalAmount: Number(orderData.totalAmount) || 0,
      notes: orderData.notes || '',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    this.data.orders = orders;
    this.save();
    return newOrder;
  }

  getAdminByUsername(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return (this.data.admins || []).find(a => 
      (a.username && a.username.toLowerCase() === clean) ||
      (a.email && a.email.toLowerCase() === clean)
    );
  }
}

module.exports = new Storage();
