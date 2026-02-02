require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const commentsRouter = require('./routes/comments');
const Comment = require('./models/comment');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/comments', commentsRouter);

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'comment_db';
const FULL_URL = `${MONGODB_URL}/${DB_NAME}`;

async function start() {
    try {
        await mongoose.connect(FULL_URL, { dbName: DB_NAME });
        console.log('Connected to MongoDB', FULL_URL);

        // Ensure indexes on startup
        await Comment.createIndexes();
        console.log('Indexes ensured');

        const port = process.env.PORT || 8000;
        app.listen(port, () => console.log(`backend_service_comment running on http://0.0.0.0:${port}`));
    } catch (err) {
        console.error('Failed to start server', err);
        process.exit(1);
    }
}

start();
