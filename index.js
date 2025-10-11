const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    process.env.FRONTEND_URL, // Vercel frontend URL from environment variable
    /\.vercel\.app$/ // Allow any Vercel app
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://trello_db:dVHleCUTmQhewNmQ@cluster0.vxqz6e2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Global variables for database collections
let database;
let listsCollection;
let cardsCollection;

async function connectToMongoDB() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");
    
    // Set up database and collections
    database = client.db("trello_db");
    listsCollection = database.collection("lists");
    cardsCollection = database.collection("cards");
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
}

// // Routes (defined outside of MongoDB connection)
// app.post('/users', async (req, res) => {
//   try {
//     if (!userCollection) {
//       return res.status(500).json({
//         success: false,
//         message: 'Database not connected'
//       });
//     }
    
//     const user = req.body;
//     console.log('new user', user);
    
//     const result = await userCollection.insertOne(user);
    
//     res.json({
//       success: true,
//       message: 'User saved successfully',
//       insertedId: result.insertedId
//     });
//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to save user',
//       error: error.message
//     });
//   }
// });


app.post('/cards', async (req, res) => {
  try {
    // DB connection check
    if (!cardsCollection) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const card = req.body;
    console.log('New single card:', card);

    if (!card.cardTitle) {
      return res.status(400).json({
        success: false,
        message: 'Card title is required'
      });
    }

    const result = await cardsCollection.insertOne(card);
    
    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      insertedId: result.insertedId,
      card: card
    });
    
  } catch (error) {
    console.error('Error creating single card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create card',
      error: error.message
    });
  }
});


app.get('/cards', async (req, res) => {
  try {
    if (!cardsCollection) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const cards = await cardsCollection.find({}).toArray();
    
    res.json({
      success: true,
      count: cards.length,
      cards: cards
    });
    
  } catch (error) {
    console.error('Error retrieving single cards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cards',
      error: error.message
    });
  }
});


app.delete('/cards/:id', async (req, res) => {
  try {
    if (!cardsCollection) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    const cardId = req.params.id;
    console.log('Deleting card with ID:', cardId);

    if (!ObjectId.isValid(cardId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card ID format'
      });
    }

    const result = await cardsCollection.deleteOne({ _id: new ObjectId(cardId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Card deleted successfully',
      deletedId: cardId
    });
    
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete card',
      error: error.message
    });
  }
});


app.get('/', (req, res) => {
  res.send('trello backend server is running');
});

// Start server and connect to MongoDB
async function startServer() {
  // Connect to MongoDB first
  const mongoConnected = await connectToMongoDB();
  
  if (!mongoConnected) {
    console.log("Warning: MongoDB connection failed, but server will still start");
  }
  
  // Start the server regardless of MongoDB connection status
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`MongoDB connected: ${mongoConnected ? 'Yes' : 'No'}`);
  });
}

startServer();