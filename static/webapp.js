/*
 * webapp.js
 * Chloe Morscheck and Jake Martens
 */

window.onload = initialize;

function initialize() {
    let elementUnions = document.getElementById('submit_button_unions');
    
    // The following funciton call does not ever occur on the strikes page. 
    // It works if the above lines are commented out but not otherwise
    // and i dont know why
    let elementStrike = document.getElementById('submit_button_strikes');
    let elementCases = document.getElementById('submit_button_cases');
    
    if (elementUnions) {
        elementUnions.onclick = onSubmitButtonUnionsClicked;
    } else if (elementStrike) {
        elementStrike.onclick = onSubmitButtonStrikesClicked;
    } else if (elementCases) {
        elementCases.onclick = onSubmitButtonCasesClicked;
    }
    // This is where we should insert the states and industries into the drop downs
}

// how do we specify how this works on all the different pages?
function onSubmitButtonUnionsClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = by_name.value;
    // Below the url references the api url, not the app - which is right 
    // because we need to request the data from the api ??
    let url = 'http://localhost:5000/api/unions/?state_abbr='
                + state + '&name_query=' + name ;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(unions) {
        let resultsElement = document.getElementById('matching_unions');
        
        let selectorBody = '';
        if (unions == "None") {
            selectorBody = "No unions match search criteria."
        } else {
            for (let k = 0; k < unions.length; k++) {
                let union = unions[k];
                selectorBody += '<b>' + union['union_name'] + '</b>' + ' '
                                    + union['abbr'] + ', ' + union['members']+ ' ' + union['street_adr'] + ' ' + union['city']
                                    + ', ' + union['region'] + ' ' + union['zip'] + '<br>';
            } 
        }
        resultsElement.innerHTML = selectorBody;
    })

    .catch(function(error) {
        console.log(error);
    });
}
function onSubmitButtonCasesClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = by_name.value;
    let url = 'http://localhost:5000/api/cases/?state_abbr='
                + state + '&name_query=' + name ;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(cases) {
        let resultsElement = document.getElementById('matching_cases');
        
        let selectorBody = '';
        if (cases == "None") {
            selectorBody = "No cases match search criteria."
        } else {
            for (let k = 0; k < cases.length; k++) {
                let result = cases[k];
                selectorBody += '<b>' + result['case_name'] + '</b>' + ' '
                + result['case_number'] + ' ' + result['city']+ ', ' + result['terrirtory'] + ' ' + result['date_filed']
                + ', ' + result['date_closed'] + ' ' + result['region'] + ' ' + result['current_status'] + '<br>';
            } 
        }
        resultsElement.innerHTML = selectorBody;
    })

    .catch(function(error) {
        console.log(error);
    });
}

function onSubmitButtonStrikesClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let industrySelector = document.getElementById('Industry');
    let industry = industrySelector.value;
    // Below the url references the api url, not the app - which is right 
    // because we need to request the data from the api ??
    let url = 'http://localhost:5000/api/strikes/?state_abbr='
                + state + '&industry=' + industry;

    // The below two lines do not get called so im assuming this isnt getting called
    //let resultsElement = document.getElementById('matching_strikes');
    //resultsElement.innerHTML = "Hello";
    fetch(url, {method: 'get'})

    .then((response) => response.json())
    
    .then(function(strikes) {
        let resultsElement = document.getElementById('matching_strikes');
        
        let selectorBody = '';
        if (strikes == "None") {
            selectorBody = "No unions match search criteria."
        } else {
            for (let k = 0; k < strikes.length; k++) {
                let strike = strikes[k];
                selectorBody += '<b>' + strike['employer'] + '</b>' + 'Number of Participants: '
                                + strike['participants'] + ', started on ' + strike['start_date']+ ' to' + strike['end_date'] + ', demands:' + strike['demands']
                                + ', ' + strike['city'] + ' ' + strike['state'] + '<br>';
            }
        }
        resultsElement.innerHTML = selectorBody;
    })
    
    .catch(function(error) {
        console.log(error);
    });
}