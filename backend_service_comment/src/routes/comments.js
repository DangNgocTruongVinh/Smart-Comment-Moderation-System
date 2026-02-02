const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');
const axios = require('axios');

// POST /comments
router.post('/', async (req, res) => {
    try {
        const { username, content } = req.body;
        if (!username || !content) return res.status(400).json({ detail: 'username and content required' });

        // Call NLP service
        const nlpRes = await axios.post(process.env.NLP_SERVICE_URL || 'http://localhost:8001/classify', { text: content }, { timeout: 10000 });
        const nlp = nlpRes.data;
        const label_name = nlp.label_name;
        const confidence = nlp.confidence;
        const status = label_name === 'normal' ? 'approved' : 'pending';

        const comment = new Comment({ username, content, status, predicted_label: label_name, confidence });
        const saved = await comment.save();
        return res.status(201).json(saved);
    } catch (err) {
        console.error(err.message || err);
        return res.status(502).json({ detail: 'Failed to process comment' });
    }
});

// GET /comments?status=...
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status) query.status = status;
        const items = await Comment.find(query).sort({ created_at: -1 }).exec();
        return res.json(items);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ detail: 'Failed to fetch comments' });
    }
});

// PUT /comments/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ detail: 'Invalid status' });
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ detail: 'Invalid id' });
        const updated = await Comment.findByIdAndUpdate(id, { status }, { new: true }).exec();
        if (!updated) return res.status(404).json({ detail: 'Not found' });
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ detail: 'Failed to update' });
    }
});

// DELETE /comments/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ detail: 'Invalid id' });
        const result = await Comment.findByIdAndDelete(id).exec();
        if (!result) return res.status(404).json({ detail: 'Not found' });
        return res.json({ detail: 'deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ detail: 'Failed to delete' });
    }
});

module.exports = router;
