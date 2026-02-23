export function requireRole(role) {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: "Unauthorized" });
    if (req.auth.role !== role)
      return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
