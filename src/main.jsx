import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { makeStore } from './store';
import App from './App';
import './styles/index.css';

// The page arrives pre-rendered (see build.mjs); React attaches to that HTML instead of re-creating it.
const store = makeStore();
hydrateRoot(
  document.getElementById('root'),
  <Provider store={store}>
    <App />
  </Provider>,
);
