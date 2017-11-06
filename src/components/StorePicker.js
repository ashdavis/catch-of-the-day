import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFunName } from '../helpers';

class StorePicker extends Component {
  handleSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // grab the text from the input
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);

    // transition from / to /store/:storeId
    this.props.history.push(`store/${storeId}`);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={(e) => this.handleSubmit(e)}>
        <h2>Please Enter a Store</h2>
        <input
          type="text"
          placeholder="Store Name"
          defaultValue={getFunName()}
          ref={(input) => {this.storeInput = input}}
          required />
        <button type="submit">Visit Store -></button>
      </form>
    );
  }
}

StorePicker.propTypes = {
  history: PropTypes.object.isRequired
}

export default StorePicker;
