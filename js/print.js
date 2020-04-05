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
            <div style="position:relative;width:90%;">
            <div style="float:right;width:35%;">
            <img src="${mealDetails.img}" width="90%">
            </div>
            ${mealDetails.name}
            <br><br>
        
            Ingredients:<br>
            <ul>${ingredientsHTML}</ul>
            <br><br>
            Instructions:<br>
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
            <div style="position:relative;width:90%;">
            <div style="float:right;width:35%;">
            <img src="${mealDetails.img}" width="90%">
            </div>
            ${mealDetails.name}
            <br><br>
        
            Ingredients:<br>
            <ul style="list-style:none;">${ingredientsHTML}</ul>
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