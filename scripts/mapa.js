const map = L.map('map').setView([-24.987859731678746, -53.44917952674408], 18);
const carouselInner = window.document.getElementsByClassName('carousel-inner')[0];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

fetch('scripts/places.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        return response.json();
    })
    .then(places => {
        places.forEach(place => {
            const marker = L.marker(place.coordinates).addTo(map);

            const popupContent = `
                <p><strong>Local: </strong>${place.local}</p>
                <p><strong>Capacidade: </strong>${place.capacidade} pessoas</p>
                <p><strong>Categoria: </strong>${place.categoria}</p>
                <p><strong>Bloco: </strong>${place.bloco}</p>
                <p><strong>Andar: </strong>${place.andar}</p>
                <p><strong>Recursos: </strong>${place.recuros}</p>
                ${place.imagens.length > 0 ? `<button onclick='abrirCarrossel(${JSON.stringify(place.imagens)})'>Abrir modal</button>` : '<button disabled>Sem imagens</button>'}
            `;


            marker.bindPopup(popupContent);
        });
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

function carouselImages(imagens) {
    console.log("Imagens recebidas:", imagens); // Log para depurar as imagens
    // Limpar o conteúdo do carrossel antes de adicionar novas imagens
    carouselInner.innerHTML = '';

    // Verifica se há imagens e cria o primeiro item com a classe 'active'
    if (imagens.length > 0) {
        const div0 = document.createElement('div');
        div0.classList.add('carousel-item', 'active');  // Adiciona 'active' ao primeiro item

        const image0 = document.createElement('img');
        image0.src = 'images/' + imagens[0];  // Usa o primeiro item de imagens
        image0.alt = 'Imagem do local';

        div0.appendChild(image0);
        carouselInner.appendChild(div0);

        // Criação dos outros itens do carrossel
        for (let i = 1; i < imagens.length; i++) { // Começa de 1, pois o primeiro item já foi criado
            const div = document.createElement('div');
            div.classList.add('carousel-item');  // Outros itens não recebem 'active'

            const image = document.createElement('img');
            image.src = 'images/' + imagens[i];  // Atribui o caminho da imagem
            image.alt = 'Imagem do local';
            image.onerror = () => console.error('Erro ao carregar imagem:', imagens[i]);

            div.appendChild(image);
            carouselInner.appendChild(div);
        }
    } else {
        console.error("Nenhuma imagem foi recebida para esse local.");
    }
}

function abrirCarrossel(imagens) {
    // Verifica se há imagens antes de abrir o carrossel
    if (imagens && imagens.length > 0) {
        console.log("Abrindo carrossel com imagens:", imagens);
        carouselImages(imagens);  // Carrega as imagens para o carrossel
        document.getElementById("overlay").style.display = "flex"; // Torna o overlay visível
    } else {
        console.error("Não há imagens para exibir.");
    }
}



function fecharCarrossel(event) {
    if (event.target === document.getElementById('overlay')) {
        document.getElementById("overlay").style.display = "none"; // Esconde o overlay
    }
}
