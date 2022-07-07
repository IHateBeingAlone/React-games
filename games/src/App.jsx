import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Wrapper } from './components/Wrapper';
import './style.css';

export default function App() {

  return (
      <div className="games">
          <BrowserRouter>
              <Wrapper/>
          </BrowserRouter>
      </div>
  );
}
