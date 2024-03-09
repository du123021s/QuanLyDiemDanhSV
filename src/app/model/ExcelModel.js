
import mongoose from "mongoose";

const excelSchema = new mongoose.Schema({
      name : {
            type : String
      },
      price : {
            type : Number
      },
      amount : {
            type : Number
      }
});

export default mongoose.model("Books", excelSchema);