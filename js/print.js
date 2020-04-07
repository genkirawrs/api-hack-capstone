function initPrintable(){
    let url = location.href;
    if(url.indexOf('?')!=-1){

        let urlSplit = url.split('?')[1].split('&');
        console.log(urlSplit);
        let variablesList = [];
        
        urlSplit.map(function(entry){
            variablesList.push(entry.split('='));
        });
        
        if(variablesList[0][0] == 'grocery' || variablesList[0][0] == 'recipe'){
            displayPrintableInfo(variablesList[0][0],variablesList[0][1]);
        }else{
            console.log('ah...');
        }
    }
}

function displayPrintableInfo(displayType,recipeID){
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

        if( displayType == 'recipe'){
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
        
            let recipeHTML = `
            <div class="printable-recipe">
            <h2>${mealDetails.name}</h2>
            <br>
            <div class="printable-recipe-img">
            <img src="${mealDetails.img}">
            </div>
        
            <strong>Ingredients:</strong><br>
            <ul id="printable-recipe-ingredients">${ingredientsHTML}</ul>
            <br><br>
            <strong>Instructions:</strong><br>
            <ul>${instructionsHTML}</ul>
            <br><br>
            </div>`;
            $('#printable-display').html(recipeHTML);
        }else if( displayType == 'grocery' ){
            let ingredientsHTML = ""
            $.each(mealDetails.ingredients, function(){
                let list = this;
                ingredientsHTML = `${ingredientsHTML}<li>&#9634; ${list}</li>`;
            });
        
            let recipeHTML = `
            <div class="printable-recipe">
            <h2>${mealDetails.name}</h2>
            <br>
            <div class="printable-recipe-img">
            <img src="${mealDetails.img}">
            </div>
        
            Grocery List:<br>
            <ul id="grocery-list">${ingredientsHTML}</ul>
            <br><br>
            </div>`;
            $('#printable-display').html(recipeHTML);
        }
    })
    .catch(error => {
        console.log("recipe id error!");
        //$('#search-progress').text(`Sorry, there was an error: ${error.message}`);
    });

}