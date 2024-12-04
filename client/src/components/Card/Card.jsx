// Card.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import BigCard from '../BigCard/BigCard'; // Corrected import path
import './Card.css';

const Card = ({ id, title, description, image, query, reFetchResults }) => {
  const [showBigCard, setShowBigCard] = useState(false);

  const handleShowBigCard = () => {
    setShowBigCard(true);
  };

  const handleHideBigCard = () => {
    setShowBigCard(false);
  };

  const descriptionText = description || '';
  const truncatedDescription = `${descriptionText.slice(0, 120)}...`;

  const highlightQueryTerms = (text) => {
    if (!query) return text;
    const terms = query
      .split(' ')
      .map((term) => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .filter((term) => term);
    const regexPattern = terms.join('|');
    const regex = new RegExp(`(${regexPattern})`, 'gi');
    const highlightedText = text.replace(regex, '<strong>$1</strong>');
    return DOMPurify.sanitize(highlightedText);
  };

  const getSnippetWithQueryTerms = (titleText, descriptionText, query, snippetLength = 150) => {
    if (!query) return descriptionText.slice(0, snippetLength) + '...';

    const terms = query
      .split(' ')
      .map((term) => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .filter((term) => term);

    const regexPattern = terms.join('|');
    const regex = new RegExp(`(${regexPattern})`, 'i');

    const snippets = [];

    const matchesInTitle = regex.test(titleText);
    const matchesInDescription = regex.test(descriptionText);

    if (matchesInTitle) {
      const highlightedTitle = highlightQueryTerms(titleText);
      snippets.push(highlightedTitle);
    }

    if (matchesInDescription) {
      regex.lastIndex = 0;
      const match = regex.exec(descriptionText);
      if (match) {
        const matchIndex = match.index;

        const snippetStart = Math.max(0, matchIndex - Math.floor(snippetLength / 2));
        const snippetEnd = Math.min(
          descriptionText.length,
          matchIndex + Math.ceil(snippetLength / 2)
        );

        let snippet = descriptionText.slice(snippetStart, snippetEnd);
        if (snippetStart > 0) snippet = '...' + snippet;
        if (snippetEnd < descriptionText.length) snippet = snippet + '...';

        const highlightedSnippet = highlightQueryTerms(snippet);
        snippets.push(highlightedSnippet);
      }
    }

    if (snippets.length > 0) return snippets.join(', ');
    let snippet = descriptionText.slice(0, snippetLength);
    if (descriptionText.length > snippetLength) snippet += '...';
    return highlightQueryTerms(snippet);
  };

  const snippet = getSnippetWithQueryTerms(title, descriptionText, query, 150);

  const [feedbackType, setFeedbackType] = useState(null);

  const handleThumbsUp = async (event) => {
    event.stopPropagation(); // Prevent click from propagating to the parent
    await sendFeedback(id, 'positive');
    setFeedbackType('positive');
    reFetchResults();
  };

  const handleThumbsDown = async (event) => {
    event.stopPropagation(); // Prevent click from propagating to the parent
    await sendFeedback(id, 'negative');
    setFeedbackType('negative');
    reFetchResults();
  };

  const sendFeedback = async (documentId, feedbackType) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, feedbackType }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <>
      {showBigCard ? (
        <BigCard
          title={title}
          description={description}
          image={image}
          onClose={handleHideBigCard}
        />
      ) : (
        <div className="card">
          <div className="card-image" onClick={handleShowBigCard}>
            <img src={image} alt={title} />
            <div className="feedback-buttons">
              <button
                className={`thumb-button up ${feedbackType === 'positive' ? 'clicked' : ''}`}
                onClick={handleThumbsUp}
                disabled={feedbackType !== null}
              >
                <FaThumbsUp />
              </button>
              <button
                className={`thumb-button down ${feedbackType === 'negative' ? 'clicked' : ''}`}
                onClick={handleThumbsDown}
                disabled={feedbackType !== null}
              >
                <FaThumbsDown />
              </button>
            </div>
          </div>
          <div className="card-content">
            <h3 className="card-title" onClick={handleShowBigCard}>{title}</h3>
            <p className="card-description">{truncatedDescription}</p>
            <hr className="card-divider" />
            <div className="card-snippet">
              <p
                className="snippet-text"
                dangerouslySetInnerHTML={{ __html: snippet }}
              ></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
  reFetchResults: PropTypes.func.isRequired,
};

export default Card;
