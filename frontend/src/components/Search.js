import React, { Component } from 'react'
import '../stylesheets/Search.css'

class Search extends Component {
  state = {
    query: '',
  }

  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch(this.state.query)
    event.target.reset()
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value.trim()
    })
  }

  render() {
    return (
      <form onSubmit={this.getInfo} className='search-form'>
        <input
          placeholder="Search questions..."
          ref={input => this.search = input}
          onChange={this.handleInputChange}
          className='search-text'
          
        />
        <input type="submit" value="Search" className="button search-button"/>
      </form>
    )
  }
}

export default Search
