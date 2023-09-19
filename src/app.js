import express from 'express';
import nodemon from 'nodemon'; 
import morgan from 'morgan';
import path from 'path';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import exp from 'constants';
import route from './routes/index.js';


// variables 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);                                // === Create __dirname variable for VES6 Modules
const app = express();                                                
const port = 3000;                                                    // === Port


app.use(express.urlencoded({extended : true}));  // data is html
app.use(express.json());  // data is js


app.use(morgan('combined'));                                           // === HTTP Log
app.engine('hbs', engine({extname: '.hbs'}));                          // === CREATE, CONFIG Template Engine
app.set('view engine', 'hbs');                                         // === Set default Template Engine: 'hbs'
app.set('views', path.join(__dirname, 'resource/views/'));                       // === Set path for views
// console.log('PATH: ', path.join(__dirname, 'resource/views/'));        // === print path of current views 

// === access static file (css, img,...) into public folder
app.use(express.static(path.join(__dirname, 'public')));

route(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})