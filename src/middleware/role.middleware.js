export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role === "admin") return next();
  if (!allowedRoles.includes(req.user.role))
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  next();
};
