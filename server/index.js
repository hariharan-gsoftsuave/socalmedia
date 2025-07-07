const express = require('express');
const { connect } = require('mongoose');
require('dotenv').config();
const cors = require('cors'); 
const fileUpload = require('express-fileupload'); 
const { notFount, errorHandler } = require('./middleware/errorMiddleware');
const routes= require('./routes/routes');
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors({
  credentials: true, 
  origin: ["http://localhost:5173"]
}));
app.use(fileUpload()); 
app.use('/api',routes);
app.use(notFount);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connect(process.env.MONGO_URL).then(
  // Server listen
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
).catch((error)=>{console.log('Error : ',error)})


