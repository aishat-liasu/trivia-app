import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';


import '../stylesheets/Header.css';


class Header extends Component {

  activeStyle =  {
    backgroundColor: '#5D599B',
    borderRadius: '5px',
    color: '#fff'
  }


  render() {
    return (
      <header className="header">
        <nav className='header-nav'>
        <h2>Udacitrivia</h2>
          <ul>
            <li><NavLink to='/' exact activeStyle={this.activeStyle}
               >List</NavLink></li>
            <li><NavLink to='/add' activeStyle={this.activeStyle}
            >Add</NavLink></li>
            <li><NavLink to='/play' activeStyle={this.activeStyle}>Play</NavLink></li>

          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
