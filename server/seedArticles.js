const mongoose = require('mongoose');
const slugify = require('slugify');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Article = require('./models/Article');
const User = require('./models/User');

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected successfully!');

    // Find primary author user
    let author = await User.findOne({ email: 'adityabisht894@gmail.com' });
    if (!author) {
      author = await User.findOne({});
    }

    if (!author) {
      console.log('No user found in database. Creating default author...');
      author = new User({
        name: 'Aditya Bisht',
        email: 'adityabisht894@gmail.com',
        avatar: '/avatar.png',
        password: 'password123',
        bio: 'Developer Relations Engineer & Technical Writer. Writing about Development, DevOps, AI, and DevRel.',
        role: 'author'
      });
      await author.save();
    } else {
      console.log(`Using author: ${author.name} (${author._id})`);
      if (!author.bio) {
        author.bio = 'Developer Relations Engineer & Technical Writer. Writing about Development, DevOps, AI, and DevRel.';
        await author.save();
      }
    }

    const articlesData = require('./data/articles.json');
    console.log(`Loaded ${articlesData.length} articles from articles.json`);

    // Clean existing articles or update
    const existingCount = await Article.countDocuments({});
    console.log(`Current articles in DB: ${existingCount}`);

    let inserted = 0;
    for (let i = 0; i < articlesData.length; i++) {
      const data = articlesData[i];
      const baseSlug = slugify(data.title, { lower: true, strict: true }) || 'post-' + i;
      const slug = `${baseSlug}-${1000 + i}`;

      // Check if already exists by slug or title
      const existing = await Article.findOne({ title: data.title });
      if (existing) {
        existing.content = data.content;
        existing.subtitle = data.subtitle || '';
        existing.excerpt = data.excerpt || '';
        existing.coverImage = data.coverImage || '';
        existing.domain = data.domain;
        existing.tags = data.tags || [data.domain];
        existing.status = 'published';
        existing.readTime = data.readTime || 5;
        if (data.likes && Array.isArray(data.likes) && data.likes.length > 0) {
          existing.likes = data.likes.map(id => new mongoose.Types.ObjectId(id));
        }
        existing.publishedAt = data.publishedAt ? new Date(data.publishedAt) : new Date();
        await existing.save();
        console.log(`Updated [${data.domain}] ${data.title}`);
      } else {
        const initialLikes = data.likes && Array.isArray(data.likes) && data.likes.length > 0
          ? data.likes.map(id => new mongoose.Types.ObjectId(id))
          : Array.from({ length: Math.floor(Math.random() * 21) + 10 }, () => new mongoose.Types.ObjectId());
        const article = new Article({
          title: data.title,
          slug,
          subtitle: data.subtitle || '',
          content: data.content,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
          author: author._id,
          domain: data.domain,
          tags: data.tags || [data.domain],
          status: 'published',
          readTime: data.readTime || 5,
          views: Math.floor(Math.random() * 450) + 50,
          likes: initialLikes,
          layout: {
            fontFamily: 'Georgia, serif',
            fontSize: 'medium',
            textColor: '',
            accentColor: '#7c3aed',
            layoutStyle: 'classic'
          },
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(Date.now() - (i * 86400000 * 2))
        });
        await article.save();
        inserted++;
        console.log(`Inserted [${data.domain}] ${data.title}`);
      }
    }

    console.log(`\nSeed completed! Added/updated ${articlesData.length} articles (${inserted} new).`);

    const totalNow = await Article.countDocuments({});
    console.log(`Total articles in DB now: ${totalNow}`);

    const countsByDomain = await Article.aggregate([
      { $group: { _id: '$domain', count: { $sum: 1 } } }
    ]);
    console.log('Domain breakdown in DB:', countsByDomain);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding articles:', err);
    process.exit(1);
  }
}

seed();

