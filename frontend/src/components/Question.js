import React, { Component } from 'react';
import '../stylesheets/Question.css';

class Question extends Component {
  constructor(props){
    super(props);
    this.state = {
      visibleAnswer: false
    }
  }



  render() {
    const { question, answer, category, difficulty } = this.props;
    return (
      <article className="question-holder">
        <h4 className="question">{question}</h4>
        <div className="question-status">
          <img className="category" src={`${category.toLowerCase()}.svg`} alt={ category.toLowerCase()} />
          <span className="difficulty">Difficulty: {difficulty}</span>
          <img src="delete.png" className="delete" onClick={() => this.props.questionAction('DELETE')}  alt='Delete icon'/>   
        </div>

        <details className='answer-details'>
          <summary>Answer</summary>
          <p>{answer}</p>
        </details>
      </article>
    );
  }
}

export default Question;
