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

function loadDLCs(mainGameId, gameName) {
    document.getElementById("mainGameTitle").textContent = `DLCs for ${gameName}`;

    fetch(`/Games/GetDLCs?mainGameId=${mainGameId}`)
        .then(response => response.json())
        .then(dlcList => {
            const dlcListElement = document.getElementById("dlcList");
            dlcListElement.innerHTML = "";
            if (dlcList.length === 0) {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item text-muted";
                listItem.textContent = "No DLCs found for this game.";
                dlcListElement.appendChild(listItem);
            } else {
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
        .catch(error => console.error('Error fetching DLCs:', error));
}
const urlParams = new URLSearchParams(window.location.search);
const gameName = urlParams.get('gameName');

if (gameName) {
    const gameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
    document.getElementById('gameNameInput').value = gameName;
    fromAllViewGames.value = urlParams.get('fromAllViewGames');
    gameModal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash === '#addGameModal') {
        var addGameModal = new bootstrap.Modal(document.getElementById('addGameModal'));
        addGameModal.show();
    }
});

let currentMainGameId = null;
let currentGameName = null;

function loadDLCs(mainGameId, gameName, page = 1) {
    currentMainGameId = mainGameId;
    currentGameName = gameName;

    document.getElementById("mainGameTitle").textContent = `DLCs for ${gameName}`;

    fetch(`/Games/GetDLCs?mainGameId=${mainGameId}&page=${page}`)
        .then(response => response.json())
        .then(result => {
            const dlcListElement = document.getElementById("dlcList");
            const paginationElement = document.getElementById("dlcPagination");
            dlcListElement.innerHTML = "";
            paginationElement.innerHTML = "";

            if (result.dlcs.length === 0) {
                const listItem = document.createElement("li");
                listItem.className = "list-group-item text-muted";
                listItem.textContent = "No DLCs found for this game.";
                dlcListElement.appendChild(listItem);
            } else {
                result.dlcs.forEach(dlc => {
                    const listItem = document.createElement("li");
                    listItem.className = "list-group-item";
                    listItem.innerHTML = `
                                                                                                                    <i class="fas fa-gamepad me-2 text-primary"></i>
                                                                                                                    <strong>${dlc.gameName}</strong>
                                                                                                                `;
                    dlcListElement.appendChild(listItem);
                });

                if (result.totalPages > 1) {
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
        .catch(error => console.error('Error fetching DLCs:', error));

}