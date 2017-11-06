import React, { Component } from 'react';
import PropTypes from 'prop-types';

const emptyFishForm = {
  name: '',
  price: '',
  status: 'available',
  description: '',
  image: ''
}

class AddFishForm extends Component {
  constructor() {
    super();
    this.state = {
      fish: {...emptyFishForm}
    }
    this.createFish = this.createFish.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  createFish(event) {
    event.preventDefault();
    console.log('Gonna make some fish!');
    this.props.addFish(this.state.fish);
    this.setState({
      fish: {...emptyFishForm}
    });
  }

  handleChange(event) {
    const fish = this.state.fish;
    const name = event.target.name;
    const value = event.target.value;
    fish[name] = value;
    this.setState({fish});
  }

  render() {
    return (
      <form className="fish-edit" onSubmit={this.createFish}>
        <input
          name="name"
          type="text"
          placeholder="Fish Name"
          value={this.state.fish.name}
          onChange={this.handleChange} />
        <input
          name="price"
          type="text"
          placeholder="Fish Price"
          value={this.state.fish.price}
          onChange={this.handleChange} />
        <select
          name="status"
          value={this.state.fish.status}
          onChange={this.handleChange}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea
          name="description"
          type="text"
          placeholder="Fish Description"
          value={this.state.fish.description}
          onChange={this.handleChange}>
        </textarea>
        <input
          name="image"
          type="text"
          placeholder="Fish Images"
          value={this.state.fish.image}
          onChange={this.handleChange} />
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
}

AddFishForm.propTypes = {
  addFish: PropTypes.func.isRequired
}

export default AddFishForm;
