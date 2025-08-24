// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        initializeDatabase();
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Define User and History Schemas
const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    totalPoints: { type: Number, default: 0 },
    profilePic: String
});

const historySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    awardedPoints: Number,
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const History = mongoose.model('History', historySchema);

// Initial User Data
const initialUsers = [
    { id: 1, name: 'Pavan', totalPoints: 950, profilePic: 'https://placehold.co/100x100/A088FF/FFFFFF?text=P' },
    { id: 2, name: 'Vardhan', totalPoints: 870, profilePic: 'https://placehold.co/100x100/50C878/FFFFFF?text=V' },
    { id: 3, name: 'Sriram', totalPoints: 780, profilePic: 'https://placehold.co/100x100/FF5733/FFFFFF?text=S' },
    { id: 4, name: 'Arya', totalPoints: 650, profilePic: 'https://placehold.co/100x100/0000FF/FFFFFF?text=A' },
    { id: 5, name: 'Siddhu', totalPoints: 590, profilePic: 'https://placehold.co/100x100/FFC0CB/000000?text=S' },
    { id: 6, name: 'Ashish', totalPoints: 420, profilePic: 'https://placehold.co/100x100/000000/FFFFFF?text=A' },
    { id: 7, name: 'Chaitanya', totalPoints: 310, profilePic: 'https://placehold.co/100x100/87CEEB/000000?text=C' },
    { id: 8, name: 'Koushik', totalPoints: 250, profilePic: 'https://placehold.co/100x100/FFA500/000000?text=K' },
    { id: 9, name: 'Prabhas', totalPoints: 180, profilePic: 'https://placehold.co/100x100/800080/FFFFFF?text=P' },
    { id: 10, name: 'Kohli', totalPoints: 120, profilePic: 'https://placehold.co/100x100/FFD700/000000?text=K' },
];

const initializeDatabase = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            await User.insertMany(initialUsers);
            console.log('Initial users created in the database.');
        } else {
            console.log('Database already populated. Skipping initialization.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

// API Endpoints
app.post('/api/claim', async (req, res) => {
    try {
        const { userId } = req.body;
        const awardedPoints = Math.floor(Math.random() * 10) + 1;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $inc: { totalPoints: awardedPoints } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await History.create({ userId: updatedUser._id, awardedPoints });

        res.json({
            user: updatedUser,
            awardedPoints,
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().sort({ totalPoints: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        const history = await History.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'name profilePic');
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const { name, totalPoints, profilePic } = req.body;
        
        const newUser = new User({
            name,
            totalPoints: totalPoints || 0,
            profilePic: profilePic || `https://placehold.co/100x100/6B46C1/FFFFFF?text=${name.charAt(0).toUpperCase()}`
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.post('/api/reset', async (req, res) => {
    try {
        await User.deleteMany({});
        await History.deleteMany({});
        await initializeDatabase();
        res.json({ message: 'Database reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/api/debug', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const historyCount = await History.countDocuments();
        const users = await User.find().limit(5);
        res.json({
            userCount,
            historyCount,
            sampleUsers: users,
            mongoUri: process.env.MONGO_URI ? 'Configured' : 'Not configured'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
