export const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied. Administrator privileges required.'));
  }
};
