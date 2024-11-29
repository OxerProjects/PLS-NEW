function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
  }
  
  function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    req.flash('error_msg', 'Access denied: Admins only');
    res.redirect('/dashboard');
  }
  
  module.exports = { ensureAuthenticated, ensureAdmin };
  