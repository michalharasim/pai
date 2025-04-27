const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    res.status(403).send('Dostęp tylko dla administratorów');
  };

  function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    } else {
      res.redirect('/login');
    }
  }
  
  
  module.exports = { isAdmin, isLoggedIn };