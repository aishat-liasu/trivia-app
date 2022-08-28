import React, { Component } from 'react';

import Header from '../components/Header';
import QuestionView from '../components/QuestionView';

class Home extends Component {


  render() {
    return (
        <>
            <title>List of Questions</title>
            <Header />
            <QuestionView/>
            
        </>
    );
  }
}

export default Home;
