import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mount = (el) => {
  const root = ReactDOM.createRoot(el);
  root.render(<App />);
  return root;
};

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#root');
  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };