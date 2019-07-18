import React, { Component } from 'react';
import './Translate.css';
import Header from '../components/Header/Header';
import Main from '../components/Main/Main';

class Translate extends Component {
  render() {
    const user: { admin: boolean } = { admin: true };
    return (
      <div className="Translate">
        Prueba
      </div>
    );
  }
}

export default Translate;
