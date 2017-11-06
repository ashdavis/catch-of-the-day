import React, { Component } from 'react';
import firebase from 'firebase/app';
import PropTypes from 'prop-types';
import AddFishForm from './AddFishForm';
import { app } from '../rebase';

class Inventory extends Component {
  constructor() {
    super();
    this.state = {
      uid: undefined,
      owner: undefined,
      authenticating: true
    }
    this.authenticate = this.authenticate.bind(this);
    this.logOut = this.logOut.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.authHandler({user});
      } else {
        // User is signed out.
        this.setState({authenticating: false});
        return;
      }
    });
  }

  handleChange(key, event) {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [event.target.name]: event.target.value
    };
    this.props.updateFish(key, updatedFish);
  }

  handleClick(key, event) {
    this.props.removeFish(key);
  }

  authenticate(provider) {
    this.setState({authenticating: true});
    console.log(`Trying to log in with ${provider}`);
    const authProvider = new firebase.auth.GithubAuthProvider();
    app.auth().signInWithRedirect(authProvider)
      .catch((error) => {
        console.error(error);
      });
  }

  logOut() {
    app.auth().signOut().then(() => {
      // Return value is null
      this.setState({
        uid: undefined
      })
    })
    .catch((error) => {
      console.error(error);
    });
  }

  authHandler(authData) {
    // Grab the store info
    const storeRef = firebase.database().ref(this.props.storeId);

    // Query Firebase once for the store data
    storeRef.once('value')
      .then((snapshot) => {
        const data = snapshot.val() || {};

        // Claim store ownership if there isn't already an owner
        if (!data.owner) {
          storeRef.set({
            owner: authData.user.uid
          });
        }
        
        // Set the state locally
        this.setState({
          uid: authData.user.uid,
          owner: data.owner || authData.user.uid,
          authenticating: false
        });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button
          className="github"
          onClick={this.authenticate.bind(this, 'github')}>
          Log In with GitHub
        </button>
      </nav>
    );
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    console.log()
    return (
      <div key={key} className="fish-edit">
        <input
          type="text"
          name="name"
          value={fish.name}
          placeholder="Fish Name"
          onChange={this.handleChange.bind(this, key)} />
        <input
          type="text"
          name="price"
          value={fish.price}
          placeholder="Fish Price"
          onChange={this.handleChange.bind(this, key)} />
        <select
          type="text"
          name="status"
          value={fish.status}
          placeholder="Fish Status"
          onChange={this.handleChange.bind(this, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea
          type="text"
          name="description"
          value={fish.description}
          placeholder="Fish Description"
          onChange={this.handleChange.bind(this, key)}>
        </textarea>
        <input
          type="text"
          name="image"
          value={fish.image}
          placeholder="Fish Image"
          onChange={this.handleChange.bind(this, key)} />
        <button onClick={this.handleClick.bind(this, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    const logOutButton = <button onClick={this.logOut} style={{'marginBottom': '20px'}}>Log Out</button>;

    // // Check if we have a logged in user
    // if (!this.state.uid) {
    //   return <div>{this.renderLogin()}</div>;
    // }

    // Check if we have a logged in user
    if (!this.state.uid && !this.state.authenticating) {
      return <div>{this.renderLogin()}</div>;
    }

    // Check whether authentication is taking place
    if (!this.state.uid && this.state.authenticating) {
      return (
        <div>
          <h2>Inventory</h2>
          <p>Loading...</p>
        </div>
      );
    }

    // Check if the logged in user is the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <h2>Inventory</h2>
          {logOutButton}
          <p>Sorry, you aren't the owner of this store!</p>
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logOutButton}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples} style={{'marginBottom': '20px'}}>Load Sample Fishes</button>
        {
          Object
            .keys(this.props.fishes)
            .map(this.renderInventory)
        }
      </div>
    );
  }
}

Inventory.propTypes = {
  addFish: PropTypes.func.isRequired,
  fishes: PropTypes.object.isRequired,
  loadSamples: PropTypes.func.isRequired,
  removeFish: PropTypes.func.isRequired,
  updateFish: PropTypes.func.isRequired,
  storeId: PropTypes.string.isRequired
}

export default Inventory;
