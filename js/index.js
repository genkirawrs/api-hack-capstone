function sendRequest(){
alert('TBD');

}

function initHomeElements() {
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