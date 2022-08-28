import React, { Component } from 'react';

import Header from '../components/Header';
import FormView from '../components/FormView';

class AddQuestion extends Component {


  render() {
    return (
        <>
            <title>Add New Question</title>
            <Header />
            <FormView/>
            
        </>
    );
  }
}

export default AddQuestion;
