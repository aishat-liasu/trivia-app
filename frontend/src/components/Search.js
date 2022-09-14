import React, { Component } from 'react'
import '../stylesheets/Search.css'

class Search extends Component {
  state = {
    query: '',
  }

  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch(this.state.query)
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value.trim()
    })
  }

  render() {
    return (
      <form className='search-form'>
        <input
          placeholder="Search questions..."
          ref={input => this.search = input}
          onChange={this.handleInputChange}
          className='search-text'
          
        />
        <button className='button search-button' onClick={this.getInfo}><img src="search-icon.png" alt="Search Icon" /></button>
      </form>
    )
  }
}

export default Search
