/*
 * webapp.js
 * Chloe Morscheck and Jake Martens
 */

window.onload = initialize;

function initialize() {
    let element = document.getElementById('submit_button');
    element.onclick = onSubmitButtonClicked;
}

function onSubmitButtonClicked() {
    let stateSelector = document.getElementById('state_selector');
    let state = stateSelector.value;
    let url = 'http://localhost:5000/api/unions/?state_abbr='
                + state;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(unions) {
        let resultsElement = document.getElementById('matching_unions');
        
        let selectorBody = '';
        for (let k = 0; k < unions.length; k++) {
            let union = unions[k];
            selectorBody += '<b>' + union['union_name'] + '</b>' + ' '
                                + union['abbr'] + ', ' + union['members']+ ' ' + union['street_adr'] + ' ' + union['city']
                                + ', ' + union['region'] + ' ' + union['zip'] + '<br>';
        }

        resultsElement.innerHTML = selectorBody;
    })

    .catch(function(error) {
        console.log(error);
    });
}

