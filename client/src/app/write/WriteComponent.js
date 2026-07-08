'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Save, Send, Image, X,
  AlignLeft, Type, Palette, Layout, Bold, Italic,
  List, Quote, Code, Link2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '@/styles/Write.css';

const DOMAINS = ['technology','lifestyle','travel','food','health','finance','culture','science','personal','other'];
const FONT_FAMILIES = [
  { label: 'Georgia (Classic)', value: 'Georgia, serif' },
  { label: 'Merriweather (Editorial)', value: "'Merriweather', serif" },
  { label: 'Lora (Literary)', value: "'Lora', serif" },
  { label: 'Source Serif (Modern)', value: "'Source Serif 4', serif" },
  { label: 'Inter (Clean)', value: "'Inter', sans-serif" },
  { label: 'Playfair Display (Elegant)', value: "'Playfair Display', serif" },
];
const FONT_SIZES = ['small','medium','large','xlarge'];
const LAYOUTS = [
  { value: 'classic', label: 'Classic', icon: '📄' },
  { value: 'magazine', label: 'Magazine', icon: '📰' },
  { value: 'minimal', label: 'Minimal', icon: '✦' },
];
const ACCENT_COLORS = [
  '#7c3aed','#2563eb','#059669','#dc2626','#d97706','#db2777','#0891b2','#4f46e5','#16a34a','#9333ea'
];

export default function WriteComponent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const coverRef = useRef(null);

  const [form, setForm] = useState({
    title: '', subtitle: '', content: '', excerpt: '',
    domain: 'personal', tags: [], status: 'draft', coverImage: '',
    layout: {
      fontFamily: 'Georgia, serif',
      fontSize: 'medium',
      textColor: '#1c1917',
      accentColor: '#7c3aed',
      layoutStyle: 'classic'
    }
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activePanel, setActivePanel] = useState('write'); // write | style | preview
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(`/api/articles/${id}`);
      const a = res.data;
      setForm({
        title: a.title || '',
        subtitle: a.subtitle || '',
        content: a.content || '',
        excerpt: a.excerpt || '',
        domain: a.domain || 'personal',
        tags: a.tags || [],
        status: a.status || 'draft',
        coverImage: a.coverImage || '',
        layout: a.layout || form.layout
      });
      // trigger word count update
      const text = (a.content || '').replace(/<[^>]*>/g, '').trim();
      const words = text ? text.split(/\s+/).length : 0;
      setWordCount(words);
      setReadTime(Math.max(1, Math.ceil(words / 200)));
    } catch {
      toast.error('Failed to load article');
    }
  };

  const updateContent = useCallback((html) => {
    setForm(f => ({ ...f, content: html }));
    const text = html.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    setWordCount(words);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  }, []);

  const handleExecCommand = (cmd, value = null) => {
    if (typeof document !== 'undefined') {
      document.execCommand(cmd, false, value);
      editorRef.current?.focus();
      const html = editorRef.current?.innerHTML || '';
      updateContent(html);
    }
  };

  const handleEditorInput = () => {
    const html = editorRef.current?.innerHTML || '';
    updateContent(html);
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) handleExecCommand('createLink', url);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload/image', formData);
      handleExecCommand('insertImage', res.data.url);
    } catch {
      toast.error('Image upload failed');
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('/api/upload/image', formData);
      setForm(f => ({ ...f, coverImage: res.data.url }));
      toast.success('Cover image uploaded!');
    } catch {
      toast.error('Cover upload failed');
    }
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g,'');
      if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
        setForm(f => ({ ...f, tags: [...f.tags, tag] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const save = async (status = 'draft') => {
    if (!form.title.trim()) return toast.error('Please add a title');
    if (!form.content.replace(/<[^>]*>/g,'').trim()) return toast.error('Please write some content');

    const setter = status === 'published' ? setPublishing : setSaving;
    setter(true);
    try {
      const payload = { ...form, status };
      let res;
      if (isEditing) {
        res = await axios.put(`/api/articles/${id}`, payload);
      } else {
        res = await axios.post('/api/articles', payload);
      }
      toast.success(status === 'published' ? '🎉 Article published!' : '✅ Draft saved!');
      if (status === 'published') {
        router.push(`/article/${res.data.slug}`);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setter(false);
    }
  };

  const updateLayout = (key, val) => {
    setForm(f => ({ ...f, layout: { ...f.layout, [key]: val } }));
  };

  const fontSizeMap = { small: '0.95rem', medium: '1.1rem', large: '1.2rem', xlarge: '1.35rem' };

  return (
    <div className="write-page">
      {/* Top Bar */}
      <div className="write-topbar">
        <div className="write-topbar__left">
          <button className="btn btn-ghost btn-sm" onClick={() => router.back()}>← Back</button>
          <div className="write-stats">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{readTime} min read</span>
          </div>
        </div>
        <div className="write-topbar__tabs">
          {['write', 'style', 'preview'].map(tab => (
            <button
              key={tab}
              className={`write-tab ${activePanel === tab ? 'write-tab--active' : ''}`}
              onClick={() => setActivePanel(tab)}
            >
              {tab === 'write' && <AlignLeft size={15} />}
              {tab === 'style' && <Palette size={15} />}
              {tab === 'preview' && <Eye size={15} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="write-topbar__actions">
          <button className="btn btn-outline btn-sm" onClick={() => save('draft')} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => save('published')} disabled={publishing}>
            <Send size={15} /> {publishing ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="write-body">
        {/* WRITE PANEL */}
        {activePanel === 'write' && (
          <div className="write-panel animate-fade-in">
            <div className="write-editor-wrap">
              {/* Cover Image */}
              <div className="cover-upload" onClick={() => coverRef.current?.click()}>
                {form.coverImage ? (
                  <div className="cover-preview">
                    <img src={form.coverImage} alt="Cover" />
                    <button className="cover-remove" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, coverImage: '' })); }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="cover-placeholder">
                    <Image size={24} />
                    <span>Add a cover image</span>
                  </div>
                )}
                <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverUpload} />
              </div>

              {/* Domain & Tags */}
              <div className="meta-row">
                <select
                  className="domain-select"
                  value={form.domain}
                  onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                >
                  {DOMAINS.map(d => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>

                <div className="tags-input-wrap">
                  {form.tags.map(tag => (
                    <span key={tag} className="tag-pill">
                      #{tag} <button onClick={() => removeTag(tag)}><X size={11} /></button>
                    </span>
                  ))}
                  {form.tags.length < 5 && (
                    <input
                      type="text"
                      placeholder="Add tag (Enter)"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      className="tag-input"
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <textarea
                className="title-input"
                placeholder="Article title…"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                rows={2}
              />

              {/* Subtitle */}
              <input
                type="text"
                className="subtitle-input"
                placeholder="Add a subtitle (optional)…"
                value={form.subtitle}
                onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
              />

              {/* Toolbar */}
              <div className="editor-toolbar">
                <div className="toolbar-group">
                  <button className="toolbar-btn" onClick={() => handleExecCommand('bold')} title="Bold">
                    <Bold size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={() => handleExecCommand('italic')} title="Italic">
                    <Italic size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={() => handleExecCommand('underline')} title="Underline">
                    <span style={{ textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600 }}>U</span>
                  </button>
                </div>
                <div className="toolbar-sep" />
                <div className="toolbar-group">
                  <button className="toolbar-btn" onClick={() => handleExecCommand('formatBlock','<h2>')} title="Heading">
                    <Type size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={() => handleExecCommand('insertUnorderedList')} title="List">
                    <List size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={() => handleExecCommand('formatBlock','<blockquote>')} title="Quote">
                    <Quote size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={() => handleExecCommand('formatBlock','<pre>')} title="Code">
                    <Code size={15} />
                  </button>
                  <button className="toolbar-btn" onClick={insertLink} title="Link">
                    <Link2 size={15} />
                  </button>
                </div>
                <div className="toolbar-sep" />
                <div className="toolbar-group">
                  <button className="toolbar-btn" onClick={() => fileRef.current?.click()} title="Insert image">
                    <Image size={15} />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={e => handleImageUpload(e.target.files?.[0])}
                  />
                </div>
              </div>

              {/* Rich Content Editable */}
              <div
                ref={editorRef}
                className="rich-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                data-placeholder="Start writing your story…"
                style={{
                  fontFamily: form.layout.fontFamily,
                  fontSize: fontSizeMap[form.layout.fontSize],
                  color: form.layout.textColor
                }}
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            </div>
          </div>
        )}

        {/* STYLE PANEL */}
        {activePanel === 'style' && (
          <div className="style-panel animate-fade-in">
            <div className="style-section">
              <h3 className="style-section-title"><Type size={16} /> Typography</h3>
              <div className="style-field">
                <label>Font Family</label>
                <select className="input" value={form.layout.fontFamily} onChange={e => updateLayout('fontFamily', e.target.value)}>
                  {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div className="style-field">
                <label>Font Size</label>
                <div className="size-btns">
                  {FONT_SIZES.map(s => (
                    <button key={s} className={`size-btn ${form.layout.fontSize === s ? 'active' : ''}`} onClick={() => updateLayout('fontSize', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="style-section">
              <h3 className="style-section-title"><Palette size={16} /> Colors</h3>
              <div className="style-field">
                <label>Text Color</label>
                <div className="color-row">
                  <input type="color" value={form.layout.textColor} onChange={e => updateLayout('textColor', e.target.value)} className="color-picker" />
                  <span className="color-val">{form.layout.textColor}</span>
                </div>
              </div>
              <div className="style-field">
                <label>Accent Color</label>
                <div className="accent-swatches">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c}
                      className={`swatch ${form.layout.accentColor === c ? 'swatch--active' : ''}`}
                      style={{ background: c }}
                      onClick={() => updateLayout('accentColor', c)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="style-section">
              <h3 className="style-section-title"><Layout size={16} /> Layout</h3>
              <div className="layout-options">
                {LAYOUTS.map(l => (
                  <button
                    key={l.value}
                    className={`layout-option ${form.layout.layoutStyle === l.value ? 'active' : ''}`}
                    onClick={() => updateLayout('layoutStyle', l.value)}
                  >
                    <span className="layout-icon">{l.icon}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="style-section">
              <h3 className="style-section-title">Excerpt</h3>
              <textarea
                className="input"
                rows={3}
                placeholder="Write a short excerpt (shown in article cards)…"
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* PREVIEW PANEL */}
        {activePanel === 'preview' && (
          <div className="preview-panel animate-fade-in">
            <div className={`preview-content layout-${form.layout.layoutStyle}`}>
              {form.coverImage && (
                <img src={form.coverImage} alt="Cover" className="preview-cover" />
              )}
              <div className="preview-header">
                <span className="badge badge-accent" style={{ textTransform: 'capitalize' }}>{form.domain}</span>
                <h1 className="preview-title" style={{ fontFamily: form.layout.fontFamily }}>
                  {form.title || 'Your Article Title'}
                </h1>
                {form.subtitle && <p className="preview-subtitle">{form.subtitle}</p>}
                <div className="preview-byline">
                  <div className="author-avatar">
                    <span>{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{readTime} min read · {wordCount} words</span>
                  </div>
                </div>
              </div>
              <div
                className="article-body"
                style={{
                  fontFamily: form.layout.fontFamily,
                  fontSize: fontSizeMap[form.layout.fontSize],
                  color: form.layout.textColor,
                  '--article-accent': form.layout.accentColor
                }}
                dangerouslySetInnerHTML={{ __html: form.content || '<p style="color:var(--text-muted)">Your article content will appear here…</p>' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
