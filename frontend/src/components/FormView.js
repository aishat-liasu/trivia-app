import React, { Component } from 'react';
import $ from 'jquery';

import '../stylesheets/FormView.css';
import Popup from './Popup';

class FormView extends Component {
  constructor(props){
    super(props);
    this.state = {
      question: "",
      answer: "",
      difficulty: 1,
      category: 1,
      categories: {},
      openPopup: false,
      currentMessage: ''
    }
    this.BASE_URL = process.env.REACT_APP_API_URL + '/api/v1.0'
  }

  componentDidMount(){
    $.ajax({
      url: `${this.BASE_URL}/categories`, 
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.categories })
      },
      error: (error) => {
        this.setState({currentMessage: 'Unable to load categories. Please try to reload the page'})
        this.setState({openPopup: true})
      }
    })
  }


  submitQuestion = (event) => {
    event.preventDefault();
    $.ajax({
      url: `${this.BASE_URL}/questions`, 
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
        difficulty: this.state.difficulty,
        category: this.state.category
      }),
      crossDomain: true,
      success: (result) => {
        document.getElementById("add-question-form").reset();
      },
      error: (error) => {
        this.setState({currentMessage: 'Unable to add question. Please try your request again'})
        this.setState({openPopup: true})
      }
    })
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <section className="add-page">
        <h3>Add a New Trivia Question</h3>
        <form className="add-question-form" id="add-question-form" onSubmit={this.submitQuestion}>
          <label>
            <span>Question</span>
            <input type="text" name="question" onChange={this.handleChange}/>
          </label>
          <label>
            <span>Answer</span> 
            <input type="text" name="answer" onChange={this.handleChange}/>
          </label>
          <label>
            <span>Difficulty</span>
            <select name="difficulty" onChange={this.handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select name="category" onChange={this.handleChange}>
              {Object.keys(this.state.categories).map(id => {
                  return (
                    <option key={id} value={id}>{this.state.categories[id]}</option>
                  )
                })}
            </select>
          </label>
          <input type="submit" className="button" value="Submit" />
        </form>
        
        {this.state.openPopup && <Popup message={this.state.currentMessage} />}
      </section>
    );
  }
}

export default FormView;
