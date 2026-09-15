import app from "./app.js";
import dotenv from 'dotenv';
// Load environment variables from the .env file in the root directory
dotenv.config();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map