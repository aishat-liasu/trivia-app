import React, { Component } from 'react';
import '../stylesheets/Popup.css';

class Popup extends Component {
    constructor(props){
        super(props);
        this.state = {
            close: false,
        }
        this.style = {
            display: 'block'
        }
    }

    closePopup() {
        this.setState({close: !this.state.close});
    }


  render() {
    const { message } = this.props;
    return (
        <section className="popup" style={!this.state.close ? this.style : {}}>
            <div className="popup-container">
            <button onClick={()=>this.closePopup()} className="close-btn">&#x1F5D9;</button>
            <h4>Alert!</h4>
            <p>{message}</p>
            </div>
   
      </section>
    );
  }
}

export default Popup;
