
const db = require('./database');

try {
    console.log("Testing user retrieval with undefined...");
    const user = db.getUserByEmail(undefined);
    console.log("User retrieved:", user);
} catch (error) {
    console.error("Error during test:", error);
} finally {
    db.closeDatabase();
}
