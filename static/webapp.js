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
        loadStates();
        let elementUnions = document.getElementById('submit_button_unions');
        elementUnions.onclick = onSubmitButtonUnionsClicked;
    } else if (document.title == 'Search Strikes') {
        loadStates();
        loadStrikeIndustries()
        elementStrike.onclick = onSubmitButtonStrikesClicked;
    } else if (document.title == 'Search Cases') {
        loadRegions();
        loadStates();
        elementCases.onclick = onSubmitButtonCasesClicked;
    }
    
}

function loadStrikeIndustries() {
    let url = getAPIBaseURL() + '/strike_industries'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(industries) {
        let industryDropDown = document.getElementById('industry');
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
function loadStates() {
    let url = getAPIBaseURL() + '/states'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(states) {
        let stateDropDown = document.getElementById('state_selector');
        let optionsBody = '<option value="">-</option>';
        let page_diff = 'abbr';
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

function loadRegions() {
    let url = getAPIBaseURL() + '/regions'
    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(regions) {
        let regionsDropDown = document.getElementById('region_selector')
        // should be able to set options Body to '' once its actually working
        let optionsBody = '<option value="default">-</option>'
        for (let k = 0; k < regions.length; k++) {
            let region = regions[k]
            optionsBody += '<option value="' + regions[k] + '">' + regions[k] + '</option>'
        }
        regionsDropDown.innerHTML = optionsBody
    })

    .catch(function(error) {
        console.log(error);
    });
}


function onSubmitButtonUnionsClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let citySelector = document.getElementById('by_city');
    let city = citySelector.value;
    let nameSelector = document.getElementById('by_name');
    // nameselector vs by_name
    let name = by_name.value;
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
function onSubmitButtonCasesClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let nameSelector = document.getElementById('by_name');
    let name = by_name.value;
    let caseNumberSelector = document.getElementById('by_case_number');
    let case_number = by_case_number.value;
    let regionSelector = document.getElementById('region_selector');
    let region = regionSelector.value;
    let url = getAPIBaseURL() + '/cases/?state_abbr='
                + state + '&name_query=' + name + '&case_number=' + case_number + '&region=' + region;

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
    let industrySelector = document.getElementById('industry');
    let industry = industrySelector.value;
    let endDateCheck = document.getElementById('end_date')
    let endDate = endDateCheck.checked;
    let companySelector = document.getElementById('by_name')
    let company = companySelector.value;
    //base url
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
    // base url
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