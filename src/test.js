require('dotenv').config();
const mongoose = require('mongoose');
const Store = require('./models/store.model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bike-rental';

// Test function
async function testStoreOperations() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create a test store
        const testStore = await Store.create({
            location: "Test Location",
            description: "Test Description"
        });
        console.log('Created test store:', testStore);

        // Find all stores
        const stores = await Store.find();
        console.log('All stores:', stores);

        // Cleanup
        await Store.deleteMany({});
        console.log('Cleanup completed');

        process.exit(0);
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

testStoreOperations(); 