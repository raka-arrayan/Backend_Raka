    const express = require("express")
    require("dotenv").config()

    const app = express()
    const PORT = process.env.PORT || 3000;

    const cors = require("cors");
    app.use(cors({
        origin: ['https://tp-rakaarrayan.vercel.app','https://backend-raka.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: "true",
    }));

    app.options('*', cors());

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

