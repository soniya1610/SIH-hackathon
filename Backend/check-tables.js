const pool = require("./config/db");

async function checkTables() {
    try {
        const [tables] = await pool.query("SHOW TABLES");

        console.log("TABLES:");
        console.table(tables);

        const tableNames = tables.map(row => Object.values(row)[0]);

        for (const table of tableNames) {
            console.log(`\n========== ${table} ==========`);

            const [columns] = await pool.query(
                `DESCRIBE \`${table}\``
            );

            console.table(columns);
        }

        process.exit(0);

    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
}

checkTables();