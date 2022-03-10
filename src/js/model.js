import { async } from 'regenerator-runtime';
import { API_URL, API_Key } from './config';
import { GetJson, SendJson } from './helper';
import { ResPerPage } from './config';
// console.log(API_URL);

//state contains all the data for our application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    ResultsPerPage: ResPerPage,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  // console.log(recipe.id);
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingtime: recipe.cooking_time,
    Ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    // console.log(`${API_URL}/${id}`);
    const data = await GetJson(`${API_URL}${id}?key=${API_Key}`);
    state.recipe = createRecipeObject(data);
    // console.log(data);

    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log(state.recipe);
  } catch (err) {
    // console.error(`${err} boom`);
    throw err;
  }
};

//search fuctionality

export const loadSearchResults = async function (query) {
  try {
    const data = await GetJson(`${API_URL}?search=${query}&key=${API_Key}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results.slice(0, 10));
  } catch (err) {
    throw err;
  }
};
// loadSearchResults('pizza');
// console.log(state.search.ResultsPerPage);
//Pagination (10 elements in each page from 0--9)
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.ResultsPerPage; //0
  const end = page * state.search.ResultsPerPage; //9
  return state.search.results.slice(start, end); //slice method does not include the last value so 10 is fine
};
// console.log(state.recipe);

//Updating the servings
export const updateServings = function (newServings) {
  state.recipe.Ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //newqt = oldqt*newServing/oldServings
  });
  state.recipe.servings = newServings;
};
//storing the bookmarks arrya in the browser
const presistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  //adding the recipes to bookmark object
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //storing the bookmark
  presistBookmarks();
};
//removing the bookmark
export const deleteBookmark = function (id) {
  //removing recipes from the bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  //Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //storing the bookmark
  presistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
export const UploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const IngArr = ing[1].split(',').map(el => el.trim);

        // const IngArr = ing[1].replaceAll(' ', '').split(',');
        if (IngArr.length !== 3) throw new Error('Wrong Ingredient Format');
        const [quantity, unit, description] = IngArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    const Recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    console.log(Recipe);
    const data = await SendJson(`${API_URL}?key=${API_Key}`, Recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
