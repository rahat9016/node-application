const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("./helpers/logger");
const expressWinston = require("express-winston");
const AppError = require("./helpers/Error");
const UserRoutes = require("./routes/user/userRoutes");
const AdminRoutes = require("./routes/admin/adminRoutes");
// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Middleware to log all requests
app.use(
    expressWinston.logger({
        winstonInstance: logger,
        statusLevels: true, // Use different log levels based on response status codes
        msg: "HTTP {{req.method}} {{req.url}}",
        meta: false, // When true, log the metadata about the request (default to true)
    })
);

dotenv.config();

// MongoDB connection
mongoose
    .connect(process.env.DATABASE_ACCESS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        logger.error(err.message);
        console.log({ err });
        throw new Error(err);
    });

// Routes
app.use("/api/users", UserRoutes);
app.use("/api/admin", AdminRoutes);
// Handle all undefined routes
app.all("*", (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
// Global error handling middleware
app.use((error, req, res, next) => {
    // console.log("Error-------->",error);

    // If response headers are already sent, delegate to the default Express error handler
    if (res.headersSent) {
        return next(error);
    }

    // Log the error details for internal purposes
    if (!error.isOperational) {
        logger.error(error);
    }

    const statusCode = error.statusCode || 500;
    const status = error.status || "error";
    const message =
        statusCode === 500 ? "Internal Server Error" : error.message;

    res.status(statusCode).json({
        status,
        message,
    });
});

// app listening
app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
});
