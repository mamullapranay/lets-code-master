require('dotenv').config({ path: './config/config.env' });

const express = require('express');
const connectDB = require('./config/db');
const fetch = require('node-fetch');
global.fetch = fetch;
const atob = require('atob');
global.atob = atob;

const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const File = require('./models/file.model');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1", require('./routes/index'));
app.use("/api/private", require('./routes/private'));

// Error handling middleware
app.use(errorHandler);

// Function to find file in the database
async function findFile(id) {
    if (id == null) return;
    try {
        const file = await File.findById(id);
        return file;
    } catch (err) {
        console.error(`Error finding file: ${err.message}`);
        return null;
    }
}

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Socket.io setup for real-time communication
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    socket.on('get-document', async fileID => {
        const file = await findFile(fileID);
        if (file) {
            socket.join(fileID);
            socket.emit("load-document", file.text);

            socket.on('send-changes', delta => {
                socket.broadcast.to(fileID).emit('recieved-changes', delta);
            });

            socket.on('save-document', async data => {
                try {
                    await File.findByIdAndUpdate(fileID, { text: data });
                } catch (err) {
                    console.error(`Error saving document: ${err.message}`);
                }
            });
        }
    });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error, promise) => {
    console.log(error.message);
    server.close(() => process.exit(1)); // Corrected
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated');
    });
});
