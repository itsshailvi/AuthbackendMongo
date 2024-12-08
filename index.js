const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
connectDB();

app.use(express.json());
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
