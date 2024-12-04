const storeSearch = document.getElementById('storeSearch');
const storeSearchResults = document.getElementById('storeSearchResults');
const storeSearchError = document.getElementById('storeSearchError');
const storeId = document.getElementById('storeId');

const platformSearch = document.getElementById('platformSearch');
const platformSearchResults = document.getElementById('platformSearchResults');
const platformSearchError = document.getElementById('platformSearchError');
const platformId = document.getElementById('platformId');

const launcherSearch = document.getElementById('launcherSearch');
const launcherSearchResults = document.getElementById('launcherSearchResults');
const launcherSearchError = document.getElementById('launcherSearchError');
const launcherId = document.getElementById('launcherId');



storeSearch.addEventListener('input', function () {
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
                            selectSuggestion(storeSearch, storeId, div, { value: true }, storeSearchError);
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

platformSearch.addEventListener('input', function () {
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

launcherSearch.addEventListener('input', function () {
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

document.addEventListener('DOMContentLoaded', function () {
    const applyFiltersButton = document.getElementById('applyFiltersButton');
    const resetFiltersButton = document.getElementById('resetFiltersButton');
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    const activeFiltersContainer = document.getElementById('activeFiltersContainer');
    const activeFiltersText = document.getElementById('activeFiltersText');

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

    // Function to reset filters and update the stats
    function resetFilters() {
        // Reset input fields
        storeSearch.value = '';
        storeId.value = '';
        platformSearch.value = '';
        platformId.value = '';
        launcherSearch.value = '';
        launcherId.value = '';

        // Hide search results
        storeSearchResults.style.display = 'none';
        platformSearchResults.style.display = 'none';
        launcherSearchResults.style.display = 'none';

        // Hide the active filters text
        activeFiltersContainer.style.display = 'none';

        // Reset the "Filtered by" label to just "Filtered by:"
        activeFiltersText.textContent = 'Filtered by:';

        // AJAX request to reset the statistics
        fetch('/Games/ViewStats')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Update the statistics dynamically
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

                // Update the tables
                document.getElementById('daysOfWeekTableBody').innerHTML =
                    doc.getElementById('daysOfWeekTableBody').innerHTML;
                document.getElementById('monthsTableBody').innerHTML =
                    doc.getElementById('monthsTableBody').innerHTML;
            })
            .catch(error => {
                console.error('Error resetting statistics:', error);
                alert('Errore durante il ripristino delle statistiche');
            });
    }

    // Listener for the reset button
    resetFiltersButton.addEventListener('click', function () {
        resetFilters();
    });

    applyFiltersButton.addEventListener('click', function () {
        const storeIdValue = document.getElementById('storeId').value || null;
        const platformIdValue = document.getElementById('platformId').value || null;
        const launcherIdValue = document.getElementById('launcherId').value || null;

        // Get the names of selected filters
        const storeName = storeIdValue ? storeSearch.value : null;
        const platformName = platformIdValue ? platformSearch.value : null;
        const launcherName = launcherIdValue ? launcherSearch.value : null;

        // Construct the URL with filter parameters
        const url = `/Games/ViewStats?${storeIdValue ? `storeId=${storeIdValue}&` : ''}${platformIdValue ? `platformId=${platformIdValue}&` : ''}${launcherIdValue ? `launcherId=${launcherIdValue}` : ''}`;

        // Update active filters before applying them
        updateActiveFilters(storeName, platformName, launcherName);

        // AJAX request to update the statistics
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Update the statistics dynamically
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

                // Update the tables
                document.getElementById('daysOfWeekTableBody').innerHTML =
                    doc.getElementById('daysOfWeekTableBody').innerHTML;
                document.getElementById('monthsTableBody').innerHTML =
                    doc.getElementById('monthsTableBody').innerHTML;

                // Close the modal after applying filters
                filterModal.hide();
            })
            .catch(error => {
                console.error('Error updating statistics:', error);
                alert('Errore durante l\'aggiornamento delle statistiche');
            });
    });

    // Reset fields and hide results when the modal is closed
    document.getElementById('filterModal').addEventListener('hidden.bs.modal', function () {
        storeSearch.value = '';
        storeId.value = '';
        platformSearch.value = '';
        platformId.value = '';
        launcherSearch.value = '';
        launcherId.value = '';

        // Hide the search results
        storeSearchResults.style.display = 'none';
        platformSearchResults.style.display = 'none';
        launcherSearchResults.style.display = 'none';

    });
});

document.getElementById('createPdfButton').addEventListener('click', function () {

    // Crea un nuovo elemento per il titolo
    const titleElement = document.createElement('div');
    titleElement.textContent = 'Recap Stats';
    titleElement.style.textAlign = 'center'; // Centra il titolo
    titleElement.style.marginBottom = '20px'; // Aggiungi margine sotto il titolo
    titleElement.style.fontSize = '24px'; // Imposta la dimensione del font
    titleElement.style.fontWeight = 'bold'; // Rendi il titolo in grassetto

    // Seleziona l'elemento da convertire
    const element = document.getElementById('statsContainer');

    // Clona l'elemento per non modificarlo nel DOM
    const clone = element.cloneNode(true);

    // Aggiungi il titolo all'inizio del clone
    clone.insertBefore(titleElement, clone.firstChild);

    const options = {
        margin: 1,
        filename: 'stats.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Genera il PDF dal clone
    html2pdf().from(clone).set(options).save();
});