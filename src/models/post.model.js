import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectID,  // Used to define reference to other models
        ref:'Category',
        required: false
    }],

});

module.exports = mongoose.model('Post', postSchema);