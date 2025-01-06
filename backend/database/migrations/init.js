const mongoose = require('mongoose');
require('dotenv').config();

const initDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected');

        // Define your schemas and models here
        require('../../models/User');
        require('../../models/Task');
        require('../../models/Timer');

    } catch (error) {
        console.error('Database connection error:', error);
    }
};

initDB();