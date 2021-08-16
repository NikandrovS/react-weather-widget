import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import './styles.css'

const el = document.getElementsByTagName('weather-widget')[0];
if (el) ReactDOM.render(<Counter />, el);
