import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";


const PORT = config.app.port || 6000;

app.listen(PORT, async () => {
    console.log(`Server is running at ${config.app.baseUrl}:${config.app.port}`);
    await connectDB();
});

