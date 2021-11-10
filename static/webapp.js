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
    let url = 'http://localhost:5000/union/?state_abbr='
                + state;

    fetch(url, {method: 'get'})

    .then((response) => response.json())

    .then(function(unions) {
        let resultsElement = document.getElementById('matching_unions');
        resultsElement.innerHTML = 'Results: ' + unions;
    })

    .catch(function(error) {
        console.log(error);
    });
}

