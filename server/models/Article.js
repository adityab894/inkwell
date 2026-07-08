const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, unique: true },
  subtitle: { type: String, trim: true, maxlength: 300 },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 500 },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: {
    type: String,
    enum: ['technology', 'lifestyle', 'travel', 'food', 'health', 'finance', 'culture', 'science', 'personal', 'other'],
    default: 'other'
  },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  readTime: { type: Number, default: 5 },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Layout & styling preferences
  layout: {
    fontFamily: { type: String, default: 'Georgia' },
    fontSize: { type: String, default: 'medium' },
    textColor: { type: String, default: '#1a1a1a' },
    accentColor: { type: String, default: '#6366f1' },
    layoutStyle: { type: String, default: 'classic' }
  },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

articleSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.isModified('content')) {
    const words = this.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
    if (!this.excerpt) {
      this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 300) + '...';
    }
  }
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Article', articleSchema);
