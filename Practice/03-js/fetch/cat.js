document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetch-cat');
    
    fetchButton.addEventListener('click', fetchCatImage);
    
    fetchCatImage();
});

function fetchCatImage() {
    
    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayCatData(data[0]);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
            document.body.innerHTML += `<p style="color: red">Erreur de chargement: ${error.message}</p>`;
        })
        ;
}

function displayCatData(catData) {
    const container = document.getElementById('cat-container');
    const image = document.getElementById('cat-image');
    const dataContainer = document.getElementById('cat-data');
    const rawJson = document.getElementById('raw-json');
    
    image.src = catData.url;
    image.alt = 'Image de chat de l\'API TheCatAPI';
    
    let infoHTML = `
        <p><strong>ID:</strong> ${catData.id}</p>
        <p><strong>URL:</strong> <a href="${catData.url}" target="_blank">${catData.url}</a></p>
        <p><strong>Largeur:</strong> ${catData.width} pixels</p>
        <p><strong>Hauteur:</strong> ${catData.height} pixels</p>
    `;
    dataContainer.innerHTML = infoHTML;
    
    rawJson.textContent = JSON.stringify(catData, null, 2);

    container.style.display = 'block';

}