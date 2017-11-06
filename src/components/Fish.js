import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';

class Fish extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const {index} = this.props;
    this.props.addToOrder(index);
  }

  render() {
    const {details} = this.props;
    const isAvailable = details.status === 'available';
    const buttonText = isAvailable ? 'Add to Order' : 'Sold Out!';
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{formatPrice(details.price)}</span>
        </h3>
        <p>{details.description}</p>
        <button onClick={this.handleClick} disabled={!isAvailable}>{buttonText}</button>
      </li>
    );
  }
}

Fish.propTypes = {
  addToOrder: PropTypes.func.isRequired,
  index: PropTypes.string,
  details: PropTypes.shape({
    description: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    status: PropTypes.string
  }).isRequired
}

export default Fish;
