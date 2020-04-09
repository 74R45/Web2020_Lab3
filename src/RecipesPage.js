import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Input, Menu, Item, Button, Modal } from 'semantic-ui-react';
import api from './api.js';

class RecipePreviewContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {deleteModalOpen: false, toDelete: -1};
  }

  showModal = (id) => this.setState({ deleteModalOpen: true, toDelete: id })
  closeModal = () => this.setState({ deleteModalOpen: false })

  deleteRecipe = async() => {
    await api.delete(`/recipe/${this.state.toDelete}`);
    window.location.reload();
  }

  render() {
    let { deleteModalOpen } = this.state;

    return (
      <Item.Group divided>
        {this.props.recipes.map((item) => (
          <Item key={item.id}>
            <Item.Image src={require('./images/default.jpg')} as={Link} to={`/recipes/${item.id}`} />
            <Item.Content>
              <Item.Header as={Link} to={`/recipes/${item.id}`}>{item.name}</Item.Header>
              <Item.Meta>{item.category}</Item.Meta>
              <Item.Description>{item.shortDesc}</Item.Description>
              <Item.Extra>
                {item.createDate}
                <Button floated='right' color='red' onClick={() => {return this.showModal(item.id)}}>Delete</Button>
                <Button floated='right' color='olive' as={Link} to={`/edit/${item.id}`}>Edit</Button>
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
        <Modal size='mini' open={deleteModalOpen}>
          <Modal.Header>Delete This Recipe</Modal.Header>
          <Modal.Content>
            <p>Are you sure you want to delete this recipe?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.closeModal.bind(this)}>No</Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content='Yes'
              onClick={this.deleteRecipe}
            />
          </Modal.Actions>
        </Modal>
      </Item.Group>
    );
  }
}

const sortingOptions = [
  { key: 0, text:'Sort by Newest First', content: 'Newest First', value: 0 },
  { key: 1, text:'Sort by Oldest First', content: 'Oldest First', value: 1 }
];


class RecipesPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {allRecipes: [], recipes: [], categories: [], categoryFilter: el => true, nameFilter: el => true};
  }

  componentDidMount() {
    this.getRecipes();
  }

  getRecipes = async() => {
    let res = await api.get('/recipe');
    let categories = [...new Set(res.data.map(recipe => recipe.category))];
    this.setState({allRecipes: res.data, recipes: res.data, categories});
    let sorting = localStorage.getItem('sortingOption');
    this.sortItems({}, { value: ((sorting === null) ? 0 : parseInt(sorting)) });
  }

  changeCategoryFilter(e, { value }) {
    if (value === '') {
      this.setState({ categoryFilter: el => true }, this.applyFilters);
    } else {
      this.setState({ categoryFilter: rec => rec.category === value }, this.applyFilters);
    }
  }

  changeNameFilter(e, { value }) {
    this.setState({ nameFilter: rec => searchName(rec.name, value) }, this.applyFilters);
  }

  applyFilters() {
    this.setState({ recipes: this.state.allRecipes.filter(this.state.categoryFilter).filter(this.state.nameFilter) });
  }

  sortItems(e, { value }) {
    this.setState({ recipes: this.state.recipes.sort((r1, r2) => 
      ((Date.parse(r1.createDate) > Date.parse(r2.createDate)) - 0.5)*(value - 0.5)) });
    localStorage.setItem('sortingOption', value);
  }

  render() {
    let { recipes, categories } = this.state;
    let sorting = localStorage.getItem('sortingOption');

    return (
    	<Fragment>
    	  <Menu>
          <Menu.Item>
    	  	  <Dropdown placeholder='Category' search selection clearable
              selectOnBlur={false}
              options={categories.map((str,index) => ({key: index, text: str, value: str}))}
              onChange={this.changeCategoryFilter.bind(this)} />
          </Menu.Item>
          <Menu.Item>
    	  	  <Input icon='search' placeholder='Search...'
              onChange={this.changeNameFilter.bind(this)} />
          </Menu.Item>
          <Menu.Item>
            <Dropdown options={sortingOptions} selection
              defaultValue={sortingOptions[(sorting === null) ? 0 : parseInt(sorting)].value}
              onChange={this.sortItems.bind(this)} />
          </Menu.Item>
          <Menu.Item position='right'>
            <Button icon='plus' labelPosition='left' color='green' as={Link} to='/add' content='Add recipe' />
          </Menu.Item>
    	  </Menu>
        <RecipePreviewContainer recipes={recipes} />
    	</Fragment>
    );
  }
}

function searchName(name, query) {
  return !query || name.toLowerCase().includes(query.toLowerCase());
}

export default RecipesPage;