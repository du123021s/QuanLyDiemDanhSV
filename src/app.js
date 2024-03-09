//======= Lib ===================
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors'; // milddle ware
import session from 'express-session';
import flash from 'express-flash'
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import hbs from 'hbs';
import connectMongoDBSession from 'connect-mongodb-session';

import route from './routes/index.js';
import connectDB from './config/db/index.js';
import formatDateHelper from './util/formatDateHelper.js';
// import cookieParser from 'cookie-parser';
// import { csrfProtection, addCSRFToken } from './util/csrfMiddleware.js';
// ===========================================================================================

dotenv.config();
const MongoDBStore = connectMongoDBSession(session);

// === variables 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);                                // === Create __dirname variable for VES6 Modules
const app = express();
const port = 3000;


//=== Config MongoDBStore to store session
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'user_sessions_table',
  expires: 1000 * 60 * 60 * 2,   // thời gian sống của session: 24h
  autoRemove: 'native',           // thêm option này đảm bảo session sẽ được xóa khi đến hạn
});


// Handle error when it don't connect to MongoDB
store.on('error', (error) => {
  console.error('MongoDB session Store Error: ', error);
});


// const webpack_bundle = {
//     entry: './public/js/checkImportFile.js',
//     output: {
//           filename: 'bundle.js',
//           path: path.resolve(__dirname, 'public', 'js'),
//     },
// };



// === Middleware Session
app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    store: store,              // use configured MongoDBStore
    cookie: { secure: false }, // Set secure by true if you use https protocol
  }));

// === Middleware Flash-Express
app.use(flash());

// === Middleware CORS   (security)
const corsOption = {
  origin: 'http://localhost:3000',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,  // cho phép gửi cookie và thông tin xác thực

}
app.use(cors(corsOption));

// === Connect DB
connectDB();

app.use(morgan('combined'));                                           // === HTTP Log
app.engine('hbs', engine({ extname: '.hbs' }));                          // === CREATE, CONFIG Template Engine
app.set('view engine', 'hbs');                                         // === Set default Template Engine: 'hbs'
app.set('views', path.join(__dirname, 'resource', 'views'));                       // === Set path for views
// console.log('PATH: ', path.join(__dirname, 'resource/views/'));        // === print path of current views 

// --------------------------- CSRF -------------------------------------
// Sử dụng middleware CSRF và middleware để truyền token CSRF
// Sử dụng cookie-parser
// app.use(cookieParser());

// // Middleware để truyền token CSRF cho các trang
// app.use(csrfProtection);
// app.use(addCSRFToken);
//---------------------------------------------

// Register helper
hbs.registerHelper('formatDate', formatDateHelper.formatDate);

// === access static file (css, img,...) into public folder
app.use(express.static(path.join(__dirname, 'public')));

route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})