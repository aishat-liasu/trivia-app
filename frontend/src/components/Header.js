import React, { Component } from 'react';
import logo from '../logo.svg';
import '../stylesheets/Header.css';

class Header extends Component {

  navTo(uri){
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <header className="header">
        <nav className='header-nav'>
        <h2 onClick={() => { this.navTo('') }}>Udacitrivia</h2>
          <ul>
            <li onClick={() => {this.navTo('')}}>List</li>
            <li onClick={() => { this.navTo('/add') }}>Add</li>
            <li onClick={() => { this.navTo('/play') }}>Play</li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
