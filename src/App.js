import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import styled from 'styled-components';
import RecipesPage from './RecipesPage';
import RecipePage from './RecipePage';
import AddPage from './AddPage';
import EditPage from './EditPage';

const Container = styled.div`
  padding: 5vw 10vw;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 50px;
  text-decoration: underline;
`;

const App = () => {
  return (
    <Container>
      <Title>Le Recipé Bük</Title>
      <Router>
        <Switch>
          <Route path='/recipes/:recipeId'>
            <RecipePage />
          </Route>
          <Route path='/recipes'>
            <RecipesPage />
          </Route>
          <Route path='/add'>
            <AddPage />
          </Route>
          <Route path='/edit/:recipeId'>
            <EditPage />
          </Route>
          <Route path='/'>
            <Redirect to='/recipes' />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;