const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db')
const authRoutes = require('./routes/authRoute')
const productRoutes = require('./routes/productRoutes')
const app = express();

dotenv.config();

connectDB()

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/product', productRoutes);


app.get("/", (req, res) => {
    res.send("<h1>Welcome to Made 2 automate</h1>");
});



const PORT = process.env.PORT || 8050

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

// divyangdheer
// rMQenjcL6xqN5UuU