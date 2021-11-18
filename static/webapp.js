/*
 * webapp.js
 * Chloe Morscheck and Jake Martens
 */

window.onload = initialize;

function initialize() {
    
    
    // The following funciton call does not ever occur on the strikes page. 
    // It works if the above lines are commented out but not otherwise
    // and i dont know why
    let elementStrike = document.getElementById('submit_button_strikes');
    let elementCases = document.getElementById('submit_button_cases');
    
    if (document.title == 'Union Finder'){
        onIndexLoad();
        initializeMap();
    } else if (document.title = 'Search Unions') {
        if (window.location.hash){
            onUnionLoad(true)
        } else {
            onUnionLoad(false)
        }
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
                selectorBody += '<b>' + union['union_name'] + '</b>' + ' ('
                                    + union['abbr'] + ')<br> Number of Members:' + union['members']+ '<br> Address: ' 
                                    + union['street_adr'] + ' ' + union['city']
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
                if (result['date_closed'] == ''){
                    var date_closed_string = 'Ongoing'
                } else {
                    var date_closed_string = result['date_closed']
                }
                selectorBody += '<b>' + result['case_name'] + '</b> ('
                + result['case_number'] + ')<br>Location: ' + result['city']+ ', ' + result['territory'] 
                + '<br>Date Filed: ' + result['date_filed'] + '<br> Date Closed: ' + date_closed_string
                + '<br>Assigned Region: ' + result['region'] + '<br>Status: ' + result['current_status'] + '<br>';
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
            selectorBody = "No strikes match search criteria."
        } else {
            for (let k = 0; k < strikes.length; k++) {
                let strike = strikes[k];
                if (strike['end_date'] == 'None'){
                    var end_date_string  = 'present'
                } else {
                    var end_date_string  = strike['end_date']
                }
                selectorBody += '<b>' + strike['employer'] + '</b><br>Number of Participants: ' + strike['participants']
                + '<br>Started on ' + strike['start_date']+ ' to ' + end_date_string + '<br> Demands: ' + strike['demands'] 
                + '<br> Location: ' + strike['city'] + ', ' + strike['state'] + '<br>';
            }
        }
        resultsElement.innerHTML = selectorBody;
    })
    
    .catch(function(error) {
        console.log(error);
    });
}
function onIndexLoad(){
    let url = 'http://localhost:5000/api/strikes/';
    fetch(url, {method: 'get'})

    .then((response) => response.json())
    
    .then(function(strikes) {
        let resultsElement = document.getElementById('ongoing_strikes');
        
        let selectorBody = '';
        if (strikes == "None") {
            selectorBody = "No strikes match search criteria."
        } else {
            for (let k = 0; k < 6; k++) {
                let strike = strikes[k];
                if (strike['end_date'] == 'None'){
                    var end_date_string  = 'present'
                } else {
                    var end_date_string  = strike['end_date']
                }
                selectorBody += '<b>' + strike['employer'] + '</b><br>' + 'Started on ' + strike['start_date']+ ' to ' 
                + end_date_string + '<br> Demands: ' + strike['demands'] + '<br> Location: ' + strike['city'] + ', ' 
                + strike['state'] + '<br>';
            }
        }
        resultsElement.innerHTML = selectorBody;
    })
    
    .catch(function(error) {
        console.log(error);
    });
}
/*
var extraStateInfo = {
    MN: {population: 5640000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    CA: {population: 39500000, jeffhaslivedthere: true, fillColor: '#2222aa'},
    NM: {population: 2100000, jeffhaslivedthere: false, fillColor: '#2222aa'},
    OH: {population: 0, jeffhaslivedthere: false, fillColor: '#aa2222'}
};*/
function initializeMap() {
    var map = new Datamap({ element: document.getElementById('map-container'), // where in the HTML to put the map
                            scope: 'usa', // which map?
                            projection: 'equirectangular', // what map projection? 'mercator' is also an option
                            done: onMapDone, // once the map is loaded, call this function
                            /*data: extraStateInfo, // here's some data that will be used by the popup template*/
                            fills: { defaultFill: '#999999' },
                            geographyConfig: {
                                //popupOnHover: false, // You can disable the hover popup
                                highlightOnHover: true, // You can disable the color change on hover
                                popupTemplate: hoverPopupTemplate, // call this to obtain the HTML for the hover popup
                                borderColor: '#eeeeee', // state/country border color
                                highlightFillColor: '#337AFF', // color when you hover on a state/country
                                highlightBorderColor: '#000000', // border color when you hover on a state/country
                            }
                          });
}

// This gets called once the map is drawn, so you can set various attributes like
// state/country click-handlers, etc.
function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}


function hoverPopupTemplate(geography, data) {
    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>'
                    + '</div>';

    return template;
}

function onStateClick(geography) {
    window.location.href = '/search_unions#' + geography.id;
}

function onUnionLoad(first_load) {
    if (first_load) {
        var hash = window.location.hash.substring(1);
        document.getElementById('state_selector').value = hash;
        onSubmitButtonUnionsClicked();
    } 
    let elementUnions = document.getElementById('submit_button_unions');
    elementUnions.onclick = onSubmitButtonUnionsClicked;
}