import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Button, Segment, Modal, Form } from 'semantic-ui-react';
import api from './api.js';

class EditPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {recipe: {}, categories: [], modalOpen: false, redirect: false};
  }

  componentDidMount() {
    this.getRecipes();
  }

  getRecipes = async() => {
    let res = await api.get('/recipe');
    let categories = [...new Set(res.data.map(recipe => recipe.category))].map((str,index) => ({key: index, text: str, value: str}));
    let recipe = res.data.find(r => r.id.toString() === this.props.match.params.recipeId);
    this.setState({ recipe, categories });
  }

  closeModal = () => this.setState({ modalOpen: false })

  changeName(e, { value }) {
  	let { recipe } = this.state;
  	recipe.name = value;
  	this.setState({ recipe });
  }

  changeCategory(e, { value }) {
  	let { recipe } = this.state;
  	recipe.category = value;
  	this.setState({ recipe });
  }

  addCategory(e, { value }) {
  	let { categories } = this.state;
  	categories.unshift({key: categories.length, text: value, value});
  	this.setState({ categories });
  }

  changeShortDesc(e, { value }) {
  	let { recipe } = this.state;
  	recipe.shortDesc = value;
  	this.setState({ recipe });
  }

  changeLongDesc(e, { value }) {
  	let { recipe } = this.state;
  	recipe.longDesc = value;
  	this.setState({ recipe });
  }

  render() {
  	const { recipe, categories, modalOpen, redirect } = this.state;

  	if (redirect)
  	  return <Redirect push to={`/recipes/${recipe.id}`} />;

  	return (
  	  <div>
	    <Segment>
	      <Form>
	      	<Form.Group>
	      	  <Form.Input label='Recipe name' placeholder='Recipe name' value={recipe.name} onChange={this.changeName.bind(this)} />
	      	  <Form.Select
	            search selection allowAdditions
              selectOnBlur={false}
	            label='Category'
	            placeholder='Category'
	            options={categories}
	            value={recipe.category}
	            onChange={this.changeCategory.bind(this)}
	            onAddItem={this.addCategory.bind(this)} />
	      	</Form.Group>
	      	<Form.TextArea
	      	  label='Short Description'
	      	  placeholder='Short description of the recipe'
	      	  value={recipe.shortDesc}
	      	  onChange={this.changeShortDesc.bind(this)} />
	      	<Form.TextArea
	      	  label='Recipe'
	      	  placeholder='How do you actually cook it?'
	      	  value={recipe.longDesc}
	      	  onChange={this.changeLongDesc.bind(this)} />
	      </Form>
	    </Segment>
	    <div>
	      <Button color='red' as={Link} to={`/recipes/${recipe.id}`}>Cancel</Button>
	      <Button color='green' onClick={this.saveChanges.bind(this)}>Save</Button>

	      <Modal size='mini' open={modalOpen}>
            <Modal.Header>Save failed</Modal.Header>
            <Modal.Content>
              <p>Sorry, all fields need to be filled.</p>
            </Modal.Content>
            <Modal.Actions>
              <Button
                content='Got it'
                onClick={this.closeModal}
              />
            </Modal.Actions>
          </Modal>
	    </div>
  	  </div>
  	);
  }

  saveChanges = async() => {
  	let { recipe } = this.state;
  	if (!recipe.name || !recipe.category || !recipe.shortDesc || !recipe.longDesc) {
  	  this.setState({ modalOpen: true });
  	} else {
      await api.put(`/recipe/${this.state.recipe.id}`, recipe);
      this.setState({redirect: true});
    }
  }
}

export default withRouter(EditPage);