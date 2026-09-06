const storage = require('../services/storage');

exports.getAllBranches = (req, res) => {
  const branches = storage.getBranches();
  return res.json({ success: true, branches });
};

exports.getBranchById = (req, res) => {
  const branch = storage.getBranchById(req.params.id);
  if (!branch) {
    return res.status(404).json({ success: false, message: 'Branch not found' });
  }
  return res.json({ success: true, branch });
};

exports.updateBranch = (req, res) => {
  const updated = storage.updateBranch(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Branch not found' });
  }
  return res.json({ success: true, branch: updated, message: 'Branch updated successfully' });
};
