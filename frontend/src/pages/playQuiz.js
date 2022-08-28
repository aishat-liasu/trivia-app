import React, { Component } from 'react';

import Header from '../components/Header';
import QuizView from '../components/QuizView';

class PlayQuiz extends Component {


  render() {
    return (
        <>
            <title>List of Questions</title>
            <Header />
            <QuizView/>
            
        </>
    );
  }
}

export default PlayQuiz;
