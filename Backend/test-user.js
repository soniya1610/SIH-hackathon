const User = require("./models/userModel");

async function test() {
    try {
        const users = await User.findAll();
        const count = await User.count();

        console.log("Users:", users);
        console.log("User count:", count);
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

test();