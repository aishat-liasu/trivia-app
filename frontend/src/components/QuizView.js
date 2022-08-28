import React, { Component } from 'react';
import $ from 'jquery';

import '../stylesheets/QuizView.css';

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props){
    super(props);
    this.state = {
        quizCategory: null,
        previousQuestions: [],
        showAnswer: false,
        categories: {},
        numCorrect: 0,
        currentQuestion: {},
        guess: '',
        forceEnd: false
    }
    this.BASE_URL = '/api/v1.0'
  }

  componentDidMount(){
    $.ajax({
      url: `${this.BASE_URL}/categories`,
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.categories })
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
      }
    })
  }

  selectCategory = ({type, id=0}) => {
    this.setState({quizCategory: {type, id}}, this.getNextQuestion)
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  getNextQuestion = () => {
    const previousQuestions = [...this.state.previousQuestions]
    if(this.state.currentQuestion.id) { previousQuestions.push(this.state.currentQuestion.id) }

    $.ajax({
      url: `${this.BASE_URL}/quizzes`, 
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: this.state.quizCategory
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          showAnswer: false,
          previousQuestions: previousQuestions,
          currentQuestion: result.question,
          guess: '',
          forceEnd: result.question ? false : true
        })
      },
      error: (error) => {
        alert('Unable to load question. Please try your request again')
      }
    })
  }

  submitGuess = (event) => {
    event.preventDefault();
    const evaluate =  this.evaluateAnswer()
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    })
  }

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    })
  }

  renderPrePlay(){
      return (
          <div className="quiz-play-holder">
              <h3 className="choose-header">Choose Category</h3>
              <ul className="category-list">
                  <li className="category" onClick={this.selectCategory}>ALL</li>
                  {Object.keys(this.state.categories).map(id => {
                  return (
                    <li
                      key={id}
                      value={id}
                      className="category"
                      onClick={() => this.selectCategory({type:this.state.categories[id], id})}>
                      {this.state.categories[id]}
                    </li>
                  )
                })}
              </ul>
          </div>
      )
  }

  renderFinalScore(){
    return(
      <div className="quiz-play-holder">
        <h3 className="final-header"> You got {this.state.numCorrect}</h3>
        <button className="play-again button" onClick={this.restartGame}> Play Again? </button>
      </div>
    )
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()
    const answerArray = this.state.currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.every(el => formatGuess.includes(el));
  }

  renderCorrectAnswer(){
    const evaluate =  this.evaluateAnswer()
    return(
      <div className="quiz-play-holder">
        <h3 className="quiz-question">{this.state.currentQuestion.question}</h3>
        <p className={`${evaluate ? 'correct' : 'wrong'}`}>{evaluate ? "You were correct!" : "You were incorrect"}</p>
        <p className="quiz-answer">{this.state.currentQuestion.answer}</p>
        <button className="next-question button" onClick={this.getNextQuestion}> Next Question </button>
      </div>
    )
  }

  renderPlay(){
    return this.state.previousQuestions.length === questionsPerPlay || this.state.forceEnd
      ? this.renderFinalScore()
      : this.state.showAnswer
        ? this.renderCorrectAnswer()
        : (
          <div className="quiz-play-holder">
            <h3 className="quiz-question">{this.state.currentQuestion.question}</h3>
            <form onSubmit={this.submitGuess}>
              <input type="text" name="guess" onChange={this.handleChange}/>
              <input className="submit-guess button" type="submit" value="Submit Answer" />
            </form>
          </div>
        )
  }


  render() {
    return this.state.quizCategory
        ? this.renderPlay()
        : this.renderPrePlay()
  }
}

export default QuizView;
