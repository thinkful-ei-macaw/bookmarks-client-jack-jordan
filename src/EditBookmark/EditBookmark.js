import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../config';
import BookmarksContext from '../BookmarksContext';
import './EditBookmark.css';

const Required = () => <span className="AddBookmark__required">*</span>;

class AddBookmark extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    title: '',
    site_url: '',
    site_description: '',
    rating: 1,
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT + `/${this.props.match.params.id}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((bookmark) =>
        this.setState({
          id: bookmark.id,
          title: bookmark.title,
          site_url: bookmark.site_url,
          site_description: bookmark.site_description,
          rating: bookmark.rating,
        }),
      );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // get the form fields from the event
    const { id, title, site_url, site_description, rating } = this.state;

    const updatedBookmark = {
      id,
      title,
      site_url,
      site_description,
      rating,
    };

    fetch(config.API_ENDPOINT + `/${this.props.match.params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedBookmark),
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (res.status !== 204) {
          return res.json().then((error) => Promise.reject(error));
        }
      })
      .then(() => this.context.updateBookmark(updatedBookmark))
      .then(() => this.props.history.push('/'))
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error } = this.state;
    return (
      <section className="AddBookmark">
        <h2>Create a bookmark</h2>
        <form className="AddBookmark__form" onSubmit={this.handleSubmit}>
          <div className="AddBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Great website!"
              required
              value={this.state.title}
              onChange={(e) => this.setState({ title: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
            </label>
            <input
              type="url"
              name="url"
              id="url"
              placeholder="https://www.great-website.com/"
              required
              value={this.state.site_url}
              onChange={(e) => this.setState({ site_url: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={this.state.site_description}
              onChange={(e) =>
                this.setState({ site_description: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              min="1"
              max="5"
              required
              value={this.state.rating}
              onChange={(e) => this.setState({ rating: e.target.value })}
            />
          </div>
          <div className="AddBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default AddBookmark;
