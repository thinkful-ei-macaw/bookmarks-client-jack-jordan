import React from 'react';
import PropTypes from 'prop-types';
import Rating from '../Rating/Rating';
import { Link } from 'react-router-dom';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, cb) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: `bearer ${config.API_KEY}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((error) => Promise.reject(error));
      }
      // no content on success, so skip res.json()
    })
    .then(() => {
      cb(bookmarkId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
        <li className="BookmarkItem">
          <div className="BookmarkItem__row">
            <h3 className="BookmarkItem__title">
              <a
                href={props.site_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {props.title}
              </a>
            </h3>
            <Rating value={props.rating} />
          </div>
          <p className="BookmarkItem__description">{props.site_description}</p>
          <div className="BookmarkItem__buttons">
            <button
              className="BookmarkItem__description"
              onClick={() => {
                deleteBookmarkRequest(props.id, context.deleteBookmark);
              }}
            >
              Delete
            </button>
            <Link to={`/edit-bookmark/${props.id}`}>Edit Bookmark</Link>
          </div>
        </li>
      )}
    </BookmarksContext.Consumer>
  );
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
};

BookmarkItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string.isRequired,
  site_url: PropTypes.string.isRequired,
  site_desciption: PropTypes.string,
  rating: PropTypes.number.isRequired,
  onClickDelete: PropTypes.func,
};
