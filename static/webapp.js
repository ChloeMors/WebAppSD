/*
 * webapp.js
 * Chloe Morscheck and Jake Martens
 * 
 * The JavaScript file for our site. Main features include
 * querying the underlying database and displaying results on 
 * a given page.
 * 
 * Our code includes snippets adapted from Jeff Ondich as well
 * as Shreya Nair and Elliott Hanson. The snippets are noted
 * in the comments preceding each function.
 */

window.onload = initialize;

function initialize() {
    if (document.title == 'Union Finder'){
        onIndexLoad();
    } else if (document.title == 'Search Unions') {
        loadStates();
        let elementUnions = document.getElementById('submit_button_unions');
        elementUnions.onclick = onSubmitButtonUnionsClicked;
    } else if (document.title == 'Search Strikes') {
        loadStates();
        loadStrikeIndustries()
        let elementStrike = document.getElementById('submit_button_strikes');
        elementStrike.onclick = onSubmitButtonStrikesClicked;
    } else if (document.title == 'Search Cases') {
        loadRegions();
        loadStates();
        let elementCases = document.getElementById('submit_button_cases');
        elementCases.onclick = onSubmitButtonCasesClicked;
    }
}

// Load relevant industries for sorting on the strikes page
function loadStrikeIndustries() {
    let url = getAPIBaseURL() + '/strike_industries'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(industries) {
        let industryDropDown = document.getElementById('Industry');
        let optionsBody = '<option value="">-</option>';
        for (let k = 0; k < industries.length; k++) {
            let industry = industries[k];
            optionsBody += '<option value="' + industry + '">' + industry + '</option>';
        }
        industryDropDown.innerHTML = optionsBody;
    })

    .catch(function(error) {
        console.log(error);
    });
}

// Load states for sorting, used on all three search pages
function loadStates() {
    let url = getAPIBaseURL() + '/states'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(states) {
        let stateDropDown = document.getElementById('state_selector');
        let optionsBody = '<option value="">-</option>';
        
        // This switch case is necessary due to differences in how API
        // handles state name vs. abbreviations
        if (document.title == "Search Strikes") {
            page_diff = 'state';
        } else {
            page_diff = 'abbr';
        }

        for (let k = 0; k < states.length; k++) {
            let state = states[k];
            
            optionsBody += '<option value="' + state[page_diff] + '">' + state['state'] + '</option>';
        }

        stateDropDown.innerHTML = optionsBody;

        // Placing this piece here feels less than ideal, we cannot make the map
        // autofill the state search on the union page without it.
        // Prior to loading the states in with JavaScript, this was not an issue.
        if (document.title == 'Search Unions' && window.location.hash){
            setState();
            onSubmitButtonUnionsClicked();
        }
    })

    .catch(function(error) {
        console.log(error);
    });
}

// Load judicial regions for use on the Search Case page
function loadRegions() {
    let url = getAPIBaseURL() + '/regions'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(regions) {
        let regionsDropDown = document.getElementById('region_selector')
        let optionsBody = '<option value="default">-</option>'
        for (let k = 0; k < regions.length; k++) {
            optionsBody += '<option value="' + regions[k] + '">' + regions[k] + '</option>'
        }
        regionsDropDown.innerHTML = optionsBody
    })

    .catch(function(error) {
        console.log(error);
    });
}

// For usage on Search Unions page. Handles query and displays
// matching unions on the page.
function onSubmitButtonUnionsClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let citySelector = document.getElementById('by_city');
    let city = citySelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = nameSelector.value;
    let membersSelector = document.getElementById('members_selector');
    let members = membersSelector.value;

    let url = getAPIBaseURL() + '/unions/?state_abbr=' 
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

// For usage on Search Cases page. Handles query and displays
// matching cases on the page.
function onSubmitButtonCasesClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = nameSelector.value;
    let caseNumberSelector = document.getElementById('by_case_number');
    let caseNumber = caseNumberSelector.value;
    let regionSelector = document.getElementById('region_selector');
    let region = regionSelector.value;

    let url = getAPIBaseURL() + '/cases/?state_abbr='
                + state + '&name_query=' + name + '&case_number=' + caseNumber + '&region=' + region;
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
                    var dateClosedString = 'Ongoing'
                } else {
                    var dateClosedString = result['date_closed']
                }
                selectorBody += '<b>' + result['case_name'] + '</b> ('
                + result['case_number'] + ')<br>Location: ' + result['city']+ ', ' + result['territory'] 
                + '<br>Date Filed: ' + result['date_filed'] + '<br> Date Closed: ' + dateClosedString
                + '<br>Assigned Region: ' + result['region'] + '<br>Status: ' + result['current_status'] + '<br>';
            } 
        }
        resultsElement.innerHTML = selectorBody;
    })

    .catch(function(error) {
        console.log(error);
    });
}

// For usage on Search Strikes page. Handles query and displays
// matching strikes on the page.
function onSubmitButtonStrikesClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let industrySelector = document.getElementById('Industry');
    let industry = industrySelector.value;
    let endDateCheck = document.getElementById('endDate')
    let endDate = endDateCheck.checked;
    let companySelector = document.getElementById('by_name')
    let company = companySelector.value;

    let url = getAPIBaseURL() + '/strikes/?state='
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
                    var endDateString  = 'present'
                } else {
                    var endDateString  = strike['end_date']
                }
                if (strike['participants'] == 'None'){
                    strike['participants'] = 'No data'
                }
                selectorBody += '<b>' + strike['employer'] + '</b><br>Number of Participants: ' + strike['participants']
                + '<br>Started on ' + strike['start_date']+ ' to ' + endDateString + '<br> Demands: ' + strike['demands'] 
                + '<br> Location: ' + strike['city'] + ', ' + strike['state'] + '<br>';
            }
        }
        resultsElement.innerHTML = selectorBody;
    })
    
    .catch(function(error) {
        console.log(error);
    });
}

// Displays ongoing strikes as well as initializes map when
// index.html is laoded.
function onIndexLoad(){
    initializeMap(); 

    let url = getAPIBaseURL() + '/strikes/';
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
                    var endDateString  = 'present'
                } else {
                    var endDateString  = strike['end_date']
                }
                selectorBody += '<b>' + strike['employer'] + '</b><br>' + 'Started on ' + strike['start_date']+ ' to ' 
                + endDateString + '<br> Demands: ' + strike['demands'] + '<br> Location: ' + strike['city'] + ', ' 
                + strike['state'] + '<br>';
            }
        }
        resultsElement.innerHTML = selectorBody;
    })
    
    .catch(function(error) {
        console.log(error);
    });
}

// Displays map on home page
// Credit is due to Jeff Ondich, from whom most of
// this code is adapted.
function initializeMap() {
    var map = new Datamap({ element: document.getElementById('map-container'),
                            scope: 'usa', 
                            projection: 'equirectangular', 
                            done: onMapDone,
                            fills: { defaultFill: '#999999' },
                            geographyConfig: {
                                highlightOnHover: true,
                                popupTemplate: hoverPopupTemplate,
                                borderColor: '#eeeeee',
                                highlightFillColor: '#a50000'
                            }
                          });
}

// Allows interactivity with map display
function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}

// Displays name of state when user hovers over its
// outline on the map.
function hoverPopupTemplate(geography, data) {
    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>'
                    + '</div>';

    return template;
}

// Navigates to Search Unions page when a state is clicked.
// We include a hashtag with the state's abbreviation to 
// trigger an automatic search for this state when the new 
// page loads.
function onStateClick(geography) {
    window.location.href = '/search_unions#' + geography.id;
}

// Called by loadStates() function. This function sets
// the state selector to the abbreviation denoted in the URL
function setState(){
    var hash = window.location.hash.substring(1);
    document.getElementById('state_selector').value = hash;
}

// Returns the base URL of the API, onto which endpoint
// components can be appended.
// Kudos to Shreya Nair and Elliot Nair for this bit of 
// code. We realized this was a better idea than 
// what we originally had during code review
function getAPIBaseURL() {
    let baseURL = window.location.protocol
                    + '//' + window.location.hostname
                    + ':' + window.location.port
                    + '/api';
    return baseURL;
}