import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/RecipeView.js';
import SearchView from './views/SearchView.js';
import ResultsView from './views/ResultsView.js';
import bookmarkView from './views/BookmarkView.js';
import AddRecipeView from './views/AddRecipeView.js';
import { closingTimmer } from './config.js';
// console.log(icons);
import searchView from './views/SearchView.js';
import PaginationView from './views/PaginationView.js';
let GoToPage = 1;
// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const ControlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //Updating t6he result view to mark selected search result
    ResultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookmarks);
    //loading recipe

    await model.loadRecipe(id);
    // const { recipe } = model.state;
    // console.log(model.state.recipe);
    //rendering recipe
    recipeView.render(model.state.recipe);
    //TEST
    // controlServings();
  } catch (err) {
    recipeView.renderError();

    console.log(err);
  }
};
// ControlRecipe();
const ControlSearch = async function () {
  try {
    //render Spinner
    ResultsView.renderSpinner();
    //Get Search Query
    const query = SearchView.getQuery();
    if (!query) return;
    //Fetching data
    await model.loadSearchResults(query);
    //Rendering Search Results
    // console.log(model.getSearchResultsPage));
    ResultsView.render(model.getSearchResultsPage());

    GoToPage = 1;
    //rendering the initial pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const ControlPagination = function (goToPage) {
  GoToPage = goToPage;
  // console.log(goToPage);
  //Rendering Search Results
  //Rendering New Results
  ResultsView.render(model.getSearchResultsPage(GoToPage));
  //rendering the NEW pagination buttons
  PaginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
// ControlSearch();
//not good when we need to listen for much more events
// window.addEventListener('hashchange', ControlRecipe);
// window.addEventListener('load', ControlRecipe);
const ControlBookmark = function () {
  //add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
};
const ControlBookmark2 = function () {
  bookmarkView.render(model.state.bookmarks);
};
const ControlAddRecipe = async function (newRecipe) {
  try {
    //loading spinner
    AddRecipeView.renderSpinner();
    await model.UploadRecipe(newRecipe);
    // console.log(newRecipe);
    console.log(model.state.recipe);
    //Render Recipe in the RecipeView
    recipeView.render(model.state.recipe);
    //success message
    AddRecipeView.renderMessage();
    //render the bookmark view
    bookmarkView.render(model.state.bookmarks);
    //Change id in the URL
    //using the history api of the browser
    //state,title,URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form
    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, closingTimmer);
  } catch (err) {
    console.error(err);
    AddRecipeView.renderError('Wrong Format');
  }
};
//solution
//Publisher--Subscriber Pattern
const init = function () {
  bookmarkView.addHandlerRender(ControlBookmark2);
  recipeView.addhandlerRender(ControlRecipe);
  searchView.addHandlerSearch(ControlSearch);
  PaginationView.addhandlerClick(ControlPagination);
  recipeView.addhandlerUpdateServings(controlServings);
  recipeView.addhandlerBookmark(ControlBookmark);
  AddRecipeView._addHandlerUpload(ControlAddRecipe);
};
init();
