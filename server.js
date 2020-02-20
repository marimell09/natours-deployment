const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Handleling uncaught rejections globally - bugs that occured in our synchronous code,
//but are not handled anywhere
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//global variable that indicates in which environment the node app is running
//console.log(app.get('env'));
//All node environment variables
//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Connect the database
mongoose
  //Local database versions
  //.connect(process.env.DATABASE_LOCAL, {
  //Hosted database version
  .connect(DB, {
    //Options to deal with deprecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

//START SERVER

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//console.log(x);
