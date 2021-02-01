import { observer } from 'mobx-react';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { StoreProvider, trunk, getStoreFromMain } from './store';

import { SettingsView } from './views/Settings';
import { HomeView } from './views/Home';

import './style.css';

const AppWrapper = styled.div`
  overflow: hidden;
`;

const App = observer(() => {
  return (
    <AppWrapper>
      <Router>
        <Switch>
          <Route exact path="/settings">
            <SettingsView />
          </Route>
          <Route exact path="/">
            <HomeView />
          </Route>
        </Switch>
      </Router>
    </AppWrapper>
  );
});

getStoreFromMain().then((store) =>
  trunk.init(store).then(() => {
    ReactDOM.render(
      <StoreProvider>
        <App />
      </StoreProvider>,
      document.getElementById('app')
    );
  })
);
