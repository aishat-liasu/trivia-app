import React, { Component } from 'react';

import '../stylesheets/App.css';
import Question from './Question';
import Search from './Search';
import $ from 'jquery';
import Popup from './Popup';

class QuestionView extends Component {
  constructor(props){
    super(props);
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: {},
      currentCategory: null,
      openPopup: false,
      currentMessage: ''
    }
    this.BASE_URL = process.env.REACT_APP_API_URL + '/api/v1.0'
  }

  componentDidMount() {
    this.getQuestions();
  }

  getQuestions = () => {
    $.ajax({
      url: `${this.BASE_URL}/questions?page=${this.state.page}`,
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          categories: result.categories,
          currentCategory: result.current_category
        })
      },
      error: (error) => {
        this.setState({currentMessage: 'Unable to load questions. Please try your request again'})
        this.setState({openPopup: true})
      }
    })
  }

  selectPage(num) {
    this.setState({page: num}, () => this.getQuestions());
  }

  createPagination(){
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10)
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={() => {this.selectPage(i)}}>{i}
        </span>)
    }
    return pageNumbers;
  }

  getByCategory= (id) => {
    $.ajax({
      url: `${this.BASE_URL}/categories/${id}/questions`, 
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        })
      },
      error: (error) => {
        this.setState({currentMessage: 'Unable to load questions. Please try your request again'})
        this.setState({openPopup: true})
      }
    })
  }

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `${this.BASE_URL}/questions`, 
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({searchTerm: searchTerm}),
      crossDomain: true,
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: result.current_category
        })
      },
      error: (error) => {
        this.setState({currentMessage: 'Unable to load questions. Please try your request again'})
        this.setState({openPopup: true})
      }
    })
  }

  questionAction = (id) => (action) => {
    if(action === 'DELETE') {
      if(window.confirm('are you sure you want to delete the question?')) {
        $.ajax({
          url: `${this.BASE_URL}/questions/${id}`,
          type: "DELETE",
          success: (result) => {
            this.getQuestions();
          },
          error: (error) => {
            this.setState({currentMessage: 'Unable to delete question. Please try your request again'})
            this.setState({openPopup: true})
          }
        })
      }
    }
  }

  render() {
    return (
      <div className="question-view">
        <section className="sidebar">
          <Search submitSearch={this.submitSearch}/>
          <h3>Filter questions by categories</h3>
          <ul className='categories-list'>
            {Object.keys(this.state.categories).map((id, ) => (
              <li key={id} onClick={() => {this.getByCategory(id)}} className='category-item'> 
                <img className="category" src={`${this.state.categories[id].toLowerCase()}.svg`} alt={this.state.categories[id].toLowerCase()} />
                <span>{this.state.categories[id]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="questions-list">
          <h3>Questions</h3>
          {this.state.questions.map((q, ind) => (
            <Question
              key={q.id}
              question={q.question}
              answer={q.answer}
              category={this.state.categories[q.category]}
              difficulty={q.difficulty}
              questionAction={this.questionAction(q.id)}
            />
          ))}
          <div className="pagination-menu">
            {this.createPagination()}
          </div>
        </section>

        {this.state.openPopup && <Popup message={this.state.currentMessage} />}

      </div>
    );
  }
}

export default QuestionView;
