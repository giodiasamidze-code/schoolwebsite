import React, { useState } from 'react';
import { Calendar as CalendarIcon, MessageSquare, Send, Heart } from 'lucide-react';

export default function ActivitiesFeed() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [commentInputs, setCommentInputs] = useState({});
  const [events, setEvents] = useState([
    {
      id: 2,
      category: 'basic',
      title: 'ინტელექტუალური თამაში: რა? სად? როდის?',
      date: '12 ნოემბერი, 2026',
      description: 'საბაზო საფეხურის კლასებს შორის გაიმართა ინტელექტუალური ორთაბრძოლა. გამარჯვება მოიპოვა მე-8 ბ კლასის გუნდმა. ვულოცავთ მათ ამ წარმატებას!',
      media: '🧠',
      likes: 42,
      liked: false,
      comments: [
        { author: 'დათო (მოსწავლე)', text: 'ძალიან დაძაბული თამაში გამოვიდა! შემდეგში რევანშს ველოდებით.' }
      ]
    },
    {
      id: 3,
      category: 'high',
      title: 'საკლასო საათი 5D ფორმატში',
      date: '05 დეკემბერი, 2026',
      description: 'საშუალო საფეხურის მოსწავლეებმა ჩაატარეს განსხვავებული საკლასო საათი ვირტუალური რეალობის (VR) ტექნოლოგიების გამოყენებით, სადაც იმოგზაურეს კოსმოსში და შეისწავლეს გალაქტიკები.',
      media: '🚀',
      likes: 56,
      liked: false,
      comments: [
        { author: 'ლუკა (მოსწავლე)', text: 'ეს იყო ყველაზე საინტერესო საკლასო საათი, რაც კი გვქონია!' },
        { author: 'ელენე (მასწავლებელი)', text: 'მიხარია, რომ ასეთი აქტიურები იყავით, შემდეგში VR ლაბორატორიაში ქიმიის ცდებს ჩავატარებთ.' }
      ]
    }
  ]);

  const categories = [
    { id: 'all', label: 'ყველა აქტივობა' },
    { id: 'basic', label: 'საბაზო' },
    { id: 'high', label: 'საშუალო' }
  ];

  const handleLike = (id) => {
    setEvents(events.map(event => {
      if (event.id === id) {
        return {
          ...event,
          likes: event.liked ? event.likes - 1 : event.likes + 1,
          liked: !event.liked
        };
      }
      return event;
    }));
  };

  const handleCommentChange = (eventId, text) => {
    setCommentInputs({
      ...commentInputs,
      [eventId]: text
    });
  };

  const handleCommentSubmit = (e, eventId) => {
    e.preventDefault();
    const commentText = commentInputs[eventId];
    if (!commentText || !commentText.trim()) return;

    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          comments: [...event.comments, { author: 'სტუმარი', text: commentText.trim() }]
        };
      }
      return event;
    }));

    setCommentInputs({
      ...commentInputs,
      [eventId]: ''
    });
  };

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter(e => e.category === activeFilter);

  return (
    <section className="activities-section container" id="school-life">
      <span className="section-eyebrow">სკოლის ცხოვრება</span>
      <h2 className="section-title">აქტივობების ქრონიკა</h2>
      <p className="section-desc">
        თვალი ადევნეთ ჩვენს ყოველდღიურ ცხოვრებას, სასკოლო ღონისძიებებსა და საინტერესო პროექტებს.
      </p>

      {/* Filter Options */}
      <div className="filters-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${activeFilter === cat.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed Container */}
      <div className="activities-feed">
        {filteredEvents.map((event) => (
          <div key={event.id} className="feed-card fade-in">
            {/* Left/Graphic section */}
            <div className="feed-media-wrapper">
              <span className="feed-emoji">{event.media}</span>
            </div>

            {/* Content section */}
            <div className="feed-content">
              <div className="feed-header">
                <span className="feed-date">
                  <CalendarIcon size={14} className="icon-mr" />
                  {event.date}
                </span>
                <span className={`feed-badge ${event.category}`}>
                  {categories.find(c => c.id === event.category)?.label}
                </span>
              </div>
              <h3 className="feed-title">{event.title}</h3>
              <p className="feed-description">{event.description}</p>

              {/* Interaction Bar */}
              <div className="feed-actions">
                <button 
                  className={`feed-action-btn ${event.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(event.id)}
                >
                  <Heart size={16} fill={event.liked ? "var(--accent-primary)" : "none"} />
                  <span>{event.likes} მოწონება</span>
                </button>
                <div className="feed-action-btn">
                  <MessageSquare size={16} />
                  <span>{event.comments.length} კომენტარი</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <div className="comments-list">
                  {event.comments.map((comment, i) => (
                    <div key={i} className="comment-item">
                      <span className="comment-author">{comment.author}:</span>
                      <span className="comment-text">{comment.text}</span>
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <form 
                  onSubmit={(e) => handleCommentSubmit(e, event.id)}
                  className="comment-form"
                >
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="დაწერეთ კომენტარი..."
                    value={commentInputs[event.id] || ''}
                    onChange={(e) => handleCommentChange(event.id, e.target.value)}
                  />
                  <button type="submit" className="comment-submit-btn" aria-label="Send Comment">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
