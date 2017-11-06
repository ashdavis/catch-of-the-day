import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from '../helpers';
import { CSSTransition, TransitionGroup } from 'react-transition-group'

class Order extends Component {
  constructor() {
    super();
    this.renderOrder = this.renderOrder.bind(this);
  }

  handleClick(key, event) {
    this.props.removeFromOrder(key);
  }

  renderOrder(key) {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const removeButton = <button onClick={this.handleClick.bind(this, key)}>&times;</button>

    if (!fish || fish.status === 'unavailable') {
      return (
        <CSSTransition key={key} classNames="order" timeout={{ enter: 500, exit: 300 }}>
          <li key={key}>
            Sorry, {fish ? fish.name : 'fish'} is no longer available! {removeButton}
          </li>
        </CSSTransition>
      );
    }

    return (
      <CSSTransition key={key} classNames="order" timeout={{ enter: 500, exit: 300 }}>
      <li key={key}>
        <span>
          <TransitionGroup className="count" component="span">
            <CSSTransition key={count} classNames="count" timeout={250}>
              <span>{count}</span>
            </CSSTransition>
          </TransitionGroup>
          kg {fish.name} {removeButton}
        </span>
        <span className="price">{formatPrice(count * fish.price)}</span> 
      </li>
    </CSSTransition>
    );
  }

  render() {
    if (this.props.loading === true) {
      return (
        <div className="order-wrap">
        <h2>Your Order</h2>
      </div>
      )
    }

    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((previousTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];
      const isAvailable = fish && fish.status === 'available';
      if (isAvailable) {
        return previousTotal + (count * fish.price || 0);
      }
      return previousTotal;
    }, 0);
    return (
      <div className="order-wrap">
        <h2>Your Order</h2>
        <TransitionGroup className="order" component="ul">
          {orderIds.map(this.renderOrder)}
        </TransitionGroup>
        <ul className="order">
          <li className="total">
            <strong>Total:</strong>
            {formatPrice(total)}
          </li>
        </ul>
      </div>
    );
  }
}

Order.propTypes = {
  fishes: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  order: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  removeFromOrder: PropTypes.func.isRequired
}

export default Order;
