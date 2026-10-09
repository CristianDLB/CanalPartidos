document.addEventListener("DOMContentLoaded", () => {
    // Estado Global
    let currentStreamUrl = "";

    // Referencias DOM
    const btnReload = document.getElementById("btnReload");
    const btnFixture = document.getElementById("btnFixture");
    const btnCustomUrlNav = document.getElementById("btnCustomUrlNav");

    const fixturePanel = document.getElementById("fixturePanel");
    const closeFixtureBtn = document.getElementById("closeFixtureBtn");

    const streamContainer = document.getElementById("streamContainer");
    const streamControls = document.getElementById("streamControls");
    const btnCloseStream = document.getElementById("btnCloseStream");

    const urlModal = document.getElementById("urlModal");
    const customUrlInput = document.getElementById("customUrlInput");
    const clearInputBtn = document.getElementById("clearInputBtn");
    const cancelModalBtn = document.getElementById("cancelModal");
    const acceptModalBtn = document.getElementById("acceptModal");
    const closeModalX = document.getElementById("closeModalX");

    const liveClockElement = document.getElementById("liveClock");
    const clockZoneElement = document.getElementById("clockZone");

    // 1. RECARGAR REPRODUCTOR (Sin recargar la página entera)
    btnReload.addEventListener("click", () => {
        const iframe = streamContainer.querySelector("iframe");
        if (iframe && currentStreamUrl) {
            const currentSrc = iframe.src;
            iframe.src = "about:blank";
            setTimeout(() => {
                iframe.src = currentSrc;
            }, 100);
        }

        const icon = btnReload.querySelector("i");
        icon.classList.add("fa-spin");
        setTimeout(() => {
            icon.classList.remove("fa-spin");
        }, 800);
    });

    // 2. MOSTRAR / OCULTAR FIXTURE 365SCORES
btnFixture.addEventListener("click", () => {
        fixturePanel.classList.toggle("hidden");

        // Dispara la re-evaluación del tamaño de los menús dentro del reproductor
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 150);
    });

closeFixtureBtn.addEventListener("click", () => {
        fixturePanel.classList.add("hidden");

        // Dispara la re-evaluación del tamaño de los menús dentro del reproductor
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 150);
    });
    // 3. MODAL DE URL PERSONALIZADA
    function openUrlModal() {
        customUrlInput.value = currentStreamUrl;
        urlModal.classList.remove("hidden");
        customUrlInput.focus();
    }

    function closeUrlModal() {
        urlModal.classList.add("hidden");
    }

    btnCustomUrlNav.addEventListener("click", openUrlModal);
    cancelModalBtn.addEventListener("click", closeUrlModal);
    closeModalX.addEventListener("click", closeUrlModal);

    clearInputBtn.addEventListener("click", () => {
        customUrlInput.value = "";
        customUrlInput.focus();
    });

    /* RELOJ EN TIEMPO REAL CON LUXON */
    function initLiveClock() {
        if (!liveClockElement) return;

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (clockZoneElement) {
            clockZoneElement.textContent = userTimeZone;
        }

        function updateClock() {
            const now = luxon.DateTime.now().setZone(userTimeZone);
            liveClockElement.textContent = now.toFormat("HH:mm:ss");
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    // CARGAR STREAM EN ESTRUCTURA VISUAL COMPLETA MULTICAMS
    acceptModalBtn.addEventListener("click", () => {
        const newUrl = customUrlInput.value.trim();
        if (newUrl) {
            loadStream(newUrl);
        } else {
            clearStream();
        }
        closeUrlModal();
    });

    function loadStream(url) {
        currentStreamUrl = url;

        // Renderiza el contenedor de video completo con atributos para evitar el scroll
        streamContainer.innerHTML = `
            <div class="stream-controls" id="streamControls">
                <button id="btnCloseStream" class="btn-close-stream" title="Cerrar Transmisión">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="iframe-wrapper">
                <iframe 
                    src="${url}" 
                    scrolling="no"
                    frameborder="0"
                    marginwidth="0"
                    marginheight="0"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen" 
                    allowfullscreen>
                </iframe>
            </div>
        `;
        // sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation" EN IFRAME
        // Re-vincular evento de cierre para el botón dinámico
        document.getElementById("btnCloseStream").addEventListener("click", clearStream);
    }

    if (btnCloseStream) {
        btnCloseStream.addEventListener("click", clearStream);
    }

    function clearStream() {
        currentStreamUrl = "";
        streamContainer.innerHTML = `
            <div class="stream-controls hidden" id="streamControls">
                <button id="btnCloseStream" class="btn-close-stream" title="Cerrar Transmisión">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="placeholder" id="streamPlaceholder">
                <i class="fa-solid fa-circle-play placeholder-icon"></i>
                <span>Ingresa una URL Personalizada para iniciar</span>
            </div>
        `;
    }

    initLiveClock();
});