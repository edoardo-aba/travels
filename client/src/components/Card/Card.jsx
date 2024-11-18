// Card.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // Import icons
import './Card.css';

const Card = ({ id, title, description, image, query, reFetchResults }) => {
  const descriptionText = description || '';
  const truncatedDescription = `${descriptionText.slice(0, 120)}...`;

  // Function to highlight query terms in the text
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

  // Function to get a snippet from title and/or description
  const getSnippetWithQueryTerms = (titleText, descriptionText, query, snippetLength = 150) => {
    if (!query) return descriptionText.slice(0, snippetLength) + '...';

    const terms = query
      .split(' ')
      .map((term) => term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'))
      .filter((term) => term);

    const regexPattern = terms.join('|');
    const regex = new RegExp(`(${regexPattern})`, 'i'); // Case-insensitive, first occurrence

    const snippets = [];

    const matchesInTitle = regex.test(titleText);
    const matchesInDescription = regex.test(descriptionText);

    if (matchesInTitle) {
      // Highlight query terms in the title
      const highlightedTitle = highlightQueryTerms(titleText);
      snippets.push(highlightedTitle);
    }

    if (matchesInDescription) {
      // Reset regex lastIndex if using global flag
      regex.lastIndex = 0;
      // Find the match in the description and extract a snippet
      const match = regex.exec(descriptionText);
      if (match) {
        const matchIndex = match.index;

        const snippetStart = Math.max(0, matchIndex - Math.floor(snippetLength / 2));
        const snippetEnd = Math.min(
          descriptionText.length,
          matchIndex + Math.ceil(snippetLength / 2)
        );

        let snippet = descriptionText.slice(snippetStart, snippetEnd);

        // Add ellipses if snippet doesn't start at the beginning or end at the end
        if (snippetStart > 0) {
          snippet = '...' + snippet;
        }
        if (snippetEnd < descriptionText.length) {
          snippet = snippet + '...';
        }

        // Highlight query terms in the snippet
        const highlightedSnippet = highlightQueryTerms(snippet);

        snippets.push(highlightedSnippet);
      }
    }

    if (snippets.length > 0) {
      // Join snippets with a comma
      return snippets.join(', ');
    } else {
      // If no matches, return the start of the description
      let snippet = descriptionText.slice(0, snippetLength);
      if (descriptionText.length > snippetLength) {
        snippet += '...';
      }
      const highlightedSnippet = highlightQueryTerms(snippet);
      return highlightedSnippet;
    }
  };

  // Prepare the snippet
  const snippet = getSnippetWithQueryTerms(title, descriptionText, query, 150);

  // State to track which feedback was given
  const [feedbackType, setFeedbackType] = useState(null);

  // Function to handle thumbs up
  const handleThumbsUp = async () => {
    await sendFeedback(id, 'positive');
    setFeedbackType('positive');
    reFetchResults(); // Re-fetch results after feedback
  };

  // Function to handle thumbs down
  const handleThumbsDown = async () => {
    await sendFeedback(id, 'negative');
    setFeedbackType('negative');
    reFetchResults(); // Re-fetch results after feedback
  };

  const sendFeedback = async (documentId, feedbackType) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, feedbackType }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      // Optionally handle error
    }
  };

  return (
    <div className="card">
      <div className="card-image">
        <img src={image} alt={title} />
        {/* Feedback buttons */}
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
        <h3 className="card-title">{title}</h3>
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
