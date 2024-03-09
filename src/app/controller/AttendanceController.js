import { mongooseToObject } from "../../util/mongoose.js";
import AttendanceModel from "../model/AttendanceModel.js";

class Attendance {

      async show(req, res) {
            const userId = req.session.userId;
            const documentId = req.params.documentId;
            console.log("\n\n CONTROLLER CỦA DỮ LIỆU HANDSON DANG CHẠY =====\n\n");
            await AttendanceModel.findOne({ _id: documentId }).lean()
                  .then(document => {
                        document = JSON.stringify(document);
                        console.log("du lieu: ", document);
                        res.render('attendance', {
                              documentData: document,
                              attendanceNavbar: true,
                              headerLogin: false,
                              footerLogin: false,
                              // Kiểm tra quyền trước khi hiển thị func trong thanh nav
                              permissions: req.session.permissions
                        });
                  })
                  .catch((error) => {
                        console.log("Error : ", error);
                        res.status(500).send('Internal Server Error');
                  });
      }

      async update(req, res) {
            console.log("==== DA VAO CONTROLLER ========");
            const documentId = req.params.documentId;
            const { updateData } = req.body;

            const colNames = updateData[0];             // lấy hàng tiên
            const dataWithoutHeaders = updateData.slice(1);  // trích xuất dữ liệu từ vị trí 1

            // Bien đổi mảng json thành đối tượng json lấy mssv làm khóa
            const jsonData = {};
            dataWithoutHeaders.forEach(row => {
                  const student = {};
                  for (let i = 0; i < colNames.length; i++) {
                        student[colNames[i]] = row[i];
                  }
                  jsonData[row[0]] = student;
            });

            // console.log("=== NEW DATA: =====\n", jsonData);

            await AttendanceModel.updateOne({ _id: documentId }, { $set: { students: jsonData } })
                  .then(result => {
                        res.json({
                              success: true,
                              message: 'Updated the document successfully.',
                              jsonData
                        });
                  })
                  .catch(error => {
                        console.error("Error when updating document: ", error);
                  })
      }
}
export default new Attendance;         
