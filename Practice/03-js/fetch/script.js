"use strict";

let heroData = null;

function loadHeroes() {
    fetch('hero.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            heroData = data;
            createHeroSelection(heroData);
        })
        .catch(error => {
            console.error("Erreur lors du chargement des héros:", error);
            document.body.innerHTML += `<p style="color: red">Erreur de chargement: ${error.message}</p>`;
        });
}

function createHeroSelection(data) {
    const heroCheckboxes = document.getElementById('hero-checkboxes');
    const heroes = data.members;
    
    heroes.forEach(hero => {
        const label = document.createElement('label');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = hero.name;
        checkbox.id = `hero-${hero.name.replace(/\s+/g, '-').toLowerCase()}`;
        checkbox.addEventListener('change', updateHeroCards);
        
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${hero.name}`));
        
        heroCheckboxes.appendChild(label);
    });
    
    const squadInfo = document.getElementById('squad-info');
    squadInfo.innerHTML = `
        <h3>Informations de l'équipe:</h3>
        <p><strong>Nom:</strong> ${data.squadName}</p>
        <p><strong>Ville:</strong> ${data.homeTown}</p>
        <p><strong>Formée en:</strong> ${data.formed}</p>
        <p><strong>Base secrète:</strong> ${data.secretBase}</p>
        <p><strong>Active:</strong> ${data.active ? 'Oui' : 'Non'}</p>
    `;
}

function updateHeroCards() {
    const heroCards = document.getElementById('hero-cards');
    heroCards.innerHTML = '';
    
    const checkboxes = document.querySelectorAll('#hero-checkboxes input[type="checkbox"]:checked');
    const selectedHeroes = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    if (selectedHeroes.length === 0) {
        heroCards.innerHTML = '<p>Aucun héros sélectionné</p>';
        return;
    }
    
    const heroes = heroData.members;
    
    selectedHeroes.forEach(selectedHeroName => {
        const hero = heroes.find(h => h.name === selectedHeroName);
        if (!hero) return;
        
        const card = document.createElement('div');
        card.className = 'hero-card';
        
        const powers = hero.powers.map(power => `<li>${power}</li>`).join('');
        
        card.innerHTML = `
            <h2>${hero.name}</h2>
            <p><strong>Âge:</strong> ${hero.age}</p>
            <p><strong>Identité secrète:</strong> ${hero.secretIdentity}</p>
            <p><strong>Pouvoirs:</strong></p>
            <ul class="hero-powers">
                ${powers}
            </ul>
        `;
        
        heroCards.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadHeroes);