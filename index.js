const express = require("express")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000;

const cors = require("cors");
app.use(cors({
    origin: 'https://os.netlabdte.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());
app.use('/store', require('./src/routes/store.route'));

// const storeRoutes = require("./src/routes/store.route");
// app.use("/", storeRoutes);

app.use('/user', require('./src/routes/user.route'));

const itemRoutes = require("./src/routes/item.route");
app.use("/item", itemRoutes);

const transactionRoutes = require("./src/routes/transaction.route");
app.use("/transaction", transactionRoutes);

app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

