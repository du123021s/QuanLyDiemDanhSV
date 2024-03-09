// === Convert Obj Array (MongoDB)  by  pure objs (JS) 
export const multipleMongooseToObject = (mongooses) => {
      return mongooses.map(mongoose => mongoose.toObject());
};

// === Convert an object (mongodb) into pure javascript obj
export const mongooseToObject = (mongoose) => {
            return mongoose ? mongoose.toObject() : mongoose;
};

