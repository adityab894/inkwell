const express = require('express');
const Article = require('../models/Article');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all published articles (with filters)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { domain, tag, search, page = 1, limit = 12, sort = '-publishedAt' } = req.query;
    const query = { status: 'published' };

    if (domain && domain !== 'all') query.domain = domain;
    if (tag) query.tags = { $in: [tag] };
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar bio')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    res.json({ articles, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get my articles (author dashboard)
router.get('/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { author: req.user._id };
    if (status) query.status = status;

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-content');

    res.json({ articles, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get single article by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio');

    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.status === 'draft' && (!req.user || article.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'This article is not published yet' });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create article
router.post('/', auth, async (req, res) => {
  try {
    const articleData = { ...req.body, author: req.user._id };
    const article = new Article(articleData);
    await article.save();
    await article.populate('author', 'name avatar bio');
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update article
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(article, req.body);
    await article.save();
    await article.populate('author', 'name avatar bio');
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete article
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    if (article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await article.deleteOne();
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Like/Unlike article
router.post('/:id/like', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const likedIndex = article.likes.indexOf(req.user._id);
    if (likedIndex > -1) {
      article.likes.splice(likedIndex, 1);
    } else {
      article.likes.push(req.user._id);
    }
    await article.save();
    res.json({ likes: article.likes.length, liked: likedIndex === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
