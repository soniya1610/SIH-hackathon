const express = require("express");
const dotenv = require("dotenv");
const pool = require("./config/db");

const AuthRouter = require("./routes/auth");
const AddressRouter = require("./routes/address");
const UserRouter = require("./routes/user");
const MediaRouter = require("./routes/media");
const AssessmentRouter = require("./routes/assessment");

dotenv.config();

const app = express();

app.use(express.json());

// Test MySQL connection
pool.getConnection()
    .then(connection => {
        console.log("Connected to MySQL successfully");
        connection.release();
    })
    .catch(error => {
        console.error("MySQL connection failed:", error.message);
    });

// Routes
app.use("/auth", AuthRouter);
app.use("/address", AddressRouter);
app.use("/user", UserRouter);
app.use("/media", MediaRouter);
app.use("/assessment", AssessmentRouter);

// Start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${8080}`);
});