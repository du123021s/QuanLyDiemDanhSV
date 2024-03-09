import mongoose from "mongoose";
import bcrypt from "bcrypt";
// import mongooseBcrypt from 'mongoose-bcrypt';

// const userSchema = new mongoose.Schema({
//       userID : {type: String, require:true},
//       password: {type:String, required: true},
//       // createdAt: {type: Date, default: Date.now},
//       // updatedAt: {type: Date, default: Date.now},
//       // deletedAt: {type: Date, default: null},
// });
// Attach to predefined password and secret field
// userSchema.plugin(mongooseBcrypt);


const userSchema = new mongoose.Schema({
      userID: {
            type: String,
            require: true,
            unique: true,
      },

      username: {
            type: String,
            require: true,
      },
      password: {
            type: String,
            require: true,
      },
      email: {
            type: String,
            require: true,
      },
      role: {
            type: String,
            require: true,
      },
      active: {
            type: Boolean,
            require: true,
            default: false,
      },
      permissions: {
            manageDatabase: {
                  type: Boolean,
                  default: false,
            },
            manageUsers: {
                  type: Boolean,
                  default: false,
            },
            manageAttendance: {
                  type: Boolean,
                  default: false,
            },
            manageImportFile: {
                  type: Boolean,
                  default: false,
            },
            manageFilePermissions: {
                  type: Boolean,
                  default: false,
            },
            accessFile: {
                  type: Boolean,
                  default: true,
            },
            absentStudentStatistics: {
                  type: Boolean,
                  default: false,
            }
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
      deletedAt: { type: Date, default: null },
})


//-----------------------------------------------------------------------------------

const user = new mongoose.model("Users", userSchema);

export default user;