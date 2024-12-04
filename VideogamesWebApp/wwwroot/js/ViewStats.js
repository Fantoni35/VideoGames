// Elementi HTML per la ricerca dei negozi
const storeSearch = document.getElementById('storeSearch');
const storeSearchResults = document.getElementById('storeSearchResults');
const storeSearchError = document.getElementById('storeSearchError');
const storeId = document.getElementById('storeId');

// Elementi HTML per la ricerca delle piattaforme
const platformSearch = document.getElementById('platformSearch');
const platformSearchResults = document.getElementById('platformSearchResults');
const platformSearchError = document.getElementById('platformSearchError');
const platformId = document.getElementById('platformId');

// Elementi HTML per la ricerca dei launcher
const launcherSearch = document.getElementById('launcherSearch');
const launcherSearchResults = document.getElementById('launcherSearchResults');
const launcherSearchError = document.getElementById('launcherSearchError');
const launcherId = document.getElementById('launcherId');

// Funzionalità di ricerca per i negozi
storeSearch.addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        // Richiesta AJAX per cercare i negozi basata sulla query inserita
        fetch(`/Games/SearchStores?query=${encodeURIComponent(searchQuery)}`)
            .then(response => response.json())
            .then(stores => {
                storeSearchResults.innerHTML = '';
                if (stores.length > 0) {
                    // Mostra i risultati della ricerca
                    stores.forEach(store => {
                        const div = document.createElement('div');
                        div.className = 'search-result-item';
                        div.textContent = store.storeName;
                        div.dataset.id = store.storeId;
                        div.addEventListener('mousedown', () => {
                            // Selezione di un negozio dalla lista dei suggerimenti
                            selectSuggestion(storeSearch, storeId, div, { value: true }, storeSearchError);
                        });
                        storeSearchResults.appendChild(div);
                    });
                    storeSearchResults.style.display = 'block';
                } else {
                    // Nasconde i risultati se non ci sono match
                    storeSearchResults.style.display = 'none';
                }
            });
    } else {
        storeSearchResults.style.display = 'none';
    }
});

// Funzionalità di ricerca per le piattaforme
platformSearch.addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        // Richiesta AJAX per cercare piattaforme basata sulla query inserita
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
                            // Selezione di una piattaforma dalla lista dei suggerimenti
                            selectSuggestion(platformSearch, platformId, div, { value: true }, platformSearchError);
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

// Funzionalità di ricerca per i launcher
launcherSearch.addEventListener('input', function () {
    const searchQuery = this.value.trim().toLowerCase();
    if (searchQuery.length > 0) {
        // Richiesta AJAX per cercare launcher basata sulla query inserita
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
                            // Selezione di un launcher dalla lista dei suggerimenti
                            selectSuggestion(launcherSearch, launcherId, div, { value: true }, launcherSearchError);
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

// Eventi per il caricamento iniziale della pagina
document.addEventListener('DOMContentLoaded', function () {
    const applyFiltersButton = document.getElementById('applyFiltersButton');
    const resetFiltersButton = document.getElementById('resetFiltersButton');
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
    const activeFiltersText = document.getElementById('activeFiltersText');

    // Aggiorna la lista dei filtri attivi
    function updateActiveFilters(storeName = null, platformName = null, launcherName = null) {
        const activeFilters = [];

        if (storeName) activeFilters.push(`Store: ${storeName}`);
        if (platformName) activeFilters.push(`Platform: ${platformName}`);
        if (launcherName) activeFilters.push(`Launcher: ${launcherName}`);

        activeFiltersText.textContent = activeFilters.length > 0 ? `Filtered by: ${activeFilters.join(' | ')}` : 'Filtered by:';

        if (activeFilters.length > 0) {
            activeFiltersContainer.style.display = 'block';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    // Funzione per resettare i filtri
    function resetFilters() {
        // Resetta i campi di input
        storeSearch.value = '';
        storeId.value = '';
        platformSearch.value = '';
        platformId.value = '';
        launcherSearch.value = '';
        launcherId.value = '';

        // Nasconde i risultati della ricerca e i filtri attivi
        storeSearchResults.style.display = 'none';
        platformSearchResults.style.display = 'none';
        launcherSearchResults.style.display = 'none';
        activeFiltersContainer.style.display = 'none';
        activeFiltersText.textContent = 'Filtered by:';

        // Richiede al server di ripristinare le statistiche
        fetch('/Games/ViewStats')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Aggiorna dinamicamente le statistiche nella pagina
                document.getElementById('totalSpentStat').textContent =
                    doc.getElementById('totalSpentStat').textContent;
                document.getElementById('totalGamesStat').textContent =
                    doc.getElementById('totalGamesStat').textContent;
                document.getElementById('averagePriceStat').textContent =
                    doc.getElementById('averagePriceStat').textContent;
                document.getElementById('mostActiveDayStat').textContent =
                    doc.getElementById('mostActiveDayStat').textContent;
                document.getElementById('virtualGamesStat').textContent =
                    doc.getElementById('virtualGamesStat').textContent;
                document.getElementById('lastPurchaseStat').textContent =
                    doc.getElementById('lastPurchaseStat').textContent;
                document.getElementById('mostExpensiveGameStat').textContent =
                    doc.getElementById('mostExpensiveGameStat').textContent;

                // Aggiorna le tabelle
                document.getElementById('daysOfWeekTableBody').innerHTML =
                    doc.getElementById('daysOfWeekTableBody').innerHTML;
                document.getElementById('monthsTableBody').innerHTML =
                    doc.getElementById('monthsTableBody').innerHTML;
            })
            .catch(error => {
                console.error('Errore durante il ripristino delle statistiche:', error);
                alert('Errore durante il ripristino delle statistiche');
            });
    }

    // Listener per il pulsante di reset
    resetFiltersButton.addEventListener('click', function () {
        resetFilters();
    });

    // Listener per il pulsante di applicazione dei filtri
    applyFiltersButton.addEventListener('click', function () {
        const storeIdValue = document.getElementById('storeId').value || null;
        const platformIdValue = document.getElementById('platformId').value || null;
        const launcherIdValue = document.getElementById('launcherId').value || null;

        // Recupera i nomi dei filtri selezionati
        const storeName = storeIdValue ? storeSearch.value : null;
        const platformName = platformIdValue ? platformSearch.value : null;
        const launcherName = launcherIdValue ? launcherSearch.value : null;

        // Costruisce l'URL con i parametri dei filtri
        const url = `/Games/ViewStats?${storeIdValue ? `storeId=${storeIdValue}&` : ''}${platformIdValue ? `platformId=${platformIdValue}&` : ''}${launcherIdValue ? `launcherId=${launcherIdValue}` : ''}`;

        // Aggiorna i filtri attivi prima di applicarli
        updateActiveFilters(storeName, platformName, launcherName);

        // Richiesta AJAX per aggiornare le statistiche
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Aggiorna dinamicamente le statistiche
                document.getElementById('totalSpentStat').textContent =
                    doc.getElementById('totalSpentStat').textContent;
                document.getElementById('totalGamesStat').textContent =
                    doc.getElementById('totalGamesStat').textContent;
                document.getElementById('averagePriceStat').textContent =
                    doc.getElementById('averagePriceStat').textContent;
                document.getElementById('mostActiveDayStat').textContent =
                    doc.getElementById('mostActiveDayStat').textContent;
                document.getElementById('virtualGamesStat').textContent =
                    doc.getElementById('virtualGamesStat').textContent;
                document.getElementById('lastPurchaseStat').textContent =
                    doc.getElementById('lastPurchaseStat').textContent;
                document.getElementById('mostExpensiveGameStat').textContent =
                    doc.getElementById('mostExpensiveGameStat').textContent;

                // Aggiorna le tabelle
                document.getElementById('daysOfWeekTableBody').innerHTML =
                    doc.getElementById('daysOfWeekTableBody').innerHTML;
                document.getElementById('monthsTableBody').innerHTML =
                    doc.getElementById('monthsTableBody').innerHTML;

                // Chiude il modal dopo aver applicato i filtri
                filterModal.hide();
            })
            .catch(error => {
                console.error('Errore durante l\'aggiornamento delle statistiche:', error);
                alert('Errore durante l\'aggiornamento delle statistiche');
            });
    });
});

// crea il pdf con le stats
document.getElementById('createPdfButton').addEventListener('click', function () {
    
    const titleElement = document.createElement('div');
    titleElement.textContent = 'Recap Stats';

    
    titleElement.style.textAlign = 'center'; 
    titleElement.style.marginBottom = '20px'; 
    titleElement.style.fontSize = '32px'; 
    titleElement.style.fontWeight = 'bold'; 
    titleElement.style.lineHeight = '1.2'; 

   
    const element = document.getElementById('statsContainer');

    
    const clone = element.cloneNode(true);

    
    const pdfContent = document.createElement('div');
    pdfContent.appendChild(titleElement); 
    pdfContent.appendChild(clone);

    
    const daysOfWeekTable = document.getElementById('daysOfWeekTable').cloneNode(true);
    const monthsTable = document.getElementById('monthsTable').cloneNode(true);

    pdfContent.appendChild(daysOfWeekTable); 
    pdfContent.appendChild(monthsTable); 

    const options = {
        margin: 1,
        filename: 'stats.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    
    html2pdf().from(pdfContent).set(options).save();
});

