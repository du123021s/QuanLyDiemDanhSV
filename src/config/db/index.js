import mongoose from 'mongoose';


async function connect() {
      try {

            await mongoose.connect(process.env.MONGODB_URI, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true
            });
            console.log("Connect successfully!");
      } catch (error) {
            console.log("Connect failure!");
      }
}

export default connect;