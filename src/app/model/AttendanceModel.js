import mongoose from "mongoose";


const attendanceSchema = new mongoose.Schema({
  userID: { type: String, require: true },
  batch: { type: String },
  course: { type: String },
  startdate: { type: String },
  curriculum: { type: String },
  teachername: { type: String },
  students: { type: mongoose.Schema.Types.Mixed }, // Chỉnh sửa kiểu dữ liệu của students thành mảng chuỗi
  permission: {
    type: [String], // Định nghĩa kiểu là một mảng các String
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});


export default mongoose.model("Attendance", attendanceSchema);