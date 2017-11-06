// Dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Styles
import './assets/styles/style.css';

// Components
import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';

// Service Worker
import registerServiceWorker from './registerServiceWorker';

const Root = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={StorePicker} />
          <Route path="/store/:storeId" component={App} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(<Root />, document.getElementById('main'));

registerServiceWorker();
