import formRouter from './form.js';

const route = (app) => {
      // === define route
      app.use('/form', formRouter);
      app.get('/', (req, res) => {
            // console.log("Query : " + req.query);
            res.render('home');
      });
      
      app.get('/news', (req, res)=> res.send("News: New Information!!!"));
      
      // app.get('/form', (req, res) => {
      //   res.render('form');
      // });
      
      // app.post('/form', (req, res) => {
      //       console.log(req.body);
      //       res.send("Hi");
      // });

}

export default route;