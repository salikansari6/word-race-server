const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors')

app.use(express.json());
// import routes
const authRoute = require('./routes/auth');
const statsRoute = require('./routes/stats')

dotenv.config();

// connect to db
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));
  

// middleware
// app.use(bodyParser.json())
app.use(cors())
// route middlewares
app.use('/api/user', authRoute);
app.use('/api/stats',statsRoute)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`The server has started in port ${PORT}`));