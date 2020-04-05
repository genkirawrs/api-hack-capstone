function formatFetchUrl(searchType){
    const apiKey = '9973533';
    const url = 'https://www.themealdb.com/api/json/v2/';
    const urlPaths = {
        recent: '/latest.php',
        by_name: '/search.php?s=',
        by_id: '/lookup.php?i=',
        random: '/random.php',
        type_list: '/list.php?c=list',
        type: '/filter.php?c=',
        ingredients: '/filter.php?i='
    }
    return `${url}${apiKey}${urlPaths[searchType]}`;
}

//these functions will format search parameters and then pass it along to the contact function
function getRecentRecipes(qty=9){
    //retrieves specified number of most recent recipes, default 9
    let url = formatFetchUrl('recent');
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        //console.log(responseJson.meals);
        if(responseJson.meals.length > 0){
            let count = 0;
            let meals = responseJson.meals;
            while(count < qty){
                $('#recipes-list').append(`
                <div class="recipe-grid-square" id="recipe-${meals[count]['idMeal']}">
                    <a href="javascript:loadFullRecipe(${meals[count]['idMeal']})">
                    <img src="${meals[count]['strMealThumb']}" alt="Image of ${meals[count]['strMeal']}" title="${meals[count]['strMeal']}" class="recipe-grid-img">
                    <br>
                    ${meals[count]['strMeal']}   
                    </a>
                </div>
                `);
                count++;
            }
        }
    })
    .catch(error => {
        console.log(error);
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });
}

function searchByRecipeID(recipeID){
    //retrieve recipe by ID
    let url = formatFetchUrl('by_id');
        url = `${url}${recipeID}`;

    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        let mealDetails = formatRecipeDetails(responseJson.meals[0]);
        let recipeHTML = formatRecipeDisplay(mealDetails);
console.log(mealDetails);
        $('#full-recipe').html(recipeHTML);
        $('#recipes-list').hide()
        $('#simple-search-form').hide();
        $('#full-recipe').show();
        $('#search-progress').html('<a href="javascript:backToSearchResults()"><< Back to Search Results</a>');
        getYouTubeVideos(mealDetails.name);
    })
    .catch(error => {
        console.log("recipe id error!");
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });

}

function getRandomRecipe(){
    //retrieve a random recipe
    let url = formatFetchUrl('random');
        
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        let mealDetails = formatRecipeDetails(responseJson.meals[0]);
        let recipeHTML = formatRecipeDisplay(mealDetails);

        $('#random-result').html(recipeHTML);
        getYouTubeVideos(mealDetails.name);

    })
    .catch(error => {
        console.log("error!");
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });

}

function getRecipeTypeList(){
    //retrieve list of recipe categories
    let url = formatFetchUrl('type_list');
        
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        console.log(responseJson);
    })
    .catch(error => {
        console.log("error!");
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });

}

function getRecipeType(type){
    //retrieve recipes within a category
    let url = formatFetchUrl('type');
        url = `${url}${type}`;
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        console.log(responseJson);
    })
    .catch(error => {
        console.log("error!");
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });

}

function searchRecipe(phrase,qty){
    //retrieve a recipes by search terms
    let url = formatFetchUrl('by_name');
        url = `${url}${phrase}`;
        console.log(url);
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        if(responseJson.meals.length > 0){
            $('#recipes-list').html("");
            $('#search-progress').text('Your Search Results:');
            let count = 0;
            let meals = responseJson.meals;
            while(count < qty){
                if( count >= responseJson.meals.length){
                    break;
                }
                $('#recipes-list').append(`
                <div class="recipe-grid-square" id="recipe-${meals[count]['idMeal']}">
                    <a href="javascript:loadFullRecipe(${meals[count]['idMeal']})">
                    <img src="${meals[count]['strMealThumb']}" alt="Image of ${meals[count]['strMeal']}" title="${meals[count]['strMeal']}" class="recipe-grid-img">
                    <br>
                    ${meals[count]['strMeal']}   
                    </a>
                </div>
                `);
                count++;
            }

            if(count < qty){
                searchByIngredients(phrase,qty,count);
            }
        }

    })
    .catch(error => {
        searchByIngredients(phrase,qty);
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });
    
}

function searchByIngredients(ingredients,qty,searchFiller=0){
    //retrieve recipe based on ingredients
    let url = formatFetchUrl('ingredients');
        url = `${url}${ingredients}`;
    
    fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        throw new Error('hm');
    })
    .then(responseJson => {
        if(searchFiller){
            let count = searchFiller;
            let meals = responseJson.meals;
            while(count < qty){
                if( count >= responseJson.meals.length){
                    break;
                }
                $('#search-progress').text('Your Search Results:');
                $('#recipes-list').append(`
                <div class="recipe-grid-square" id="recipe-${meals[count]['idMeal']}">
                    <a href="javascript:loadFullRecipe(${meals[count]['idMeal']})">
                    <img src="${meals[count]['strMealThumb']}" alt="Image of ${meals[count]['strMeal']}" title="${meals[count]['strMeal']}" class="recipe-grid-img">
                    <br>
                    ${meals[count]['strMeal']}   
                    </a>
                </div>
                `);
                count++;
            }

        }else{
            $('#recipes-list').html("");
            let count = 0;
            let meals = responseJson.meals;
            while(count < qty){
                if( count >= responseJson.meals.length){
                    break;
                }
                $('#recipes-list').append(`
                <div class="recipe-grid-square" id="recipe-${meals[count]['idMeal']}">
                    <a href="javascript:loadFullRecipe(${meals[count]['idMeal']})">
                    <img src="${meals[count]['strMealThumb']}" alt="Image of ${meals[count]['strMeal']}" title="${meals[count]['strMeal']}" class="recipe-grid-img">
                    <br>
                    ${meals[count]['strMeal']}   
                    </a>
                </div>
                `);
                count++;
            }
        }
    })
    .catch(error => {
        $('#search-progress').text(`Sorry, no recipes found. Please try another search!`);
    });
}


//functions that format input/returned values
function formatRecipeSearch(parameters,type){
    const paramString = parameters.split(' ').join(',');
    return paramString;
}

function formatRecipeDetails(recipe){
    //receives an object and returns something we can use for display
    let meal = {
        id: recipe.idMeal,
        name: recipe.strMeal,
        img: recipe.strMealThumb,
        ingredients: [],
        instructions: [],
        video: recipe.strYoutube.split("v=").pop()
    };

    let ingredientsList = [];
    let mealInstructions = recipe.strInstructions;


    for (let key of Object.keys(recipe)) {
        if (key.startsWith('strIngredient') && recipe[key].length > 0) {
            let lineItem = key.split("Ingredient").pop();
            let measurement = `strMeasure${lineItem}`;
            let ingredientLine = `${recipe[key]} - ${recipe[measurement]}`;
            
            ingredientsList.push(ingredientLine);
        }
      }

    meal.ingredients = ingredientsList;
    meal.instructions = mealInstructions.replace(/(\r\n|\r|\n)(\r\n|\r|\n)/g, "LINEBREAK").split('LINEBREAK');

      return meal;
}

function backToSearchResults() {
    $('#recipes-list').show()
    $('#simple-search-form').show();
    $('#full-recipe').hide();
    $('#search-progress').html('');

}

function loadFullRecipe(mealId){
    searchByRecipeID(mealId);
}

function formatRecipeDisplay(mealDetails){
    let ingredientsHTML = ""
    $.each(mealDetails.ingredients, function(){
        let list = this;
        ingredientsHTML = `${ingredientsHTML}<li>${list}</li>`;
    });

    let instructionsHTML = "";
    $.each(mealDetails.instructions, function(){
        let list = this;
        instructionsHTML = `${instructionsHTML}<li>${list}</li>`;
    });

    let returnHTML = `
    <div style="position:relative;width:90%;">
    <div style="float:right;width:35%;">
    <img src="${mealDetails.img}" width="90%">
    <br>
    <a href="printable.html?recipe=${mealDetails.id}" alt="Open new page to print recipe" target="_blank">print recipe link</a>
    <br>
    <a href="printable.html?grocery=${mealDetails.id}" alt="Open new page to print recipe shopping list" target="_blank">grocery list link</a>
    </div>
    ${mealDetails.name}
    <br><br>

    Ingredients:<br>
    <ul>${ingredientsHTML}</ul>
    <br><br>
    Instructions:<br>
    <ul>${instructionsHTML}</ul>
    <br><br>
    More on this recipe:
    <br>
    </div>
        <section id="recipe-videos">
            <section id="video-player">
                <iframe id="playable-video" src="https://www.youtube.com/embed/${mealDetails.video}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </section>
            <section id="more-videos">
            <ul id="video-thumbs"></ul>
            </section>
        </section>

    `;

    return returnHTML;
}

function loadRecipeRandomizer(){
    $('#search-panel').hide();
    $('#random-panel').show();
    getRandomRecipe();
}