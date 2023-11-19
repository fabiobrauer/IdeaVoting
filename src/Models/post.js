import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    dislike:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    doneBefore:[{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
    
},{timestamps: true});

const Post = mongoose.model('Post', postSchema);

export default Post;
