
document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    const pageSize = 5;

    // Recupera e visualizza l'elenco dei negozi con supporto per la paginazione.
    function fetchStores(page) {
        fetch(`${getAllStoresUrl}?page=${page}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
                // Costruisce l'HTML per la lista di negozi.
                let storeListHtml = '';
                data.stores.forEach(store => {
                    storeListHtml += `
                                    <div class="store-item mb-3">
                                        <h5 class="store-name">${store.storeName}</h5>
                                        <p class="store-description">${store.storeDescription || 'No description available'}</p>
                                        <a href="${store.storeLink}" target="_blank" class="store-link">Visit Store</a>
                                    </div>
                                `;
                });
                // Aggiorna il contenitore con l'elenco dei negozi.
                document.getElementById("storeListContainer").innerHTML = storeListHtml;

                // Aggiorna le informazioni sulla pagina corrente.
                currentPage = data.currentPage;
                document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${data.totalPages}`;

                // Costruisce e visualizza i pulsanti di paginazione.
                let paginationHtml = '';
                for (let i = 1; i <= data.totalPages; i++) {
                    paginationHtml += `
                                    <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                                        ${i}
                                    </button>
                                `;
                }
                document.getElementById("paginationContainer").innerHTML = paginationHtml;

                // Aggiunge eventi click ai pulsanti di paginazione.
                document.querySelectorAll(".page-btn").forEach(button => {
                    button.addEventListener("click", function () {
                        const page = parseInt(this.getAttribute("data-page"));
                        fetchStores(page);
                    });
                });
            })
            .catch(error => console.error("Error fetching store data:", error));
    }

    // Aggiunge un evento al pulsante per visualizzare tutti i negozi.
    document.getElementById("viewAllStoresBtn").addEventListener("click", function () {
        currentPage = 1; // Resetta alla prima pagina.
        fetchStores(currentPage);
    });

    let currentPlatformPage = 1;
    const platformPageSize = 5;

    // Recupera e visualizza l'elenco delle piattaforme con paginazione.
    function fetchPlatforms(page) {
        fetch(`${getAllPlatformsUrl}?page=${page}&pageSize=${platformPageSize}`)
            .then(response => response.json())
            .then(data => {
                // Costruisce l'HTML per la lista delle piattaforme.
                let platformListHtml = '';
                data.platforms.forEach(platform => {
                    platformListHtml += `
                                        <div class="platform-item mb-3">
                                            <h5 class="platform-name">${platform.platformName}</h5>
                                            <p class="platform-description">${platform.platformDescription || 'No description available'}</p>
                                        </div>
                                    `;
                });
                // Aggiorna il contenitore con l'elenco delle piattaforme.
                document.getElementById("platformListContainer").innerHTML = platformListHtml;

                // Aggiorna le informazioni sulla pagina corrente.
                document.getElementById("platformPageInfo").innerText = `Page ${data.currentPage} of ${data.totalPages}`;

                // Aggiorna i pulsanti di paginazione.
                updatePaginationButtons(data.currentPage, data.totalPages);
            })
            .catch(error => console.error("Error fetching platform data:", error));
    }

    // Aggiorna i pulsanti della paginazione per le piattaforme.
    function updatePaginationButtons(currentPage, totalPages) {
        const paginationContainer = document.getElementById("platformPaginationContainer");
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `btn btn-secondary ${i === currentPage ? 'active' : ''}`;
            pageButton.innerText = i;
            pageButton.setAttribute('data-page', i);

            // Aggiunge un evento click per caricare la pagina selezionata.
            pageButton.addEventListener('click', function () {
                currentPlatformPage = i;
                fetchPlatforms(currentPlatformPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // Aggiunge un evento al pulsante per visualizzare tutte le piattaforme.
    document.getElementById("viewAllPlatformsBtn").addEventListener("click", function () {
        currentPlatformPage = 1; // Resetta alla prima pagina.
        fetchPlatforms(currentPlatformPage);
    });

    let currentLauncherPage = 1;
    const launcherPageSize = 5;

    // Recupera e visualizza l'elenco dei launcher con paginazione.
    function fetchLaunchers(page) {
        fetch(`${getAllLaunchersUrl}?page=${page}&pageSize=${launcherPageSize}`)
            .then(response => response.json())
            .then(data => {
                // Costruisce l'HTML per la lista dei launcher.
                let launcherListHtml = '';
                data.launchers.forEach(launcher => {
                    launcherListHtml += `
                                            <div class="launcher-item mb-3">
                                                <h5 class="launcher-name">${launcher.launcherName}</h5>
                                                <p class="launcher-description">${launcher.launcherDescription || 'No description available'}</p>
                                            </div>
                                        `;
                });
                // Aggiorna il contenitore con l'elenco dei launcher.
                document.getElementById("launcherListContainer").innerHTML = launcherListHtml;

                // Aggiorna le informazioni sulla pagina corrente.
                document.getElementById("launcherPageInfo").innerText = `Page ${data.currentPage} of ${data.totalPages}`;

                // Aggiorna i pulsanti di paginazione.
                updateLauncherPaginationButtons(data.currentPage, data.totalPages);
            })
            .catch(error => console.error("Error fetching launcher data:", error));
    }

    // Aggiorna i pulsanti della paginazione per i launcher.
    function updateLauncherPaginationButtons(currentPage, totalPages) {
        const paginationContainer = document.getElementById("launcherPaginationContainer");
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `btn btn-secondary ${i === currentPage ? 'active' : ''}`;
            pageButton.innerText = i;
            pageButton.setAttribute('data-page', i);

            // Aggiunge un evento click per caricare la pagina selezionata.
            pageButton.addEventListener('click', function () {
                currentLauncherPage = i;
                fetchLaunchers(currentLauncherPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    // Aggiunge un evento al pulsante per visualizzare tutti i launcher.
    document.getElementById("viewAllLaunchersBtn").addEventListener("click", function () {
        currentLauncherPage = 1; // Resetta alla prima pagina.
        fetchLaunchers(currentLauncherPage);
    });
});



let fromStoreErrorButton = false;
let fromPlatformErrorButton = false;
let fromLauncherErrorButton = false;

// Salva gli errori dei campi nel sessionStorage.
function saveFieldErrors() {
    const errors = {
        store: storeSelected.value ? null : {
            message: "Please enter a valid store or add it if you want",
            buttonHtml: `<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddStoreModal('${storeSearch.value}')">Add New Store</button>`
        },
        platform: platformSelected.value ? null : {
            message: "Please enter a valid platform or add it if you want",
            buttonHtml: '<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddPlatformModal()">Add New Platform</button>'
        },
        launcher: launcherSelected.value ? null : {
            message: "Please enter a valid launcher or add it if you want",
            buttonHtml: '<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddLauncherModal()">Add New Launcher</button>'
        }
    };
    sessionStorage.setItem("fieldErrors", JSON.stringify(errors));
}

// Ripristina gli errori salvati al caricamento della pagina.
function restoreFieldErrors() {
    const errors = JSON.parse(sessionStorage.getItem("fieldErrors"));
    if (errors) {
        if (errors.store) {
            showError(storeSearch, document.getElementById('storeSearchError'), false, errors.store.message, errors.store.buttonHtml);
        }
        if (errors.platform) {
            showError(platformSearch, document.getElementById('platformSearchError'), false, errors.platform.message, errors.platform.buttonHtml);
        }
        if (errors.launcher) {
            showError(launcherSearch, document.getElementById('launcherSearchError'), false, errors.launcher.message, errors.launcher.buttonHtml);
        }
    }
}

// Mostra o nasconde messaggi di errore per un dato campo di input.
function showError(inputElement, errorElement, isValid, customMessage = '', buttonHtml = '') {
    if (!isValid) {
        errorElement.innerHTML = `
            <div class="error-message">${customMessage}</div>
            ${buttonHtml.replace('btn btn-sm btn-primary mt-2', 'error-action-button')}
        `;
        errorElement.style.display = 'block';
        inputElement.classList.add('is-invalid');
    } else {
        errorElement.style.display = 'none';
        inputElement.classList.remove('is-invalid');
    }
}

// Valida i campi del modulo.
function validateForm() {
    let isValid = true;

    // Valida l'input del gioco.
    if (!gameSelected.value) {
        const gameButton = '<button type="button" class="btn btn-sm btn-primary mt-2" onclick="redirectToAddGame()">Add New Game</button>';
        showError(gameSearch, document.getElementById('gameSearchError'), false, "Please enter a valid game or add it if you want", gameButton);
        isValid = false;
    }

    // Valida l'input del negozio.
    if (!storeSelected.value) {
        const storeButton = `<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddStoreModal('${storeSearch.value}')">Add New Store</button>`;
        showError(storeSearch, document.getElementById('storeSearchError'), false, "Please enter a valid store or add it if you want", storeButton);
        isValid = false;
    }

    // Valida l'input della piattaforma.
    if (!platformSelected.value) {
        const platformButton = '<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddPlatformModal()">Add New Platform</button>';
        showError(platformSearch, document.getElementById('platformSearchError'), false, "Please enter a valid platform or add it if you want", platformButton);
        isValid = false;
    }

    // Valida l'input del launcher.
    if (!launcherSelected.value) {
        const launcherButton = '<button type="button" class="btn btn-sm btn-primary mt-2" onclick="openAddLauncherModal()">Add New Launcher</button>';
        showError(launcherSearch, document.getElementById('launcherSearchError'), false, "Please enter a valid launcher or add it if you want", launcherButton);
        isValid = false;
    }

    return isValid; // Restituisce lo stato di validazione.
}

// Reindirizza alla pagina "View All Games" con i parametri del gioco nella URL.
function redirectToAddGame() {
    saveFieldErrors(); // Salva gli errori correnti.

    const gameName = gameSearch.value;
    const price = document.getElementById('price').value;
    const purchaseDate = document.getElementById('purchaseDate').value;
    const notes = document.getElementById('notes').value;

    const payload = {
        store: {
            id: storeId.value,
            name: storeSearch.value,
        },
        platformName: {
            id: platformId.value,
            name: platformSearch.value,
        },
        launcherName: {
            id: launcherId.value,
            name: launcherSearch.value,
        },
        price: price,
        purchaseDate: purchaseDate,
        notes: notes
    };

    sessionStorage.setItem("payload", JSON.stringify(payload));
    window.location.href = "ViewAllGames?" +
        `gameName=${encodeURIComponent(gameName)}&` +
        `price=${encodeURIComponent(price)}&` +
        `purchaseDate=${encodeURIComponent(purchaseDate)}&` +
        `notes=${encodeURIComponent(notes)}&` +
        `fromAllViewGames=true`;
}

// Gestione del caricamento della pagina.
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('gameName');
    const newGameId = urlParams.get('gameId');

    if (gameName && newGameId) {
        const buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
        const payload = JSON.parse(sessionStorage.getItem("payload"));

        if (payload) {
            storeSearch.value = payload.store.name;
            platformSearch.value = payload.platformName.name;
            launcherSearch.value = payload.launcherName.name;
            price.value = payload.price;
            purchaseDate.value = payload.purchaseDate;
            notes.value = payload.notes;

            storeId.value = payload.store.id;
            platformId.value = payload.platformName.id;
            launcherId.value = payload.launcherName.id;

            gameSelected.value = true;
            storeSelected.value = true;
            platformSelected.value = true;
            launcherSelected.value = true;

            showError(gameSearch, document.getElementById('gameSearchError'), true);
            showError(storeSearch, document.getElementById('storeSearchError'), true);
            showError(platformSearch, document.getElementById('platformSearchError'), true);
            showError(launcherSearch, document.getElementById('launcherSearchError'), true);

            sessionStorage.removeItem("payload");
        }

        restoreFieldErrors(); // Ripristina eventuali errori salvati.

        gameSearch.value = gameName;
        gameId.value = newGameId;
        buyGameModal.show();
    }

});

// Mostra il modal per aggiungere un nuovo store.
function openAddStoreModal(storeName) {
    let buyGameModal = bootstrap.Modal.getInstance(document.getElementById('buyGameModal'));
    buyGameModal.hide();
    fromStoreErrorButton = true;
    document.getElementById('storeName').value = storeName;
    let storeModal = new bootstrap.Modal(document.getElementById('addStoreModal'));
    storeModal.show();
}

// Mostra il modal per aggiungere una nuova piattaforma.
function openAddPlatformModal() {
    let buyGameModal = bootstrap.Modal.getInstance(document.getElementById('buyGameModal'));
    buyGameModal.hide();
    document.getElementById('platformName').value = platformSearch.value;
    fromPlatformErrorButton = true;
    let platformModal = new bootstrap.Modal(document.getElementById('addPlatformModal'));
    platformModal.show();
}

// Mostra il modal per aggiungere un nuovo launcher.
function openAddLauncherModal() {
    let buyGameModal = bootstrap.Modal.getInstance(document.getElementById('buyGameModal'));
    buyGameModal.hide();
    document.getElementById('launcherName').value = launcherSearch.value;
    fromLauncherErrorButton = true;
    let launcherModal = new bootstrap.Modal(document.getElementById('addLauncherModal'));
    launcherModal.show();
}

// Gestisce l'invio dei moduli per aggiungere store, piattaforme o launcher.
function handleFormSubmit(formId, url, updateFunction, closeModal = true) {
    document.getElementById(formId).addEventListener('submit', function (e) {
        e.preventDefault(); // Previene l'invio del modulo standard.

        const formData = new FormData(this); // Crea i dati del modulo.
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (formId === 'addStoreForm') {
                        let addStoreModal = bootstrap.Modal.getInstance(document.getElementById(formId).closest('.modal'));
                        addStoreModal.hide();
                        document.getElementById(formId).reset();

                        if (fromStoreErrorButton) {
                            openBuyGameModalWithStore(data.storeName, data.storeId);
                            fromStoreErrorButton = false;
                        }

                        // Mostra il toast di successo
                        showToast('Success!', data.message, 'success');
                    } else if (formId === 'addPlatformForm') {
                        let addPlatformModal = bootstrap.Modal.getInstance(document.getElementById(formId).closest('.modal'));
                        addPlatformModal.hide();
                        document.getElementById(formId).reset();

                        if (fromPlatformErrorButton) {
                            openBuyGameModalWithPlatform(data.platformName, data.platformId);
                            fromPlatformErrorButton = false;
                        }

                        // Mostra il toast di successo
                        showToast('Success!', data.message, 'success');
                    } else if (formId === 'addLauncherForm') {
                        let addLauncherModal = bootstrap.Modal.getInstance(document.getElementById(formId).closest('.modal'));
                        addLauncherModal.hide();
                        document.getElementById(formId).reset();

                        if (fromLauncherErrorButton) {
                            openBuyGameModalWithLauncher(data.launcherName, data.launcherId);
                            fromLauncherErrorButton = false;
                        }

                        // Mostra il toast di successo
                        showToast('Success!', data.message, 'success');
                    } else {
                        updateFunction(data);
                        if (closeModal) {
                            bootstrap.Modal.getInstance(document.getElementById(formId).closest('.modal')).hide();
                        }
                        // Mostra il toast di successo
                        showToast('Success!', data.message, 'success');
                    }
                } else {
                    alert(data.message); // Mostra il messaggio di errore.
                }
            })
            .catch(error => console.error('Error:', error)); // Gestisce gli errori della richiesta.
    });
}

// Funzione per mostrare il toast
function showToast(title, message, type) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 shadow-lg custom-toast`;
    toast.role = 'alert';
    toast.ariaLive = 'assertive';
    toast.ariaAtomic = 'true';

    // Seleziona un'icona basata sul tipo di toast
    const icons = {
        success: '✅'
    };
    const icon = icons[type] || icons.info;

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <span class="toast-icon me-2">${icon}</span>
                <strong>${title}</strong> ${message}
            </div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Rimuovi il toast dopo che è scomparso
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}



// Ripristina il modal di acquisto con lo store selezionato.
function openBuyGameModalWithStore(storeName, storeId) {
    const errorMessageElement = document.getElementById('storeSearchError');
    errorMessageElement.style.display = 'none'; // Nasconde il messaggio di errore.
    errorMessageElement.innerHTML = ''; // Resetta il contenuto dell'errore.
    document.getElementById('storeSearch').value = storeName; // Imposta il nome del negozio.
    document.getElementById('storeId').value = storeId; // Imposta l'ID del negozio.
    storeSelected.value = true; // Segna lo store come selezionato.
    document.getElementById('storeSearch').classList.remove('is-invalid'); // Rimuove la classe di errore.
    let buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
    buyGameModal.show(); // Mostra il modal di acquisto.
}

// Ripristina il modal di acquisto con la piattaforma selezionata.
function openBuyGameModalWithPlatform(platformName, platformId) {
    const errorMessageElement = document.getElementById('platformSearchError');
    errorMessageElement.style.display = 'none';
    errorMessageElement.innerHTML = '';
    document.getElementById('platformSearch').value = platformName;
    document.getElementById('platformId').value = platformId;
    platformSelected.value = true;
    document.getElementById('platformSearch').classList.remove('is-invalid');
    let buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
    buyGameModal.show();
}

// Ripristina il modal di acquisto con il launcher selezionato.
function openBuyGameModalWithLauncher(launcherName, launcherId) {
    const errorMessageElement = document.getElementById('launcherSearchError');
    errorMessageElement.style.display = 'none';
    errorMessageElement.innerHTML = '';
    document.getElementById('launcherSearch').value = launcherName;
    document.getElementById('launcherId').value = launcherId;
    launcherSelected.value = true;
    document.getElementById('launcherSearch').classList.remove('is-invalid');
    let buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
    buyGameModal.show();
}

// Aggiorna il campo dello store nel modale di acquisto.
function updateStoreField(data) {
    document.getElementById('storeSearch').value = data.storeName; // Imposta il nome dello store.
    document.getElementById('storeId').value = data.storeId; // Imposta l'ID dello store.
    storeSelected.value = true;
    showError(storeSearch, document.getElementById('storeSearchError'), true); // Rimuove eventuali errori.
}

// Aggiorna il campo della piattaforma nel modale di acquisto.
function updatePlatformField(data) {
    document.getElementById('platformSearch').value = data.platformName;
    document.getElementById('platformId').value = data.platformId;
    platformSelected.value = true;
    showError(platformSearch, document.getElementById('platformSearchError'), true);
    let buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
    buyGameModal.show();
}

// Aggiorna il campo del launcher nel modale di acquisto.
function updateLauncherField(data) {
    document.getElementById('launcherSearch').value = data.launcherName;
    document.getElementById('launcherId').value = data.launcherId;
    launcherSelected.value = true;
    showError(launcherSearch, document.getElementById('launcherSearchError'), true);
    let buyGameModal = new bootstrap.Modal(document.getElementById('buyGameModal'));
    buyGameModal.show();
}

// Configura l'invio dei moduli per aggiungere store, piattaforme e launcher.
document.addEventListener('DOMContentLoaded', function () {
    handleFormSubmit('addStoreForm', '/Games/AddStore', updateStoreField); // Aggiungi store.
    handleFormSubmit('addPlatformForm', '/Games/AddPlatform', updatePlatformField); // Aggiungi piattaforma.
    handleFormSubmit('addLauncherForm', '/Games/AddLauncher', updateLauncherField); // Aggiungi launcher.
});

// Resetta i campi quando il modale di acquisto viene chiuso.
document.getElementById('buyGameModal').addEventListener('hidden.bs.modal', function (e) {
    if (!document.querySelector('.modal.show')) { // Controlla se non ci sono altri modali aperti.
        gameSearch.value = '';
        storeSearch.value = '';
        platformSearch.value = '';
        launcherSearch.value = '';
        gameId.value = '';
        storeId.value = '';
        platformId.value = '';
        launcherId.value = '';
    }
});

// Valida il modulo prima dell'invio.
document.getElementById('buyGameForm').addEventListener('submit', function (event) {
    if (!validateForm()) {
        event.preventDefault(); // Previene l'invio del modulo se non è valido.
    }
});


// Gestisce la selezione di un suggerimento nelle ricerche.
function selectSuggestion(inputElement, hiddenInputElement, selectedItem, flagRef, errorElement) {
    inputElement.value = selectedItem.textContent; // Imposta il testo selezionato.
    hiddenInputElement.value = selectedItem.dataset.id; // Imposta l'ID selezionato.
    flagRef.value = true; // Segna come selezionato.
    showError(inputElement, errorElement, true); // Rimuove eventuali errori.
    document.querySelectorAll('.search-results').forEach(results => {
        results.style.display = 'none'; // Nasconde i risultati di ricerca.
    });
}

// Ricerca e gestione dei suggerimenti per i giochi.
const gameSelected = { value: false };
gameSearch.addEventListener('input', function () {
    gameSelected.value = false;
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        fetch(`/Games/SearchGames?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(games => {
                gameSearchResults.innerHTML = '';
                if (games.length > 0) {
                    games.forEach(game => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = game.gameName;
                        div.dataset.id = game.gameId;
                        div.addEventListener('mousedown', () => {
                            selectSuggestion(gameSearch, gameId, div, gameSelected, document.getElementById('gameSearchError'));
                        });
                        gameSearchResults.appendChild(div);
                    });
                    gameSearchResults.style.display = 'block';
                } else {
                    gameSearchResults.style.display = 'none';
                }
            });
    } else {
        gameSearchResults.style.display = 'none';
    }
});

// Ricerca e gestione dei suggerimenti per i negozi.
const storeSelected = { value: false };
storeSearch.addEventListener('input', function () {
    storeSelected.value = false;
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        fetch(`/Games/SearchStores?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(stores => {
                storeSearchResults.innerHTML = '';
                if (stores.length > 0) {
                    stores.forEach(store => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = store.storeName;
                        div.dataset.id = store.storeId;
                        div.addEventListener('mousedown', () => {
                            selectSuggestion(storeSearch, storeId, div, storeSelected, document.getElementById('storeSearchError'));
                        });
                        storeSearchResults.appendChild(div);
                    });
                    storeSearchResults.style.display = 'block';
                } else {
                    storeSearchResults.style.display = 'none';
                }
            });
    } else {
        storeSearchResults.style.display = 'none';
    }
});

// Ricerca e gestione dei suggerimenti per le piattaforme.
const platformSelected = { value: false };
platformSearch.addEventListener('input', function () {
    platformSelected.value = false;
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        fetch(`/Games/SearchPlatforms?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(platforms => {
                platformSearchResults.innerHTML = '';
                if (platforms.length > 0) {
                    platforms.forEach(platform => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = platform.platformName;
                        div.dataset.id = platform.platformId;
                        div.addEventListener('mousedown', () => {
                            selectSuggestion(platformSearch, platformId, div, platformSelected, document.getElementById('platformSearchError'));
                        });
                        platformSearchResults.appendChild(div);
                    });
                    platformSearchResults.style.display = 'block';
                } else {
                    platformSearchResults.style.display = 'none';
                }
            });
    } else {
        platformSearchResults.style.display = 'none';
    }
});

// Ricerca e gestione dei suggerimenti per i launcher.
const launcherSelected = { value: false };
launcherSearch.addEventListener('input', function () {
    launcherSelected.value = false;
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        fetch(`/Games/SearchLaunchers?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(launchers => {
                launcherSearchResults.innerHTML = '';
                if (launchers.length > 0) {
                    launchers.forEach(launcher => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = launcher.launcherName;
                        div.dataset.id = launcher.launcherId;
                        div.addEventListener('mousedown', () => {
                            selectSuggestion(launcherSearch, launcherId, div, launcherSelected, document.getElementById('launcherSearchError'));
                        });
                        launcherSearchResults.appendChild(div);
                    });
                    launcherSearchResults.style.display = 'block';
                } else {
                    launcherSearchResults.style.display = 'none';
                }
            });
    } else {
        launcherSearchResults.style.display = 'none';
    }
});

// Nasconde i suggerimenti di ricerca quando si clicca al di fuori dei container.
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
        document.querySelectorAll('.search-results').forEach(results => {
            results.style.display = 'none';
        });
    }
});

// Nasconde automaticamente i messaggi di successo o errore dopo 3 secondi.
document.addEventListener("DOMContentLoaded", function () {
    const successMessage = document.querySelector(".alert-success");
    if (successMessage) {
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }
    const errorMessage = document.querySelector(".alert-danger");
    if (errorMessage) {
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }
});

document.getElementById('storeSearch').addEventListener('input', function () {
    const inputValue = this.value;
    validateStoreInput(inputValue);
});
function validateStoreInput(inputValue) {
    const errorMessageElement = document.getElementById('storeSearchError');
    const storeInput = document.getElementById('storeSearch');
    if (existingStores.includes(inputValue)) {
        errorMessageElement.style.display = 'none';
        storeInput.classList.remove('is-invalid');
    } else {
        errorMessageElement.style.display = 'block';
        errorMessageElement.innerHTML = 'Store not found. Please select from the dropdown or create a new store.';
        storeInput.classList.add('is-invalid');
    }
}
function showDropdownSuggestions() {
    const storeSearchResults = document.getElementById('storeSearchResults');
    storeSearchResults.style.display = 'block';
}
document.getElementById('storeSearch').addEventListener('input', function () {
    showDropdownSuggestions();
});
document.addEventListener("DOMContentLoaded", function () {
    const purchaseDateInput = document.getElementById("purchaseDate");
    const today = new Date().toISOString().split("T")[0];
    purchaseDateInput.value = today;
});

async function checkDuplicatePurchase(event) {
    event.preventDefault();

    const gameId = document.getElementById("gameId").value;
    const storeId = document.getElementById("storeId").value;
    const platformId = document.getElementById("platformId").value;
    const launcherId = document.getElementById("launcherId").value;

    if (!gameId || !storeId || !platformId || !launcherId) {
        alert("Please select a valid game, store, platform, and launcher.");
        return false;
    }

    try {
        const response = await fetch(`/Games/CheckDuplicatePurchase?gameId=${gameId}&storeId=${storeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();
        if (result.isDuplicate) {
            const confirmAdd = confirm("You have already purchased this game from this store. Are you sure you want to continue?");

            if (confirmAdd) {
                document.getElementById("buyGameForm").submit();
            } else {
                document.getElementById("buyGameForm").reset();
            }
            return false;
        }
    } catch (error) {
        console.error("Error checking duplicate purchase:", error);
        alert("An error occurred while checking duplicate purchases.");
        return false;
    }
    document.getElementById("buyGameForm").submit();
    return true;
}






document.querySelector('.btn.btn-primary').addEventListener('click', function () {
    // Get the selected profile image value from the radio buttons
    const selectedImage = document.querySelector('input[name="profileImage"]:checked');

    if (selectedImage) {
        // Get the value (e.g., 'image1', 'image2', 'image3')
        let imageName = selectedImage.value;

        // Update the profile image shown on the page
        let profileImage = document.getElementById('userProfileImage');

        // Based on the selected image, set the corresponding image URL
        if (imageName === 'image1') {
            profileImage.src = "/images/avatar2.jpeg"; // Image 1 URL
        } else if (imageName === 'image2') {
            profileImage.src = "/images/avatar3.jpg"; // Image 2 URL
        } else if (imageName === 'image3') {
            profileImage.src = "/images/avatar4.jpg"; // Image 3 URL
        }

        // Close the modal after saving changes
        var modal = bootstrap.Modal.getInstance(document.getElementById('editAvatarModal'));
        modal.hide();
    } else {
        alert('Please select an image.');
    }
});





