function toggleMenu(){
  $(".nav-links").toggleClass('nav-links-show');
}

function loadRecipeRandomizer(){
  scrollToTop();
  toggleMenu();
  $('#search-panel').hide();
  $('#random-panel').show();
  getRandomRecipe();
}

function loadRecipeSearch(){
  scrollToTop();
  toggleMenu();
  $('#recipe-search-term').prop('value', "");
  $('#max-results').prop('value', defaultMaxResults);
  $('#simple-search-form').show();
  $('#search-progress').html('');
  $('#full-recipe').html('');
  $('#recipes-list').show();
  $('#search-panel').show();
  $('#random-panel').hide();
  getRecentRecipes();
}


function initHomeElements() {
  $('#max-results').prop('value', defaultMaxResults);

    $('#simple-form').submit(function(event) {
      event.preventDefault();
      //disable form while we're doing a search
      $('#simple-form :input').prop("disabled",true);  

      //clear any previous lists/messages
      $('#search-progress').text('searching!');
      //$('#recipes-list').html('searching!');

      const searchTerm = $('#recipe-search-term').val().toLowerCase();
      const returnQty = $('#max-results').val();

      const queryString = formatRecipeSearch(searchTerm);

      searchRecipe(queryString,returnQty);

      $('#simple-form :input').prop("disabled",false);  

    });
    getRecentRecipes();
}