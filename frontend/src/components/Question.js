import React, { Component } from 'react';
import '../stylesheets/Question.css';

class Question extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleAnswer: false
    }
  }

  flipVisibility() {
    this.setState({visibleAnswer: !this.state.visibleAnswer});
  }

  render() {
    const { question, answer, category, difficulty } = this.props;
    return (
      <div className="question-holder">
        <div className="question">{question}</div>
        <div className="question-status">
          <img className="category" src={`${category.toLowerCase()}.svg`} alt={ category.toLowerCase()} />
          <div className="difficulty">Difficulty: {difficulty}</div>
          <img src="delete.png" className="delete" onClick={() => this.props.questionAction('DELETE')}  alt='Delete icon'/>
          
        </div>
        <button className="show-answer button"
            onClick={() => this.flipVisibility()}>
            {this.state.visibleAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
        <p className="answer-holder">
          <span style={{"visibility": this.state.visibleAnswer ? 'visible' : 'hidden'}}>{answer}</span>
        </p>
      </div>
    );
  }
}

export default Question;
