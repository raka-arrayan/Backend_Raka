require("dotenv").config()
const   { Pool } = require("pg")    
const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl:{
        rejectUnauthorized:false,
    },
})

const connect = async () => {
    try {
        await pool.connect()
        console.log("Connected to the database")
    } catch (error) {
        console.log(error)
    }
}

connect();

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params)
        return res
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    query
}

