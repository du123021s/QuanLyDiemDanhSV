import usersModel from "../app/model/UsersModel.js";

//---------- 1. Xác thực quyền truy cập cho Giảng viên ------------------------------------------------------
export function teacherAccess(req, res, next) {
      const role = req.session.role;
      const permissions = req.session.permissions;

      if (role === "Teacher"
            || permissions.accessFile
            || permissions.manageAttendance
            || permissions.absentStudentStatistics) {

            next(); // --- Tiếp tục xử lý request 
      } else {
            // --- Trả về lỗi or thông báo nếu quyền truy cập bị từ chối
            res.status(403).json({ error: "Access denied. Only teacher have the right to perform this function." });
      }
}


//---------- 2. Xác thực quyền truy cập cho Admin ---------------------------------------------------
export function adminAccess(req, res, next) {
      const role = req.session.role;
      const permissions = req.session.permissions;

      if (role === 'Admin'
            || permissions.manageDatabase
            || permissions.manageUsers) {

            next(); //--- Tiếp tục xử lý request 
      } else {
            // --- Trả về lỗi or thông báo nếu quyền truy cập bị từ chối
            res.status(403).json({ error: "Access denied. Only admins have the right to perform this function." })
      }
}


//-------- 3. Xác thực quyền truy cập cho Training Department ------------------------------------------------

export function trainingDepartmentAccess(req, res, next) {
      const role = req.session.role;
      const permissions = req.session.permissions;

      if (role === 'Training Department'
            || permissions.accessFile
            || permissions.manageImportFile
            || permissions.manageFilePermissions
            || permissions.absentStudentStatistics) {

            next(); // --- Tiếp tục xử lý request
      } else {
            // --- Trả về lỗi or thông báo nếu quyền truy cập bị từ chối
            res.status(403).json({ error: "Access denied. Only Training Department have the right to perform this function." })
      }
}

