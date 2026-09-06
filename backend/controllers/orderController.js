const storage = require('../services/storage');

exports.logOrder = (req, res) => {
  try {
    const { branchId, customerName, customerPhone, orderType, deliveryAddress, items, totalAmount, notes } = req.body;
    
    const branch = storage.getBranchById(branchId);
    const branchName = branch ? branch.name : branchId;

    const order = storage.addOrder({
      branchId,
      branchName,
      customerName,
      customerPhone,
      orderType,
      deliveryAddress,
      items,
      totalAmount,
      notes
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order log error:', err);
    return res.status(500).json({ success: false, message: 'Could not log order' });
  }
};

exports.getOrders = (req, res) => {
  const { branchId, date } = req.query;
  const orders = storage.getOrders(branchId, date);
  return res.json({ success: true, count: orders.length, orders });
};
