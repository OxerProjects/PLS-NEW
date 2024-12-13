function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash('error_msg', 'התחבר כדי לצפות בתוכן');
    res.redirect('/login');
  }
  
  function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    req.flash('error_msg', 'גישה נדחתה: נדרשת גישת מנהל');
    res.redirect('/dashboard');
  }
  
  module.exports = { ensureAuthenticated, ensureAdmin };
  