const pool = require("./config/db");

async function testDatabase() {
    try {
        const [rows] = await pool.query("SELECT 1 AS result");

        console.log("✅ MySQL Connected Successfully");
        console.log(rows);
    } catch (error) {
        console.error("❌ MySQL Connection Failed");
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();