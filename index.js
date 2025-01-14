const express = require("express");
const os = require("os");
const cors = require("cors");
const cluster = require("cluster");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const limiter = require("./utils/limiter");
const logger = require("./utils/logger");
const morganMiddleware = require("./utils/morganLogger");
const Auth = require("./routes/AuthRoutes")
const AdminRoutes = require("./routes/adminRoutes")
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Initialize Passport
// require('./config/passport')(passport);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morganMiddleware);
app.use(limiter);
// Log IP addresses middleware
app.use((req, res, next) => {
    logger.info(
        `IP: ${req.ip}, Time: ${new Date().toISOString()}, Method: ${
            req.method
        }, URL: ${req.originalUrl}`
    );
    next();
});

// Routes
app.get("/", (req, res) => {
    return res.status(200).json({
        status: 200,
        message:"Everything is fine",
        routes: {
            Auth: {
                Signup:"/api/auth/signup",
                Signing:"/api/auth/signing",
                Logout:"/api/auth/logout"
            }
        }
    })
});

// Routes
app.use("/api/auth", Auth)
app.use("/api/admin", AdminRoutes)
// Handle 404 Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: "Not Found - Invalid URL" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({
        message: "Something went wrong",
        error: err.message,
    });
});

const PORT =  5001;


if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started on port ${PORT}`);
    });
}
