// Al caricamento del DOM, gestisce la visualizzazione temporizzata dei messaggi di successo ed errore
document.addEventListener("DOMContentLoaded", function () {
    // Nasconde i messaggi di successo dopo 3 secondi
    const successMessage = document.querySelector(".alert-success");
    if (successMessage) {
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }
    // Nasconde i messaggi di errore dopo 3 secondi
    const errorMessage = document.querySelector(".alert-danger");
    if (errorMessage) {
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});

// Funzione per caricare la lista dei DLC relativi a un gioco principale
function loadDLCs(mainGameId, gameName) {
    // Aggiorna il titolo del modal con il nome del gioco
    document.getElementById("mainGameTitle").textContent = `DLCs for ${gameName}`;

    // Effettua una richiesta al server per ottenere i DLC
    fetch(`/Games/GetDLCs?mainGameId=${mainGameId}`)
        .then(response => response.json()) // Converte la risposta in JSON
        .then(dlcList => {
            const dlcListElement = document.getElementById("dlcList");
            dlcListElement.innerHTML = ""; // Pulisce la lista esistente

            // Mostra un messaggio se non ci sono DLC disponibili
            if (dlcList.length === 0) {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item text-muted";
                listItem.textContent = "No DLCs found for this game.";
                dlcListElement.appendChild(listItem);
            } else {
                // Aggiunge ogni DLC alla lista
                dlcList.forEach(dlc => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                        <i class="fas fa-gamepad me-2 text-primary"></i>
                        <strong>${dlc.gameName}</strong>
                    `;
                    dlcListElement.appendChild(listItem);
                });
            }
        })
        .catch(error => console.error('Error fetching DLCs:', error)); // Gestisce eventuali errori nella richiesta
}

// Estrae i parametri della URL per mostrare un modal di aggiunta gioco
const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('gameName');

if (gameName) {
    // Mostra il modal con i dati precompilati
    const gameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
    document.getElementById('gameNameInput').value = gameName;
    fromAllViewGames.value = urlParams.get('fromAllViewGames');
    gameModal.show();
}

// Mostra il modal di aggiunta gioco 
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash === '#addGameModal') {
        var addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
        addGameModal.show();
    }
});

// Variabili globali per tenere traccia del gioco attualmente selezionato
let currentMainGameId = null;
let currentGameName = null;

// Funzione per caricare i DLC con paginazione
function loadDLCs(mainGameId, gameName, page = 1) {
    // Memorizza l'ID e il nome del gioco corrente
    currentMainGameId = mainGameId;
    currentGameName = gameName;

    // Aggiorna il titolo del modal
    document.getElementById("mainGameTitle").textContent = `DLCs for ${gameName}`;

    // Richiede i DLC con supporto per la paginazione
    fetch(`/Games/GetDLCs?mainGameId=${mainGameId}&page=${page}`)
        .then(response => response.json()) // Converte la risposta in JSON
        .then(result => {
            const dlcListElement = document.getElementById("dlcList");
            const paginationElement = document.getElementById("dlcPagination");
            dlcListElement.innerHTML = ""; // Pulisce la lista esistente
            paginationElement.innerHTML = ""; // Pulisce la paginazione esistente

            // Mostra un messaggio se non ci sono DLC
            if (result.dlcs.length === 0) {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item text-muted";
                listItem.textContent = "No DLCs found for this game.";
                dlcListElement.appendChild(listItem);
            } else {
                // Aggiunge i DLC alla lista
                result.dlcs.forEach(dlc => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                        <i class="fas fa-gamepad me-2 text-primary"></i>
                        <strong>${dlc.gameName}</strong>
                    `;
                    dlcListElement.appendChild(listItem);
                });

                // Aggiunge la paginazione se ci sono più pagine
                if (result.totalPages > 1) {
                    // Aggiunge il pulsante "Previous" se non siamo alla prima pagina
                    if (result.currentPage > 1) {
                        const prevLi = document.createElement("li");
                        prevLi.className = "page-item";
                        const prevLink = document.createElement("a");
                        prevLink.className = "page-link";
                        prevLink.href = "#";
                        prevLink.textContent = "Previous";
                        prevLink.onclick = (e) => {
                            e.preventDefault();
                            loadDLCs(currentMainGameId, currentGameName, result.currentPage - 1);
                        };
                        prevLi.appendChild(prevLink);
                        paginationElement.appendChild(prevLi);
                    }

                    // Aggiunge i numeri di pagina
                    for (let i = 1; i <= result.totalPages; i++) {
                        const pageLi = document.createElement("li");
                        pageLi.className = `page-item ${i === result.currentPage ? 'active' : ''}`;
                        const pageLink = document.createElement("a");
                        pageLink.className = "page-link";
                        pageLink.href = "#";
                        pageLink.textContent = i;
                        pageLink.onclick = (e) => {
                            e.preventDefault();
                            loadDLCs(currentMainGameId, currentGameName, i);
                        };
                        pageLi.appendChild(pageLink);
                        paginationElement.appendChild(pageLi);
                    }

                    // Aggiunge il pulsante "Next" se non siamo all'ultima pagina
                    if (result.currentPage < result.totalPages) {
                        const nextLi = document.createElement("li");
                        nextLi.className = "page-item";
                        const nextLink = document.createElement("a");
                        nextLink.className = "page-link";
                        nextLink.href = "#";
                        nextLink.textContent = "Next";
                        nextLink.onclick = (e) => {
                            e.preventDefault();
                            loadDLCs(currentMainGameId, currentGameName, result.currentPage + 1);
                        };
                        nextLi.appendChild(nextLink);
                        paginationElement.appendChild(nextLi);
                    }
                }
            }
        })
        .catch(error => console.error('Error fetching DLCs:', error)); // Gestisce eventuali errori nella richiesta
}
