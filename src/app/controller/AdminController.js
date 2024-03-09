import usersModel from "../model/UsersModel.js";
import bcrypt from "bcrypt";

class AdminController {
      async showUsers(req, res) {
            const userDataList = await usersModel.find({ active: true })
                  .select('userID username email role active')
                  .lean();

            res.render('manageUser', {
                  attendanceNavbar: true,
                  headerLogin: false,
                  footerLogin: false,
                  users: userDataList,
                  permissions: req.session.permissions
            });
      }

      // -----------------------------------------------------------------------------------------------
      async createUsers(req, res) {
            console.log("===== ĐÃ VÀO CONTROLLER - ADMIN =======");
            const userData = req.body.formData;
            console.log("Dữ liệu nhận được từ form 2:", req.body.formData);
            const userID = userData.userID;
            const username = userData.username;
            const password = userData.password;
            const email = userData.email;
            const role = userData.roleValue;
            const permissions = userData.permissionValue;

            console.log("perr: ", permissions);

            const checkID = await usersModel.find({ userID: userID });
            if (checkID.length > 0) {
                  console.log("This user already exists!");
                  return res.json({
                        success: false,
                        message: 'This user already exists.',
                  });
            }
            console.log("user id chưa có.");
            // Kiểm tra quyền người dùng
            let accessFile = false;
            let manageDatabase = false;
            let manageUsers = false;
            let manageAttendance = false;
            let manageFilePermissions = false;
            let manageImportFile = false;
            let absentStudentStatistics = false;

            permissions.forEach(item => {
                  if (role != 'Admin') { accessFile = true; }
                  if (item === 'manageDatabase') { manageDatabase = true; }
                  if (item === 'manageUsers') { manageUsers = true; }
                  if (item === 'manageImportFile') { manageImportFile = true };
                  if (item === 'manageAttendance') { manageAttendance = true; }
                  if (item === 'manageFilePermissions') { manageFilePermissions = true; }
                  if (item === 'absentStudentStatistics') { absentStudentStatistics = true; }
            });

            // Encrypt password when it save into database
            try {
                  const salt = await bcrypt.genSalt(10);
                  const hash = await bcrypt.hash(password, salt);

                  const newUser = new usersModel({
                        userID: userID,
                        username: username,
                        password: hash,
                        email: email,
                        role: role,
                        active: true,
                        permissions: {
                              accessFile: accessFile,
                              manageDatabase: manageDatabase,
                              manageUsers: manageUsers,
                              manageAttendance: manageAttendance,
                              manageImportFile: manageImportFile,
                              manageFilePermissions: manageFilePermissions,
                              absentStudentStatistics: absentStudentStatistics,
                        },
                  });


                  console.log("chuan bị tạo user.");
                  const result = await newUser.save()
                        .then(() => {
                              res.json({
                                    success: true,
                                    message: 'The user was created successfully.',
                                    newUser,
                              });
                        })
                        .catch((error) => {
                              console.log("This user already exists!");
                              console.log("Detail: ", error);
                        })




            } catch (error) {
                  console.error("Error when adding a new user: ", error);
                  res.status(500).send('Error when adding a new user.');
            }
      }


      deleteUsers(req, res) {
            const docId = req.body.userId;
            console.log("Document ID:", docId);
            // === Delete follow ID doc of ID user
            usersModel.updateOne({ _id: docId }, { $set: { active: false } })
                  .then(() => {
                        console.log("DELTE THANH CÔNG!");
                        res.send({ success: true, message: 'User deletion successful', docId });
                  })
                  .catch((error) => {
                        console.error("Error deleting this user : ", error);
                        res.status(500).json({ success: false, message: 'Error deleting this user.' });
                  });
      }

      async getInforUser(req, res) {
            const userId = req.body.userId;
            console.log("uSERID : ", userId);

            await usersModel.findOne({ _id: userId })
                  .select('userID username email role active permissions')
                  .lean()
                  .then(data => {
                        res.json({ success: true, message: 'Retrieve user information successfully', data })
                  })
                  .catch((error) => {
                        console.error("Error while retrieving this user : ", error);
                        res.status(500).json({ success: false, message: 'Error while retrieving this user. ' });
                  });

      }

      async updateUser(req, res) {
            const userData = req.body.updateUser;
            console.log("userData update nhaaa2 ^_^: ", req.body.updateUser);
            const updateFields = {
                  $set: {
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        permissions: userData.permission,
                        // Thêm các trường khác cần cập nhật
                  }
            };
            console.log("cap nhat");
            await usersModel.updateOne({ _id: userData.id }, updateFields)
                  .then(() => {
                        console.log("cap nhat thanh cong");
                        res.json({ success: true, message: 'Updated user successfully.', userData })
                  })
                  .catch((error) => {
                        console.error("Error updating user : ", error);
                        res.status(500).json({ success: false, message: 'Error updating user. ' });
                  });
      }

}



export default new AdminController;