import csrf from "csurf";
// Tạo một middleware CSRF
const csrfProtection = csrf({ cookie: true });

//Tạo ra một CSRF (Cross-Site Request Forgery) 
function addCSRFToken(req, res, next) {
      res.locals.csrfToken = req.csrfToken;
      console.log("req.csrfToken nhahhhh^_^", req.csrfToken);
      next();
}

export { csrfProtection, addCSRFToken };
