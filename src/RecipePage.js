import React, { Component } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';
import { Button, Icon, Segment, Image, Header, Modal } from 'semantic-ui-react';
import api from './api.js';

class RecipePage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {recipe: {}, deleteModalOpen: false, redirect: false};
  }

  componentDidMount() {
    this.getRecipe();
  }

  getRecipe = async() => {
    let res = await api.get(`/recipe/${this.props.match.params.recipeId}`);
    this.setState({ recipe: res.data });
  }

  showModal = () => this.setState({ deleteModalOpen: true })
  closeModal = () => this.setState({ deleteModalOpen: false })

  render() {
  	let { recipe, deleteModalOpen, redirect} = this.state;

  	if (redirect)
  	  return <Redirect push to='/recipes' />;

  	return (
  	  <div>
  	    <Button icon labelPosition='left' color='black' as={Link} to='/recipes'>
	        <Icon name='angle left' />
	        Back
	      </Button>
	      <Segment compact style={{width:'100%'}}>
	        <Image src={require('./images/default.jpg')} size='large' floated='left' />
	        <Header as='h1'>
	        	{recipe.name}
	        	<Header.Subheader>{recipe.createDate}</Header.Subheader>
	        </Header>
	        <p>{recipe.longDesc}</p>
	      </Segment>
	      <div>
	        <Button color='olive' as={Link} to={`/edit/${recipe.id}`}>Edit recipe</Button>
	        <Button color='red' onClick={this.showModal.bind(this)}>Delete recipe</Button>
  
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
                onClick={this.deleteThisRecipe}
              />
            </Modal.Actions>
          </Modal>
	      </div>
  	  </div>
  	);
  }

  deleteThisRecipe = async() => {
    await api.delete(`/recipe/${this.state.recipe.id}`);
    this.setState({redirect: true});
  }
}

export default withRouter(RecipePage);