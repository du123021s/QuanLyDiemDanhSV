import { render } from "node-sass";

class DashboardController {

      show(req, res) {
            res.render('dashboard', {
                  attendanceNavbar: true,
                  headerLogin: false,
                  footerLogin: false,
                  permissions: req.session.permissions
            });
      }
}

export default new DashboardController;