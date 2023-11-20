import express from 'express';
import mongoose from 'mongoose';
import Post from './Models/post.js'; // Adjust the import path as necessary
import cors from 'cors';
import User from './Models/user.js';
import bcrypt from "bcryptjs";
import authenticate from './middleware/authenticate.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const root = path.join(__dirname, '..');

let corsOptions = {};
if (process.env.NODE_ENV === 'development') {
    corsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
    };
} else {
    corsOptions = {
        origin: 'https://idea-voting-387db496fe7a.herokuapp.com',
        optionsSuccessStatus: 200
    };
}

app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
// MongoDB connection setup (ensure this is correctly configured)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));
// ...



app.post('/posts', async (req, res) => {
    try {
        const { content, like, dislike, doneBefore } = req.body;
        const newPost = new Post({ content, like, dislike, doneBefore });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post("/users", async (req,res)=>{
    try {
    const email = req.body.email;
    const password= req.body.password;
    const credentials = new User({email, password});
    await credentials.save();
    res.status(201).json(credentials);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }

})


// Add a new login route
app.post('/login', async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if the provided password matches the one in the database
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // If credentials are correct, handle the login logic here
        const userPayload = { id: user._id, email: user.email }; // Corrected user object
        const accessToken = jwt.sign(userPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // Generate the token
        res.json({ accessToken, message: "Login successful", user }); // Send a single response
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/protected-route', authenticate, (req, res) => {
    // Only accessible if the user is authenticated
    res.json({ message: "Welcome to the protected route!" });
});



app.get('/posts', async (req, res) => {
  try {
      const posts = await Post.find(); // Fetch all posts from the database
      res.json(posts);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



app.patch('/posts/:id/like', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // User ID from the decoded token
    
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (!post.like.includes(userId)) {
            post.like.push(userId);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.delete('/posts/:id/like', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Remove the user's ID from the like array
        const index = post.like.indexOf(userId);
        if (index > -1) {
            post.like.splice(index, 1);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/posts/:postId/like', async (req, res) => {
    const postId = req.params.postId;

    try {
        // Retrieve the post by postId from your database
        // For example, assuming you're using a MongoDB setup
        const post = await Post.findById(postId);

        if (!post) {
            // If no post found, send a 404 response
            return res.status(404).send('Post not found');
        }
        // Assuming your post has a 'like' field that stores an array of user IDs
        const likeDetails = post.like;

        // Send back the like details
        res.json({ like: likeDetails });
    } catch (error) {
        // Handle any other errors
        console.error('Error fetching like details:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.patch('/posts/:id/doneBefore', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (!post.doneBefore.includes(userId)) {
            post.doneBefore.push(userId);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/posts/:id/doneBefore', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming the user ID is stored in req.user

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const index = post.doneBefore.indexOf(userId);
        if (index > -1) {
            post.doneBefore.splice(index, 1);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Route to get the 'done before' details of a post
app.get('/posts/:postId/doneBefore', async (req, res) => {
    const postId = req.params.postId;

    try {
        // Retrieve the post by postId from your database
        const post = await Post.findById(postId);

        if (!post) {
            // If no post found, send a 404 response
            return res.status(404).send('Post not found');
        }

        // Assuming your post has a 'doneBefore' field that stores an array of user IDs
        const doneBeforeDetails = post.doneBefore;

        // Send back the 'done before' details
        res.json({ doneBefore: doneBeforeDetails });
    } catch (error) {
        // Handle any other errors
        console.error('Error fetching done before details:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.patch('/posts/:id/dislike', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id; // User ID from the decoded token

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        if (!post.dislike.includes(userId)) {
            post.dislike.push(userId);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/posts/:id/dislike', authenticate, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const index = post.dislike.indexOf(userId);
        if (index > -1) {
            post.dislike.splice(index, 1);
            await post.save();
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/posts/:postId/dislike', async (req, res) => {
    const postId = req.params.postId;

    try {
        // Retrieve the post by postId from your database
        const post = await Post.findById(postId);

        if (!post) {
            // If no post found, send a 404 response
            return res.status(404).send('Post not found');
        }

        // Assuming your post has a 'dislike' field that stores an array of user IDs
        const dislikeDetails = post.dislike;

        // Send back the dislike details
        res.json({ dislike: dislikeDetails });
    } catch (error) {
        // Handle any other errors
        console.error('Error fetching dislike details:', error);
        res.status(500).send('Internal Server Error');
    }
});





if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(root, 'dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(root,'dist', 'index.html'));
    });
}

// Start the Express server
// ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


