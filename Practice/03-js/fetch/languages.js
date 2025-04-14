"use strict";

let languagesData = null;
function fetchLanguages() {
    fetch('languages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            languagesData = data;
            initializeLanguageSelector();
        })
        .catch(error => {
            console.error('Erreur lors du chargement des langues:', error);
            document.body.innerHTML += `<p style="color: red">Erreur de chargement: ${error.message}</p>`;
        });
}

function initializeLanguageSelector() {
    const selector = document.getElementById('language-selector');
    const img = document.querySelector('.hidden');

    languagesData.languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        selector.appendChild(option);
    });

    let savedLanguage = localStorage.getItem('selectedLanguage');
    if (!savedLanguage) {
        savedLanguage = languagesData.languages[0].code;
        localStorage.setItem('selectedLanguage', savedLanguage);
    }
    selector.value = savedLanguage;
    updateContent(selector.value);

    updateImageVisibility(savedLanguage, img);
    
    selector.addEventListener('change', function() {
        const selectedLang = this.value;
        updateContent(selectedLang);
        
        localStorage.setItem('selectedLanguage', selectedLang);
        updateImageVisibility(selectedLang, img);

    });

}

function updateImageVisibility(langCode, img) {
    if (!img) return;
    if (langCode === "tlh") {
        img.style.display = 'initial';
        img.style.width = '50%';
    } else {
        img.style.display = 'none';
    }
}

function updateContent(langCode) {
    const lang = languagesData.languages.find(function(l) { return l.code === langCode; });
    
    if (!lang) return;
    
    document.getElementById('content-title').textContent = lang.title;
    document.getElementById('content-description').textContent = lang.description;
    document.getElementById('content-info').textContent = lang.info;
    document.getElementById('main-title').textContent = `Sélecteur de Langues (${lang.name})`;
    
    document.documentElement.lang = langCode;
}

document.addEventListener('DOMContentLoaded', fetchLanguages);