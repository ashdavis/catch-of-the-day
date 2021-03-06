import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import sampleFishes from '../sample-fishes';
import {base} from '../rebase';

class App extends Component {
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {},
      loading: true,
      authenticating: true
    };
    this.addFish = this.addFish.bind(this);
    this.updateFish = this.updateFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.startAuthenticating = this.startAuthenticating.bind(this);
    this.stopAuthenticating = this.stopAuthenticating.bind(this);
  }

  addFish(fish) {
    const fishes = {...this.state.fishes};
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({fishes});
  }

  updateFish(key, updatedFish) {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({fishes});
  }

  removeFish(key) {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({fishes});
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    })
  }

  addToOrder(key) {
    // make a copy of the state
    const order = {...this.state.order};

    // update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;

    // update the state
    this.setState({order});
  }

  removeFromOrder(key) {
    const order = {...this.state.order};
    delete order[key];
    this.setState({order});
  }

  startAuthenticating() {
    this.setState({authenticating: true});
  }

  stopAuthenticating() {
    this.setState({authenticating: false});
  }

  // Runs right before the <App> is rendered
  componentWillMount() {
    const storeId = this.props.match.params.storeId;

    // Sync fishes state with Firebase database
    this.ref = base.syncState(`${storeId}/fishes`, {
      context: this,
      state: 'fishes',
      then: () => {
        this.setState({
          loading: false
        });
      }
    })

    // Check whether there is an order in localStorage
    const localStorageOrder = localStorage.getItem(`order-${storeId}`);
    if (localStorageOrder) {
      // Update the App component's order state
      this.setState({
        order: JSON.parse(localStorageOrder)
      });
    }
  }

  // Probably not needed as listeners are automatically cleaned up when component unmounts
  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    const storeId = this.props.match.params.storeId;
    localStorage.setItem(`order-${storeId}`, JSON.stringify(nextState.order));
  }

  render() {
    const storeId = this.props.match.params.storeId;
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div> 
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.match.params}
          loading={this.state.loading}
          removeFromOrder={this.removeFromOrder} />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          updateFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          storeId={storeId} />
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.object,
    path: PropTypes.string,
    url: PropTypes.string
  }).isRequired
}

export default App;
