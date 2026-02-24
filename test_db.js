
const db = require('./database');
const bcrypt = require('bcryptjs');

try {
    console.log("Testing user retrieval...");
    const user = db.getUserByEmail('demo@berhu.com');
    console.log("User retrieved:", user);

    if (user) {
        console.log("Testing password comparison...");
        const isValid = bcrypt.compareSync('demo123', user.password);
        console.log("Password valid:", isValid);
    } else {
        console.error("Demo user not found!");
    }
} catch (error) {
    console.error("Error during test:", error);
} finally {
    db.closeDatabase();
}
