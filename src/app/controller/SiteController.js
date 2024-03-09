import usersModel from '../model/UsersModel.js';
import AttendanceModel from '../model/AttendanceModel.js';
import bcrypt from "bcrypt";

class SiteController {

      login(req, res) {
            res.render('login', { attendanceNavbar: false, headerLogin: true, footerLogin: true });
      }
      // ----------------------------------------------------------------------------------------------
      // == 2. 
      async checkLogin(req, res) {
            const { userID, password } = req.body;
            // req.session.userId = userID;


            try {
                  const user = await usersModel.findOne({ userID: userID });
                  if (!user) {
                        req.flash('error', 'Invalid user ID');
                        res.redirect('/login');
                        return;
                  }

                  // res.render('dashboard', {
                  //       attendanceNavbar: true,
                  //       headerLogin: false,
                  //       footerLogin: false,
                  //       permissions: req.session.permissions
                  // });
                  bcrypt.compare(password, user.password, async (error, isMatch) => {
                        if (error) {
                              console.error("Error during password processing: ", error);
                              res.status(500).json({ message: 'Error during password processing.' });
                        }
                        if (isMatch) {
                              req.session.userId = userID;
                              req.session.permissions = user.permissions;
                              req.session.role = user.role;


                              res.render('dashboard', {
                                    attendanceNavbar: true,
                                    headerLogin: false,
                                    footerLogin: false,
                                    permissions: req.session.permissions
                              });


                        } else {
                              req.flash('error', 'Incorrect password!');
                              res.redirect('/login');
                              return;
                        }
                  })

            } catch (error) {
                  console.error('Error here:', error);
                  res.status(500).send("Erorr Server! Please respond to errors via email: phongkythuath@cusc.ctu.edu.vn");
            }
      }

      logout(req, res) {
            console.log("Vào logout controller!");
            req.session.destroy(error => {
                  if (error) {
                        console.error("Error destroying session: ", error);
                        res.status(500).send("Internal Server Error");
                  } else {
                        console.log("Logout success.");
                        res.status(200).json({ message: "Logout successful" });
                  }
            });
      }

      requireAuth(req, res, next) {
            if (req.session && req.session.userId) {
                  return next();
            } else {
                  return res.status(401).send("<script>alert('Please login!'); window.location.href='/login';</script>");
                  // return res.redirect('/login');
            }
      }

      async getAllUsers(req, res) {
            const teachers = await usersModel.find({ role: "Teacher" })
                  .select('userID username')
                  .lean();

            console.log("DANH SACH Giao vien: " + JSON.stringify(teachers));

            res.json({
                  success: true,
                  message: 'Get the list of successful teachers',
                  teachers
            });

      }

      async assignFilePermission(req, res) {
            const userIds = req.body.selectedIds;
            const docId = req.body.docId;
            console.log(userIds);
            console.log("user sau map: ", userIds.map(userId => ({ userId })));

            await AttendanceModel.updateOne({ _id: docId }, { $set: { permission: userIds } })
                  .then(result => {
                        res.send({
                              success: true,
                              message: 'File permissions updated successfully.'
                        });
                  })
                  .catch(error => {
                        console.error("Error while updating: ", error);
                  });

      }
}

export default new SiteController;
