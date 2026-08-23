/* =========================
   THEME
========================= */

const themeButton =
    document.getElementById("themeButton");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    if (themeButton) {
        themeButton.textContent = "☀️";
    }

}


if (themeButton) {

    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

        const light =
            document.body.classList.contains("light-mode");

        localStorage.setItem(
            "theme",
            light ? "light" : "dark"
        );

        themeButton.textContent =
            light ? "☀️" : "🌙";

        showToast(
            light
                ? "☀️ Light Mode aktiviert"
                : "🌙 Dark Mode aktiviert"
        );

    });

}


/* =========================
   MOBILE MENU
========================= */

const menuButton =
    document.getElementById("menuButton");

const mobileMenu =
    document.getElementById("mobileMenu");


if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", function () {

        mobileMenu.classList.toggle("active");

        menuButton.textContent =
            mobileMenu.classList.contains("active")
                ? "✕"
                : "☰";

    });


    const mobileLinks =
        mobileMenu.querySelectorAll("a");


    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.classList.remove("active");

            menuButton.textContent = "☰";

        });

    });

}


/* =========================
   GAME SYSTEM
========================= */

const gameSearch =
    document.getElementById("gameSearch");

const gameSort =
    document.getElementById("gameSort");

const categoryButtons =
    document.querySelectorAll(".category-button");

const gameGrid =
    document.querySelector(".cards");

const gameCards =
    Array.from(
        document.querySelectorAll(".game-card")
    );


let selectedCategory = "all";

let searchText = "";


/* Wenn keine Game-Karten vorhanden sind,
   wird das Game-System nicht ausgeführt. */

if (gameCards.length > 0 && gameGrid) {


    /* =========================
       FAVORITES
    ========================= */

    let favorites = [];

    try {

        favorites =
            JSON.parse(
                localStorage.getItem("gameFavorites")
            ) || [];

    } catch (error) {

        favorites = [];

    }


    function updateFavoriteButtons() {

        document
            .querySelectorAll(".favorite-button")
            .forEach(function (button) {

                const game =
                    button.dataset.game;


                if (favorites.includes(game)) {

                    button.textContent = "★";

                    button.classList.add(
                        "favorite"
                    );

                    button.title =
                        "Aus Favoriten entfernen";

                } else {

                    button.textContent = "☆";

                    button.classList.remove(
                        "favorite"
                    );

                    button.title =
                        "Zu Favoriten hinzufügen";

                }

            });

    }


    updateFavoriteButtons();


    /* =========================
       FAVORIT KLICK
    ========================= */

    document
        .querySelectorAll(".favorite-button")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const game =
                        button.dataset.game;


                    if (!game) return;


                    if (favorites.includes(game)) {

                        favorites =
                            favorites.filter(
                                function (item) {

                                    return item !== game;

                                }
                            );


                        showToast(
                            "☆ " +
                            game +
                            " entfernt"
                        );

                    } else {

                        favorites.push(game);


                        showToast(
                            "⭐ " +
                            game +
                            " zu Favoriten hinzugefügt"
                        );

                    }


                    localStorage.setItem(
                        "gameFavorites",
                        JSON.stringify(favorites)
                    );


                    updateFavoriteButtons();

                    filterGames();

                }
            );

        });


    /* =========================
       SUCHE
    ========================= */

    if (gameSearch) {

        gameSearch.addEventListener(
            "input",
            function () {

                searchText =
                    gameSearch.value
                        .toLowerCase()
                        .trim();


                filterGames();

            }
        );

    }


    /* =========================
       KATEGORIEN
    ========================= */

    categoryButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    categoryButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedCategory =
                        button.dataset.category ||
                        "all";


                    filterGames();

                }
            );

        }
    );


    /* =========================
       SORTIERUNG
    ========================= */

    if (gameSort) {

        gameSort.addEventListener(
            "change",
            function () {

                filterGames();

            }
        );

    }


    /* =========================
       FILTER + SORT
    ========================= */

    function filterGames() {

        let visibleGames =
            gameCards.filter(
                function (card) {

                    const name =
                        (
                            card.dataset.name ||
                            card.textContent ||
                            ""
                        )
                            .toLowerCase();


                    const category =
                        card.dataset.category ||
                        "";


                    const matchesSearch =
                        name.includes(searchText);


                    const matchesCategory =
                        selectedCategory === "all" ||
                        category === selectedCategory;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );


        /* =========================
           SORTIERUNG
        ========================= */

        const sort =
            gameSort
                ? gameSort.value
                : "default";


        if (sort === "az") {

            visibleGames.sort(
                function (a, b) {

                    return (
                        (a.dataset.name || "")
                            .localeCompare(
                                b.dataset.name || ""
                            )
                    );

                }
            );

        }


        if (sort === "za") {

            visibleGames.sort(
                function (a, b) {

                    return (
                        (b.dataset.name || "")
                            .localeCompare(
                                a.dataset.name || ""
                            )
                    );

                }
            );

        }


        if (sort === "favorites") {

            visibleGames.sort(
                function (a, b) {

                    const aFavorite =
                        favorites.includes(
                            a.dataset.name
                        );


                    const bFavorite =
                        favorites.includes(
                            b.dataset.name
                        );


                    return (
                        Number(bFavorite) -
                        Number(aFavorite)
                    );

                }
            );

        }


        /* =========================
           KARTEN ANZEIGEN
        ========================= */

        gameCards.forEach(
            function (card) {

                card.style.display = "none";

            }
        );


        visibleGames.forEach(
            function (card) {

                card.style.display = "";

                gameGrid.appendChild(card);

            }
        );

    }


    /* Initial */

    filterGames();

}


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(element);

        }
    );

} else {

    revealElements.forEach(
        function (element) {

            element.classList.add("visible");

        }
    );

}


/* =========================
   TOP BUTTON
========================= */

const topButton =
    document.getElementById("topButton");


if (topButton) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 500) {

                topButton.classList.add("show");

            } else {

                topButton.classList.remove("show");

            }

        }
    );


    topButton.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================
   TOAST
========================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove("show");

        },
        2500
    );

}


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            showToast(
                "✅ Nachricht wurde vorbereitet!"
            );


            contactForm.reset();

        }
    );

}


/* =========================
   ANIMATED STATS
========================= */

const stats =
    document.querySelectorAll(".stat-number");


if ("IntersectionObserver" in window) {

    const statsObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const element =
                            entry.target;


                        const target =
                            Number(
                                element.dataset.target
                            );


                        let current = 0;


                        const increment =
                            target / 60;


                        const counter =
                            setInterval(
                                function () {

                                    current +=
                                        increment;


                                    if (
                                        current >=
                                        target
                                    ) {

                                        current =
                                            target;


                                        clearInterval(
                                            counter
                                        );

                                    }


                                    element.textContent =
                                        Math.floor(
                                            current
                                        );

                                },
                                20
                            );


                        statsObserver.unobserve(
                            element
                        );

                    }
                );

            }
        );


    stats.forEach(
        function (stat) {

            statsObserver.observe(stat);

        }
    );

}


/* =========================
   BROWSER GAME
========================= */

const target =
    document.getElementById("gameTarget");

const scoreElement =
    document.getElementById("gameScore");


let score = 0;


if (target && scoreElement) {

    target.addEventListener(
        "click",
        function () {

            score++;


            scoreElement.textContent =
                score;


            showToast(
                "🎯 Treffer!"
            );


            target.style.transform =
                "scale(0.8)";


            setTimeout(
                function () {

                    target.style.transform =
                        "scale(1)";

                },
                100
            );

        }
    );

}

/* =========================
   GAMING HUB
========================= */


/* =========================
   CURRENTLY PLAYING
========================= */

const currentlyPlaying =
    document.getElementById("currentlyPlaying");

const changePlaying =
    document.getElementById("changePlaying");


const playingGames = [
    "Minecraft",
    "Roblox",
    "Geometry Dash"
];


let playingIndex =
    Number(
        localStorage.getItem("playingIndex")
    ) || 0;


function updateCurrentlyPlaying() {

    if (!currentlyPlaying) return;

    currentlyPlaying.textContent =
        playingGames[playingIndex];

}


if (changePlaying) {

    changePlaying.addEventListener(
        "click",
        function () {

            playingIndex++;

            if (
                playingIndex >=
                playingGames.length
            ) {

                playingIndex = 0;

            }


            localStorage.setItem(
                "playingIndex",
                playingIndex
            );


            updateCurrentlyPlaying();

            showToast(
                "🎮 Aktuelles Game: " +
                playingGames[playingIndex]
            );

        }
    );

}


updateCurrentlyPlaying();


/* =========================
   WISHLIST
========================= */

const wishlistInput =
    document.getElementById("wishlistInput");

const wishlistAdd =
    document.getElementById("wishlistAdd");

const wishlist =
    document.getElementById("wishlist");


let wishlistGames =
    JSON.parse(
        localStorage.getItem("wishlistGames")
    ) || [];


function displayWishlist() {

    if (!wishlist) return;

    wishlist.innerHTML = "";


    wishlistGames.forEach(
        function (game, index) {

            const item =
                document.createElement("li");


            item.innerHTML =
                `
                <span>🎮 ${game}</span>

                <button
                    type="button"
                    data-index="${index}"
                >
                    ✕
                </button>
                `;


            item
                .querySelector("button")
                .addEventListener(
                    "click",
                    function () {

                        wishlistGames.splice(
                            index,
                            1
                        );


                        localStorage.setItem(
                            "wishlistGames",
                            JSON.stringify(
                                wishlistGames
                            )
                        );


                        displayWishlist();

                    }
                );


            wishlist.appendChild(item);

        }
    );

}


if (wishlistAdd && wishlistInput) {

    wishlistAdd.addEventListener(
        "click",
        function () {

            const game =
                wishlistInput.value.trim();


            if (!game) {

                showToast(
                    "⚠️ Bitte ein Game eingeben!"
                );

                return;

            }


            wishlistGames.push(game);


            localStorage.setItem(
                "wishlistGames",
                JSON.stringify(
                    wishlistGames
                )
            );


            wishlistInput.value = "";


            displayWishlist();


            showToast(
                "📋 " +
                game +
                " hinzugefügt!"
            );

        }
    );

}


displayWishlist();


/* =========================
   GAME RATINGS
========================= */

const ratingElements =
    document.querySelectorAll(".stars");


ratingElements.forEach(
    function (stars) {

        const game =
            stars.dataset.game;


        const savedRating =
            Number(
                localStorage.getItem(
                    "rating-" + game
                )
            ) || 0;


        const buttons =
            stars.querySelectorAll("button");


        function updateStars(value) {

            buttons.forEach(
                function (button, index) {

                    button.textContent =
                        index < value
                            ? "★"
                            : "☆";

                }
            );

        }


        updateStars(savedRating);


        buttons.forEach(
            function (button, index) {

                button.addEventListener(
                    "click",
                    function () {

                        const rating =
                            index + 1;


                        localStorage.setItem(
                            "rating-" + game,
                            rating
                        );


                        updateStars(rating);


                        showToast(
                            "⭐ " +
                            game +
                            ": " +
                            rating +
                            "/5"
                        );

                    }
                );

            }
        );

    }
);

/* =========================
   MINI GAME CENTER
========================= */

const miniGameArea =
    document.getElementById("miniGameArea");

const activeGameTitle =
    document.getElementById("activeGameTitle");

const minigameButtons =
    document.querySelectorAll(".minigame-open");


if (miniGameArea && minigameButtons.length > 0) {


    let clickScore = 0;

    let reactionStart = 0;

    let reactionTimeout = null;

    let tenStart = 0;

    let tenInterval = null;

    let targetScore = 0;

    let targetTime = 15;

    let targetInterval = null;


    function setGameTitle(title) {

        if (activeGameTitle) {

            activeGameTitle.textContent = title;

        }

    }


    function showGame(html) {

        miniGameArea.innerHTML = html;

        miniGameArea.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    /* =========================
       CLICK CHALLENGE
    ========================= */

    function startClickGame() {

        unlockAchievement("firstGame");

        setGameTitle("🎯 Click Challenge");

        clickScore = 0;

        if (clickScore % 10 === 0) {
            addXP(5);
        }

        showGame(`


        <p>
            Klicke so oft du kannst!
        </p>

        <div class="mini-game-score"
             id="miniClickScore">
            0
        </div>

        <button
            class="mini-game-button"
            id="miniClickButton"
        >
            KLICK!
        </button>
    `);


        const button =
            document.getElementById("miniClickButton");

        const score =
            document.getElementById("miniClickScore");


        button.addEventListener(
            "click",
            function () {

                clickScore++;

                score.textContent =
                    clickScore;


                /* HIGHscore speichern */

                saveHighscore(
                    "click",
                    clickScore
                );


                button.style.transform =
                    "scale(0.9)";

                setTimeout(
                    function () {

                        button.style.transform =
                            "scale(1)";

                    },
                    80
                );

            }
        );

    }

    /* =========================
       REACTION TEST
    ========================= */

    function startReactionGame() {

        setGameTitle("⚡ Reaction Test");


        showGame(`

            <p id="reactionText">
                Klicke zum Starten.
            </p>

            <div
                id="reactionBox"
                class="reaction-box"
            >
                START
            </div>

            <div
                class="mini-game-score"
                id="reactionScore"
            >
                -
            </div>
        `);


        const box =
            document.getElementById("reactionBox");

        const text =
            document.getElementById("reactionText");

        const score =
            document.getElementById("reactionScore");


        let waiting = false;


        box.addEventListener(
            "click",
            function () {

                /* START */
                if (!waiting) {

                    waiting = true;

                    box.className =
                        "reaction-box waiting";

                    box.textContent =
                        "WARTE...";

                    text.textContent =
                        "Sobald es grün wird, klicken!";

                    const delay =
                        1500 +
                        Math.random() * 3000;

                    reactionTimeout =
                        setTimeout(
                            function () {

                                box.className =
                                    "reaction-box ready";

                                box.textContent =
                                    "KLICK!";

                                reactionStart =
                                    performance.now();

                            },
                            delay
                        );

                    return;
                }


                /* ZU FRÜH GEKLICKT */
                if (
                    !box.classList.contains("ready")
                ) {

                    clearTimeout(
                        reactionTimeout
                    );

                    box.className =
                        "reaction-box";

                    box.textContent =
                        "NOCHMAL";

                    text.textContent =
                        "Zu früh! Versuch es nochmal.";

                    score.textContent =
                        "Fehlstart";

                    waiting = false;

                    return;
                }


                /* RICHTIG GEKLICKT */
                const reaction =
                    Math.round(
                        performance.now() -
                        reactionStart
                    );
                if (reaction < 200) {
                    unlockAchievement("fastReaction");
                }
                score.textContent =
                    reaction + " ms";

                text.textContent =
                    "Deine Reaktionszeit!";

                box.textContent =
                    "NOCHMAL";

                box.className =
                    "reaction-box";

                waiting = false;


                /* HIGHSCORE SPEICHERN */
                saveHighscore(
                    "reaction",
                    reaction
                );

            }
        );
    }


    /* =========================
       LUCKY NUMBER
    ========================= */

    function startLuckyGame() {

        setGameTitle("🎲 Lucky Number");


        const secret =
            Math.floor(
                Math.random() * 20
            ) + 1;


        let attempts = 0;


        showGame(`
            

            <p>
                Errate eine Zahl zwischen 1 und 20.
            </p>

            <input
                id="luckyInput"
                class="lucky-input"
                type="number"
                min="1"
                max="20"
                placeholder="Deine Zahl"
            >

            <button
                id="luckyButton"
                class="mini-game-button"
            >
                RATEN
            </button>

            <div
                id="luckyResult"
                class="mini-game-score"
            >
                ?
            </div>
        `);


        const input =
            document.getElementById("luckyInput");

        const button =
            document.getElementById("luckyButton");

        const result =
            document.getElementById("luckyResult");


        button.addEventListener(
            "click",
            function () {

                const guess =
                    Number(input.value);

                attempts++;


                if (
                    !guess ||
                    guess < 1 ||
                    guess > 20
                ) {

                    result.textContent =
                        "1–20!";

                    return;

                }


                if (guess === secret) {
                    unlockAchievement("luckyWinner");
                    result.textContent =
                        "🎉 RICHTIG!";

                    saveHighscore("lucky", attempts);

                    showToast(
                        "🎲 Geschafft in " +
                        attempts +
                        " Versuchen!"
                    );

                } else if (guess < secret) {

                    result.textContent =
                        "⬆️ Höher!";

                } else {

                    result.textContent =
                        "⬇️ Tiefer!";

                }

            }
        );

    }


    /* =========================
       10 SECONDS
    ========================= */

    function startTenSecondGame() {

        setGameTitle("⏱️ 10 Seconds");


        showGame(`
      
            <p>
                Starte den Timer und stoppe ihn
                möglichst genau bei 10 Sekunden.
            </p>

            <div
                id="tenTimer"
                class="ten-timer"
            >
                0.00
            </div>

            <button
                id="tenButton"
                class="mini-game-button"
            >
                START
            </button>

            <div
                id="tenResult"
                class="mini-game-score"
            >
                -
            </div>
        `);


        const timer =
            document.getElementById("tenTimer");

        const button =
            document.getElementById("tenButton");

        const result =
            document.getElementById("tenResult");


        let running = false;


        button.addEventListener(
            "click",
            function () {

                if (!running) {

                    running = true;

                    tenStart =
                        performance.now();

                    button.textContent =
                        "STOPP";

                    tenInterval =
                        setInterval(
                            function () {

                                const time =
                                    (
                                        performance.now() -
                                        tenStart
                                    ) / 1000;

                                timer.textContent =
                                    time.toFixed(2);

                            },
                            10
                        );

                } else {

                    clearInterval(
                        tenInterval
                    );

                    running = false;

                    const time =
                        (
                            performance.now() -
                            tenStart
                        ) / 1000;

                    const difference =
                        Math.abs(
                            10 - time
                        );

                    timer.textContent =
                        time.toFixed(2);
                    result.textContent =
                        difference.toFixed(2) +
                        " Sekunden daneben";

                    saveHighscore("ten", difference);

                    button.textContent =
                        "NOCHMAL";
                }

            }
        );

    }


    /* =========================
       MEMORY
    ========================= */

    function startMemoryGame() {

        setGameTitle("🧠 Memory");


        const length = 5;

        const sequence = [];


        for (
            let i = 0;
            i < length;
            i++
        ) {

            sequence.push(
                Math.floor(
                    Math.random() * 10
                )
            );

        }


        showGame(`
     

            <p id="memoryText">
                Merke dir die Zahlenfolge!
            </p>

            <div
                id="memoryNumber"
                class="memory-number"
            >
                ${sequence.join(" ")}
            </div>

            <input
                id="memoryInput"
                class="lucky-input"
                type="text"
                placeholder="Zahlenfolge"
            >

            <button
                id="memoryButton"
                class="mini-game-button"
            >
                PRÜFEN
            </button>

            <div
                id="memoryResult"
                class="mini-game-score"
            >
                ?
            </div>
        `);


        const number =
            document.getElementById(
                "memoryNumber"
            );

        const input =
            document.getElementById(
                "memoryInput"
            );

        const button =
            document.getElementById(
                "memoryButton"
            );

        const result =
            document.getElementById(
                "memoryResult"
            );


        setTimeout(
            function () {

                number.textContent =
                    "???";

            },
            2500
        );


        button.addEventListener(
            "click",
            function () {

                const answer =
                    input.value
                        .replace(/\s/g, "");


                const correct =
                    sequence.join("");


                if (answer === correct) {
                    unlockAchievement("memoryPro");
                    result.textContent =
                        "🎉 RICHTIG!";

                    saveHighscore("memory", 1);

                    showToast(
                        "🧠 Sehr gut!"
                    );
                } else {

                    result.textContent =
                        "❌ FALSCH";

                    number.textContent =
                        sequence.join(" ");

                }

            }
        );

    }


    /* =========================
       TARGET RUSH
    ========================= */

    function startTargetRush() {

        setGameTitle("🎯 Target Rush");


        targetScore = 0;

        if (targetScore >= 20) {
            unlockAchievement("targetMaster");
        }

        targetTime = 15;


        showGame(`


            <p>
                Triff so viele Ziele wie möglich!
            </p>

            <div
                class="mini-game-score"
                id="targetScore"
            >
                0
            </div>

            <div
                id="targetTime"
            >
                15 Sekunden
            </div>

            <div
                id="targetArea"
                class="target-area"
            >

                <button
                    id="targetRushButton"
                    class="target-rush-button"
                >
                    🎯
                </button>

            </div>

            <button
                id="targetStart"
                class="mini-game-button"
            >
                START
            </button>
        `);


        const area =
            document.getElementById(
                "targetArea"
            );

        const targetButton =
            document.getElementById(
                "targetRushButton"
            );

        const startButton =
            document.getElementById(
                "targetStart"
            );

        const score =
            document.getElementById(
                "targetScore"
            );

        const time =
            document.getElementById(
                "targetTime"
            );


        targetButton.style.display =
            "none";


        function moveTarget() {

            const maxX =
                area.clientWidth -
                targetButton.offsetWidth;

            const maxY =
                area.clientHeight -
                targetButton.offsetHeight;


            targetButton.style.left =
                Math.random() *
                maxX +
                "px";

            targetButton.style.top =
                Math.random() *
                maxY +
                "px";

        }


        startButton.addEventListener(
            "click",
            function () {

                targetScore = 0;

                targetTime = 15;

                score.textContent =
                    "0";

                targetButton.style.display =
                    "block";

                startButton.disabled =
                    true;

                moveTarget();


                targetInterval =
                    setInterval(
                        function () {

                            targetTime--;

                            time.textContent =
                                targetTime +
                                " Sekunden";


                            if (
                                targetTime <= 0
                            ) {

                                clearInterval(
                                    targetInterval
                                );

                                targetButton.style.display =
                                    "none";

                                startButton.disabled =
                                    false;

                                startButton.textContent =
                                    "NOCHMAL";
                                saveHighscore(
                                    "target",
                                    targetScore
                                );

                                showToast(
                                    "🎯 Score: " +
                                    targetScore
                                );

                            }

                        },
                        1000
                    );

            }
        );


        targetButton.addEventListener(
            "click",
            function () {

                if (
                    targetTime <= 0
                ) return;


                targetScore++;

                score.textContent =
                    targetScore;

                moveTarget();

            }
        );

    }


    /* =========================
       GAME AUSWÄHLEN
    ========================= */

    minigameButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const game =
                        button.dataset.game;


                    if (game === "click") {

                        startClickGame();

                    }

                    if (game === "reaction") {

                        startReactionGame();

                    }

                    if (game === "lucky") {

                        startLuckyGame();

                    }

                    if (game === "ten") {

                        startTenSecondGame();

                    }

                    if (game === "memory") {

                        startMemoryGame();

                    }

                    if (game === "target") {

                        startTargetRush();

                    }

                }
            );

        }
    );

}


/* =========================
   MINI GAME HIGHSCORES
========================= */


const highscoreKeys = {

    click: "highscore-click",

    reaction: "highscore-reaction",

    lucky: "highscore-lucky",

    ten: "highscore-ten",

    memory: "highscore-memory",

    target: "highscore-target"

};


/* =========================
   HIGHSCORE LADEN
========================= */

function getHighscore(game) {

    const value =
        localStorage.getItem(
            highscoreKeys[game]
        );

    if (value === null) {

        return null;

    }

    return Number(value);

}


/* =========================
   HIGHSCORE SPEICHERN
========================= */

function saveHighscore(game, value) {

    const oldScore =
        getHighscore(game);


    let isNewRecord = false;


    if (oldScore === null) {

        isNewRecord = true;

    } else {

        /* Höher ist besser */

        if (
            game === "click" ||
            game === "memory" ||
            game === "target"
        ) {

            if (value > oldScore) {

                isNewRecord = true;

            }

        }


        /* Niedriger ist besser */

        if (
            game === "reaction" ||
            game === "lucky" ||
            game === "ten"
        ) {

            if (value < oldScore) {

                isNewRecord = true;

            }

        }

    }


    if (isNewRecord) {

        localStorage.setItem(
            highscoreKeys[game],
            value
        );

        updateHighscoreDisplay();

        checkNewHighscoreAchievement();

        showToast(
            "🏆 NEUER HIGHSCORE!"
        );

        return true;
    }


    return false;

}


/* =========================
   HIGHSCORE ANZEIGEN
========================= */

function updateHighscoreDisplay() {


    /* CLICK */

    const click =
        getHighscore("click");

    const clickElement =
        document.getElementById(
            "highscore-click"
        );


    if (clickElement) {

        clickElement.textContent =
            click !== null
                ? click
                : "0";

    }


    /* REACTION */

    const reaction =
        getHighscore("reaction");

    const reactionElement =
        document.getElementById(
            "highscore-reaction"
        );


    if (reactionElement) {

        reactionElement.textContent =
            reaction !== null
                ? reaction + " ms"
                : "–";

    }


    /* LUCKY */

    const lucky =
        getHighscore("lucky");

    const luckyElement =
        document.getElementById(
            "highscore-lucky"
        );


    if (luckyElement) {

        luckyElement.textContent =
            lucky !== null
                ? lucky
                : "–";

    }


    /* 10 SECONDS */

    const ten =
        getHighscore("ten");

    const tenElement =
        document.getElementById(
            "highscore-ten"
        );


    if (tenElement) {

        tenElement.textContent =
            ten !== null
                ? ten.toFixed(2) + " s"
                : "–";

    }


    /* MEMORY */

    const memory =
        getHighscore("memory");

    const memoryElement =
        document.getElementById(
            "highscore-memory"
        );


    if (memoryElement) {

        memoryElement.textContent =
            memory !== null
                ? memory
                : "0";

    }


    /* TARGET */

    const target =
        getHighscore("target");

    const targetElement =
        document.getElementById(
            "highscore-target"
        );


    if (targetElement) {

        targetElement.textContent =
            target !== null
                ? target
                : "0";

    }

}


/* =========================
   HIGHSCORES ZURÜCKSETZEN
========================= */

const resetHighscores =
    document.getElementById(
        "resetHighscores"
    );


if (resetHighscores) {

    resetHighscores.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Möchtest du wirklich alle Highscores löschen?"
                );


            if (!confirmReset) {

                return;

            }


            Object.values(
                highscoreKeys
            ).forEach(
                function (key) {

                    localStorage.removeItem(
                        key
                    );

                }
            );


            updateHighscoreDisplay();


            showToast(
                "🗑️ Highscores zurückgesetzt!"
            );

        }
    );

}


/* =========================
   START
========================= */

updateHighscoreDisplay();



/* =========================
   ACHIEVEMENT SYSTEM
========================= */

const achievements = {

    firstGame: {
        icon: "🎮",
        title: "Erster Schritt",
        description: "Spiele dein erstes Mini-Game."
    },

    firstHighscore: {
        icon: "🏆",
        title: "Highscore!",
        description: "Erreiche deinen ersten Highscore."
    },

    fastReaction: {
        icon: "⚡",
        title: "Blitzreaktion",
        description: "Schaffe eine Reaktionszeit unter 200 ms."
    },

    targetMaster: {
        icon: "🎯",
        title: "Zielmeister",
        description: "Erreiche 20 Treffer bei Target Rush."
    },

    memoryPro: {
        icon: "🧠",
        title: "Gedächtnisprofi",
        description: "Schaffe das Memory-Spiel."
    },

    luckyWinner: {
        icon: "🎲",
        title: "Glückspilz",
        description: "Errate die Lucky Number."
    }

};


/* =========================
   ACHIEVEMENT LADEN
========================= */

function getAchievements() {

    try {

        return JSON.parse(
            localStorage.getItem("achievements")
        ) || [];

    } catch (error) {

        return [];

    }

}


let unlockedAchievements =
    getAchievements();


/* =========================
   ACHIEVEMENT FREISCHALTEN
========================= */

function unlockAchievement(id) {

    if (!achievements[id]) return;

    if (
        unlockedAchievements.includes(id)
    ) {
        return;
    }

    unlockedAchievements.push(id);

    addXP(50);

    localStorage.setItem(
        "achievements",
        JSON.stringify(
            unlockedAchievements
        )
    );

    updateAchievements();

    showToast(
        "🏆 Achievement freigeschaltet: " +
        achievements[id].title
    );

}


/* =========================
   ACHIEVEMENTS ANZEIGEN
========================= */

function updateAchievements() {

    const progressText =
        document.getElementById(
            "achievementProgressText"
        );

    const progressFill =
        document.getElementById(
            "achievementProgressFill"
        );

    const totalAchievements =
        Object.keys(achievements).length;

    const unlockedCount =
        unlockedAchievements.length;

    const progress =
        (unlockedCount / totalAchievements) * 100;


    if (progressText) {

        progressText.textContent =
            unlockedCount +
            " / " +
            totalAchievements;

    }


    if (progressFill) {

        progressFill.style.width =
            progress + "%";

    }

    const grid =
        document.getElementById(
            "achievementsGrid"
        );

    if (!grid) return;

    grid.innerHTML = "";

    Object.entries(achievements)
        .forEach(
            function ([id, achievement]) {

                const unlocked =
                    unlockedAchievements
                        .includes(id);

                const card =
                    document.createElement("div");

                card.className =
                    "achievement-card" +
                    (
                        unlocked
                            ? " unlocked"
                            : " locked"
                    );

                card.innerHTML = `

                    <div class="achievement-icon">
                        ${unlocked
                        ? achievement.icon
                        : "🔒"
                    }
                    </div>

                    <div class="achievement-info">

                        <h3>
                            ${achievement.title}
                        </h3>

                        <p>
                            ${achievement.description}
                        </p>

                    </div>

                `;

                grid.appendChild(card);

            }
        );

}


/* =========================
   START
========================= */

updateAchievements();


/* =========================
   XP & LEVEL SYSTEM
========================= */

const XP_PER_LEVEL = 100;

let playerXP =
    Number(
        localStorage.getItem("playerXP")
    ) || 0;


/* =========================
   XP ANZEIGEN
========================= */

function updateXPDisplay() {

    const levelElement =
        document.getElementById("xpLevel");

    const amountElement =
        document.getElementById("xpAmount");

    const nextElement =
        document.getElementById("xpNext");

    const barElement =
        document.getElementById("xpBarFill");


    const level =
        Math.floor(
            playerXP / XP_PER_LEVEL
        ) + 1;


    const currentXP =
        playerXP % XP_PER_LEVEL;


    const percentage =
        currentXP;


    if (levelElement) {

        levelElement.textContent =
            "Level " + level;

    }


    if (amountElement) {

        amountElement.textContent =
            currentXP +
            " / " +
            XP_PER_LEVEL +
            " XP";

    }


    if (nextElement) {

        const remaining =
            XP_PER_LEVEL - currentXP;

        nextElement.textContent =
            "Noch " +
            remaining +
            " XP";

    }


    if (barElement) {

        barElement.style.width =
            percentage + "%";

    }

}


/* =========================
   XP HINZUFÜGEN
========================= */

function addXP(amount) {
    /* =========================
   ACHIEVEMENT: NEUER HIGHSCORE
========================= */

    function checkNewHighscoreAchievement() {

        const unlocked =
            localStorage.getItem("achievement-new-highscore");

        if (unlocked === "true") {
            return;
        }

        localStorage.setItem(
            "achievement-new-highscore",
            "true"
        );

        addXP(50);

        showToast(
            "🏆 Achievement freigeschaltet: Neuer Highscore!"
        );

    }
    if (
        !amount ||
        amount <= 0
    ) {
        return;
    }


    const oldLevel =
        Math.floor(
            playerXP / XP_PER_LEVEL
        ) + 1;


    playerXP += amount;


    localStorage.setItem(
        "playerXP",
        playerXP
    );


    const newLevel =
        Math.floor(
            playerXP / XP_PER_LEVEL
        ) + 1;


    updateXPDisplay();


    if (newLevel > oldLevel) {

        showToast(
            "🎉 LEVEL UP! Du bist jetzt Level " +
            newLevel +
            "!"
        );

    } else {

        showToast(
            "⚡ +" +
            amount +
            " XP"
        );

    }

}


/* =========================
   START
========================= */

updateXPDisplay();