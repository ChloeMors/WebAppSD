/*
 * webapp.js
 * Chloe Morscheck and Jake Martens
 */

window.onload = initialize;

function initialize() {
    let elementStrike = document.getElementById('submit_button_strikes');
    let elementCases = document.getElementById('submit_button_cases');
    
    if (document.title == 'Union Finder'){
        onIndexLoad();
        initializeMap();
    } else if (document.title == 'Search Unions') {
        if (window.location.hash){
            onUnionLoad(true)
        } else {
            onUnionLoad(false)
        }
    } else if (document.title == 'Search Strikes') {
        loadStates()
        elementStrike.onclick = onSubmitButtonStrikesClicked;
    } else if (document.title == 'Search Cases') {
        elementCases.onclick = onSubmitButtonCasesClicked;
    }
    // This is where we should insert the states and industries into the drop downs
}

function loadStates() {
    
    let url = 'http://localhost:5000/api/states'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(states) {
        let stateDropDown = document.getElementById('state_selector')
        // should be able to set options Body to '' once its actually working
        let optionsBody = ''
        let page_diff = ''
        if (document.title == "Search Strikes") {
            page_diff = 'state'
        } else {
            page_diff = 'abbr'
        }
        for (let k = 0; k < states.length; k++) {
            let state = states[k]
            optionsBody += '<option value="' + state[page_diff] + '">' + state['state'] + '</option>'
        }
        stateDropDown.innerHTML = optionsBody
    })

    .catch(function(error) {
        console.log(error);
    });
    // shouldnt need this?
    let elementStrike = document.getElementById('submit_button_strikes');
    elementStrike.onclick = onSubmitButtonStrikesClicked;
}

// how do we specify how this works on all the different pages?
function onSubmitButtonUnionsClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let citySelector = document.getElementById('by_city');
    let city = citySelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = by_name.value;
    let membersSelector = document.getElementById('members_selector');
    let members = membersSelector.value;
    // Below the url references the api url, not the app - which is right 
    // because we need to request the data from the api ??
    let url = 'http://localhost:5000/api/unions/?state_abbr='
                + state + '&city=' + city + '&name_query=' + name + '&members=' + members;

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
    let caseNumberSelector = document.getElementById('by_case_number');
    let case_number = by_case_number.value;
    let url = 'http://localhost:5000/api/cases/?state_abbr='
                + state + '&name_query=' + name + '&case_number=' + case_number;

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
    let endDateCheck = document.getElementById('endDate')
    let endDate = endDateCheck.checked;
    let companySelector = document.getElementById('by_name')
    let company = companySelector.value;
    // Below the url references the api url, not the app - which is right 
    // because we need to request the data from the api ??
    // would it be better to use if statements to only append relevant sections
    let url = 'http://localhost:5000/api/strikes/?state='
                + state + '&industry=' + industry + '&company=' + company + '&end=' + endDate;
    
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
                if (strike['participants'] == 'None'){
                    strike['participants'] = 'No data'
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
                                highlightFillColor: '#a50000' //'#337AFF', // color when you hover on a state/country
                                //highlightBorderColor: '#eeeeee' // border color when you hover on a state/country*/
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
    loadStates()
    if (first_load) {
        var hash = window.location.hash.substring(1);
        document.getElementById('state_selector').value = hash;
        onSubmitButtonUnionsClicked();
    } 
    let elementUnions = document.getElementById('submit_button_unions');
    elementUnions.onclick = onSubmitButtonUnionsClicked;
    }