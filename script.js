const form = document.getElementById('destination-form');
const toVisitList = document.getElementById('to-visit-list');
const visitedList = document.getElementById('visited-list');

// Função para carregar os dados do localStorage
function loadPlaces() {
    const toVisitPlaces = JSON.parse(localStorage.getItem('toVisitPlaces')) || [];
    const visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];

    toVisitPlaces.forEach(place => {
        displayToVisit(place.name, place.state);
    });

    visitedPlaces.forEach(place => {
        displayVisited(place.name, place.state, place.date);
    });
}

function displayToVisit(name, state) {
    const placeElement = document.createElement('div');
    placeElement.classList.add('place');
    placeElement.innerHTML = `
        <span>${name} - ${state}</span>
        <button onclick="markAsVisited(this)">Fomos!</button>
    `;
    toVisitList.appendChild(placeElement);
}

function displayVisited(name, state, date) {
    const placeElement = document.createElement('div');
    placeElement.classList.add('place');
    placeElement.innerHTML = `
        <span>${name} - ${state} - Conhecido em: ${date}</span>
        <button onclick="deletePlace(this)">Excluir</button>
    `;
    visitedList.appendChild(placeElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('place-name').value;
    const state = document.getElementById('place-state').value;

    // Adicionando no localStorage
    const toVisitPlaces = JSON.parse(localStorage.getItem('toVisitPlaces')) || [];
    toVisitPlaces.push({ name, state });
    localStorage.setItem('toVisitPlaces', JSON.stringify(toVisitPlaces));

    displayToVisit(name, state);
    form.reset();
});

function markAsVisited(button) {
    const placeElement = button.parentElement;
    const nameState = placeElement.querySelector('span').textContent.split(' - ');
    const name = nameState[0];
    const state = nameState[1];

    const rawDate = prompt("Insira a data que visitou (dd/mm/aaaa):");
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (rawDate && dateRegex.test(rawDate)) {
        const formattedDate = rawDate.replace(dateRegex, "$1/$2/$3");

        // Atualizando o localStorage
        const toVisitPlaces = JSON.parse(localStorage.getItem('toVisitPlaces')) || [];
        const visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];

        const indexToRemove = toVisitPlaces.findIndex(place => place.name === name && place.state === state);
        toVisitPlaces.splice(indexToRemove, 1);

        visitedPlaces.push({ name, state, date: formattedDate });

        localStorage.setItem('toVisitPlaces', JSON.stringify(toVisitPlaces));
        localStorage.setItem('visitedPlaces', JSON.stringify(visitedPlaces));

        placeElement.innerHTML = `
            <span>${name} - ${state} - Conhecido em: ${formattedDate}</span>
            <button onclick="deletePlace(this)">Excluir</button>
        `;
        visitedList.appendChild(placeElement);
    } else {
        alert("Por favor, insira uma data válida no formato dd/mm/aaaa.");
    }
}

function deletePlace(button) {
    const placeElement = button.parentElement;
    const content = placeElement.querySelector('span').textContent.split(' - Conhecido em:')[0];
    placeElement.innerHTML = `
        <span>${content}</span>
        <button onclick="markAsVisited(this)">Fomos!</button>
    `;
    toVisitList.appendChild(placeElement);

    // Atualizando o localStorage
    const visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
    const indexToRemove = visitedPlaces.findIndex(place => place.name === content);
    visitedPlaces.splice(indexToRemove, 1);
    localStorage.setItem('visitedPlaces', JSON.stringify(visitedPlaces));
}

loadPlaces();
