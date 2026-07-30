import React from 'react';
import { Provider } from 'react-redux';
import MainContainer from './src/MainContainer';
import Store from './src/Redux/Store/Store';
import { ThemeProvider } from './src/ThemeContext';

const App = () => {
  return (
    <Provider store={Store}>
      <ThemeProvider>
        <MainContainer />
      </ThemeProvider>
    </Provider>
  );
};

export default App;











