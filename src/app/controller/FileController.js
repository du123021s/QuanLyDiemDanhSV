import AttendanceModel from "../model/AttendanceModel.js";
import csvParser from 'csv-parser';
import fs from 'fs';
import xlsx from 'xlsx';
import ExcelJS from 'exceljs';
import { getNumbers } from '../../util/formatted.js';
import {
      findRowByValue, changeStandardJSDate, getValueByAddress, getAllValueOfRow,
      createJsonObjList, setCellStyle, addValuesToRow, incrementColumn
} from '../../util/excelfile.js';

import { mongooseToObject, multipleMongooseToObject } from '../../util/mongoose.js';


class FileController {
      async show(req, res) {
            console.log("=== PERMISSION ===\n ", req.session.permissions);
            const userId = req.session.userId;
            const role = req.session.role;

            if (role === 'Teacher') {
                  AttendanceModel.find({ permission: { $in: [userId] } })
                        .then(documents => {
                              documents = multipleMongooseToObject(documents);
                              res.render('file', {
                                    documentTable: documents, role,
                                    attendanceNavbar: true,
                                    headerLogin: false,
                                    footerLogin: false,
                                    permissions: req.session.permissions
                              });
                        })
                        .catch((error) => {
                              console.error("Error get data:", error);
                        });
            } else {
                  AttendanceModel.find()
                        .then(documents => {
                              documents = multipleMongooseToObject(documents);
                              res.render('file', {
                                    documentTable: documents,
                                    attendanceNavbar: true,
                                    headerLogin: false,
                                    footerLogin: false,
                                    permissions: req.session.permissions
                              });
                        })
                        .catch((error) => {
                              console.error("Error get data:", error);
                        });
            }

      }

      // async handleImportFileCSV(req, res) {
      //       try {
      //             const result = [];
      //             fs.createReadStream(req.file.path)  // đường dẫn đến file 
      //                   .pipe(csvParser())              // đọc qua pipe và dùng csvParser() để xử lý data
      //                   .on('data', (row) => {
      //                         // Xử lý từng dòng dữ liệu ở đây
      //                         const name = row.Name;     // Lấy giá trị từ cột "Name"
      //                         const price = row.Price;   // Lấy giá trị từ cột "Price"
      //                         const amount = row.Amount; // Lấy giá trị từ cột "Amount"

      //                         // tạo một đối tượng JavaScript từ dữ liệu này
      //                         const dataObject = {
      //                               name: name,
      //                               price: price,
      //                               amount: amount,
      //                         };

      //                         // đối tượng vào một mảng
      //                         result.push(dataObject);
      //                   })
      //                   .on('end', async () => {
      //                         if (result.length > 0) {
      //                               try {
      //                                     console.log(result);
      //                                     await bookModel.insertMany(result);
      //                                     res.send({ status: 200, success: true, msg: 'CSV Imported' });
      //                               } catch (error) {
      //                                     res.send({ status: 400, success: false, msg: error.message });
      //                               }
      //                         }
      //                   });

      //       } catch (error) {
      //             res.send({ status: 400, success: false, msg: error.message });
      //       }

      // };


      async handleImportFile(req, res) {
            try {
                  // console.log("===== VAO ROI NHA ^____^");
                  // // const tokenFromForm = req.body._csrf; // Lấy token từ biểu mẫu (thường nằm trong body)
                  // // const tokenFromServer = req.csrfToken(); // Lấy token được lưu trên server
                  // const clientCSRFToken = req.body.csrfToken; // Lấy token từ request
                  // const serverCSRFToken = res.locals.csrfToken; // Lấy token từ server

                  // if (clientCSRFToken != serverCSRFToken) {
                  //       // Token không hợp lệ, xử lý lỗi hoặc từ chối yêu cầu
                  //       return res.json({ message: "Invalid CSRF token" });
                  // }

                  const userId = req.session.userId;
                  const result = [];
                  const workbook = xlsx.readFile(req.file.path, { cellDates: true });
                  const sheet = workbook.Sheets[workbook.SheetNames[0]];


                  //============= INFORMATION BASIC ===================
                  //=== Get value according to keyword
                  const batchValue = getValueByAddress(sheet, findRowByValue(sheet, 'Batch'));
                  const courseValue = getValueByAddress(sheet, findRowByValue(sheet, 'Course'));
                  const curriculumValue = getValueByAddress(sheet, findRowByValue(sheet, 'Curriculum'));
                  const facultyNameValue = getValueByAddress(sheet, findRowByValue(sheet, 'Faculty Name'));
                  const startDateValue = changeStandardJSDate(getValueByAddress(sheet, findRowByValue(sheet, 'Start Date')));

                  //=== Find start, end address of table (ex: 'A8') ===
                  const startTableAddress = findRowByValue(sheet, 'Roll Number');
                  const endTableAddress = findRowByValue(sheet, 'Total Present');
                  //=== Address Separation
                  const startRowIndex = getNumbers(startTableAddress);
                  const endRowIndex = getNumbers(endTableAddress);

                  //============== STUDENT LIST ===========================================
                  //=== Get a list of column names 
                  const columnNames = getAllValueOfRow(sheet, startTableAddress);
                  //=== Get a list of attendance data by json format
                  const dataList = createJsonObjList(sheet, startTableAddress, endRowIndex - 1, columnNames);
                  //=== Set key for objects
                  const dataListMap = {};
                  dataList.forEach(student => {
                        const key = student['Roll Number'];
                        dataListMap[key] = student;
                  });

                  //=============================================
                  const totalPresentAddress = findRowByValue(sheet, 'Total Present');
                  const sessionCoveredAddress = findRowByValue(sheet, 'Session Covered');
                  const sessionCoveredRowIndex = getNumbers(sessionCoveredAddress);
                  const names = ['Total Present', 'Session Code', 'Date', 'Faculty Name (Initials)', 'Session Covered'];
                  const colName = totalPresentAddress.match(/[A-Za-z]+/)[0];           // tên cột 
                  const rowIndex = parseInt(totalPresentAddress.match(/\d+/)[0], 10);  // chỉ số hàng
                  const asciiCode = colName.charCodeAt(0) + 1;
                  const concateString = String.fromCharCode(asciiCode) + (rowIndex - 1);                       // nối lại giảm chỉ số hàng -1
                  const inforList = createJsonObjList(sheet, concateString, sessionCoveredRowIndex + 1, columnNames);

                  const infoListMap = {};
                  for (let i = 0; i < names.length; i++) {
                        const key = names[i];
                        infoListMap[key] = inforList[i];
                  }


                  let index = 0;
                  for (let key in infoListMap) {
                        if (infoListMap.hasOwnProperty(key)) {
                              infoListMap[key][Object.keys(infoListMap[key])[0]] = names[index];
                        }
                        index = index + 1;
                  }

                  for (let key in infoListMap) {
                        dataListMap[key] = infoListMap[key];
                  }

                  //=== Create document

                  const newAttendance = new AttendanceModel({
                        userID: userId,
                        batch: batchValue,
                        course: courseValue,
                        startdate: startDateValue,
                        curriculum: curriculumValue,
                        teachername: facultyNameValue,
                        students: dataListMap,
                  });

                  //=== Save document into database
                  newAttendance.save()
                        .then(() => {
                              console.log("The document has been added successfully.");
                        })
                        .catch(err => {
                              console.error("Error when adding documents : ", err);
                        });

                  const listDocument = await AttendanceModel.find({ userID: userId })
                        .select('_id batch course startdate curriculum')
                        .lean();

                  console.log("=== END =======");

                  res.json({ success: true, message: 'File imported successfully', listDocument });

            } catch (error) {
                  console.error('Error when processing excel file:', error);
                  res.json({
                        success: false, message: 'Error when processing file.\n' +
                              'Make sure the file is in the correct .xlsl format and has the correct structure.'
                  });
                  // res.status(500).send('Error when processing excel file.');
            }
      }

      async handleExportFile(req, res) {
            console.log("*** ĐÃ VÀO EXPORT CONTROLLER ***");
            const selectedDocuments = req.body.selectedDocuments;

            try {
                  // Tạo một workbook và worksheet bằng exceljs
                  const workbook = new ExcelJS.Workbook();
                  const sheet = workbook.addWorksheet('Attendance');
                  const data = await AttendanceModel.findOne({ _id: { $in: selectedDocuments } }).exec();

                  // === Get first sub Obj in Students
                  const firstStudent = Object.values(data.students)[0];
                  // === Get key into sub Obj
                  const tableColumnNames = Object.keys(firstStudent);
                  console.log("NAMES: ", tableColumnNames); // Print keys from first sub obj 

                  // Dòng đầu tiên: 
                  sheet.getCell('A1').value = 'APTECH';
                  sheet.mergeCells('A1:AC1');

                  sheet.getCell('A2').value = 'INTERNATIONAL DIVISION \nA Division of Aptech Training & Education (SBU)';
                  sheet.mergeCells('A2:AC2');

                  sheet.getCell('A3').value = 'STUDENT ATTENDANCE REGISTER';
                  sheet.mergeCells('A3:AC3');

                  sheet.getCell('A4').value = 'Centre Name : MEKONG DELTA - APTECH';
                  sheet.mergeCells('A4:AC6');

                  // Row 7, 8:
                  // Add row values
                  sheet.addRow(addValuesToRow(sheet, 7, ['Batch:', data.batch, 'Course/Model:', data.course]));
                  sheet.addRow(addValuesToRow(sheet, 8, ['Start Date:', data.startdate, 'Curriculum:', data.curriculum, 'Link:']));

                  sheet.addRow(tableColumnNames);
                  const studentKeys = Object.keys(data.students);
                  for (let key of studentKeys) {
                        const studentData = data.students[key];
                        const rowData = tableColumnNames.map(columnName => studentData[columnName]);
                        sheet.addRow(rowData);
                  }

                  // ===== STYLE =======

                  // Định kiểu chữ Times New Roman và cỡ chữ 12 cho toàn bộ sheet
                  sheet.eachRow((row) => {
                        row.eachCell((cell) => {
                              cell.font = { name: 'Times New Roman', size: 12 };
                        });
                  });

                  sheet.properties.defaultRowHeight = 18; // Chiều cao của hàng mặc định
                  sheet.properties.defaultColWidth = 8; // Độ rộng của cột mặc định

                  // Định dạng cho các ô cụ thể sau khi thêm giá trị
                  const fontOptions_18 = { name: 'Times New Roman', size: 18, bold: true };
                  const fontOptions_14 = { name: 'Times New Roman', size: 14, bold: true };
                  const alignmentOptions_lf = { vertical: 'middle', horizontal: 'left' };
                  const alignmentOptions_cen = { vertical: 'middle', horizontal: 'center' };

                  setCellStyle(sheet.getCell('A1'), fontOptions_18, alignmentOptions_lf);
                  setCellStyle(sheet.getCell('A2'), fontOptions_18, alignmentOptions_cen);
                  setCellStyle(sheet.getCell('A3'), fontOptions_14, alignmentOptions_cen);
                  setCellStyle(sheet.getCell('A4'), fontOptions_14, alignmentOptions_lf);

                  let colName = 'A';
                  for (let i = 0; i < tableColumnNames.length; i++) {
                        setCellStyle(sheet.getCell(colName + '10'), { size: 13, bold: true }, { vertical: 'middle', horizontal: 'center' });
                        colName = incrementColumn(colName);
                  }



                  // Tạo một tệp Excel và chuyển đổi thành Blob
                  const excelData = await workbook.xlsx.writeBuffer();

                  // Trả về Blob cho trình duyệt
                  res.setHeader('Content-Disposition', 'attachment; filename=exported_documents.xlsx');
                  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                  res.send(excelData);
            } catch (error) {
                  console.error(error);
                  res.status(500).send('Internal Server Error');
            }

      }

      handleDeletedFile(req, res) {
            console.log("ĐÃ VÀO DELTEFILE CONTROLLER ^_^ !");
            // === Get ID documents
            const { documentIDs } = req.body;
            const userId = req.session.userId;

            // === Delete follow ID doc of ID user
            AttendanceModel.deleteMany({ userID: userId, _id: { $in: documentIDs } })
                  .then(documents => {
                        console.log("DELTE THANH CÔNG!");
                        res.json({ success: true, message: 'Xóa tài liệu thành công', documentIDs });

                  })
                  .catch((error) => {
                        res.status(500).json({ success: false, message: 'Lỗi khi xóa tài liệu' });
                  });
      }

}

export default new FileController;
