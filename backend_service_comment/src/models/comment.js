const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
        predicted_label: { type: String, default: null },
        confidence: { type: Number, default: null },
        created_at: { type: Date, default: Date.now, index: true },
    },
    { collection: 'comments' }
);

// Compound index status + created_at desc
CommentSchema.index({ status: 1, created_at: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
