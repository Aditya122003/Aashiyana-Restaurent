const storage = require('../services/storage');

exports.getCategories = (req, res) => {
  const categories = storage.getCategories();
  return res.json({ success: true, categories });
};

exports.getMenu = (req, res) => {
  const { branchId, category, vegOnly, search } = req.query;
  let items = storage.getMenuItems(branchId);

  if (category && category !== 'all') {
    if (category === 'popular') {
      items = items.filter(i => i.isPopular);
    } else if (category === 'dishes') {
      items = items.filter(i => i.category === 'dishes' || i.category === 'restaurant');
    } else if (category === 'dessert') {
      items = items.filter(i => i.category === 'dessert' || i.category === 'sweets');
    } else if (category === 'chinese') {
      items = items.filter(i => i.category === 'chinese' || i.category === 'chinese_snacks');
    } else {
      items = items.filter(i => i.category === category);
    }
  }

  if (vegOnly === 'true' || vegOnly === true) {
    items = items.filter(i => i.isVeg);
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.description && i.description.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: items.length, items });
};

exports.getMenuItem = (req, res) => {
  const item = storage.getMenuItemById(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  return res.json({ success: true, item });
};

exports.createMenuItem = (req, res) => {
  const { name, category, defaultPrice } = req.body;
  if (!name || defaultPrice === undefined) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }

  const created = storage.addMenuItem(req.body);
  return res.status(201).json({ success: true, item: created, message: 'Item added successfully' });
};

exports.updateMenuItem = (req, res) => {
  const updated = storage.updateMenuItem(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  return res.json({ success: true, item: updated, message: 'Item updated successfully' });
};

exports.updateBranchPrice = (req, res) => {
  const { branchId, price, available, image } = req.body;
  if (!branchId || price === undefined) {
    return res.status(400).json({ success: false, message: 'BranchId and price required' });
  }

  const updated = storage.updateBranchPrice(req.params.id, branchId, price, available, image);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  return res.json({ success: true, item: updated, message: `Details for branch ${branchId} updated` });
};

exports.deleteMenuItem = (req, res) => {
  const success = storage.deleteMenuItem(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  return res.json({ success: true, message: 'Item deleted successfully' });
};
