
// ==========================================
// SUNNY & DIPTI WEDDING INVITATION
// Countdown, scroll reveals, video and music
// ==========================================


// ------------------------------------------
// WEDDING COUNTDOWN
// 25 November 2026, 2:00 PM IST
// ------------------------------------------

const weddingDate = new Date(
    "2026-11-25T14:00:00+05:30"
).getTime();

const countdownElement =
    document.getElementById("countdown");


function updateCountdown() {

    if (!countdownElement) return;

    const difference = weddingDate - Date.now();

    if (difference <= 0) {

        countdownElement.innerHTML =
            '<p class="countdown-finished">The celebration has begun!</p>';

        return;
    }

    const units = {
        days: 86400000,
        hours: 3600000,
        minutes: 60000,
        seconds: 1000
    };

    let remaining = difference;

    for (const [unit, milliseconds] of Object.entries(units)) {

        const value = Math.floor(
            remaining / milliseconds
        );

        remaining %= milliseconds;

        const element = document.getElementById(unit);

        if (element) {

            element.textContent =
                String(value).padStart(2, "0");

        }
    }
}

updateCountdown();

window.setInterval(updateCountdown, 1000);


// ==========================================
// WELCOME SCREEN + BACKGROUND MUSIC
// ==========================================

const welcomeScreen =
    document.getElementById("welcomeScreen");

const backgroundMusic =
    document.getElementById("backgroundMusic");

const musicToggle =
    document.getElementById("musicToggle");

const musicToggleIcon =
    document.getElementById("musicToggleIcon");

const musicToggleLabel =
    document.getElementById("musicToggleLabel");


let welcomeIsOpen = Boolean(welcomeScreen);

let musicHasEnded = false;

let shouldResumeAfterVideo = false;


if (backgroundMusic) {

    // Never repeat the song.
    backgroundMusic.loop = false;

    // Comfortable starting volume.
    backgroundMusic.volume = 0.8;

    backgroundMusic.preload = "auto";
}


// Keep the invitation at the top
// while the welcome screen is visible.

if (welcomeIsOpen) {

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
}


// ------------------------------------------
// UPDATE MUSIC BUTTON
// ------------------------------------------

function updateMusicControl() {

    if (!musicToggle || !backgroundMusic) return;

    // Song has reached its end.
    if (musicHasEnded || backgroundMusic.ended) {

        musicToggleIcon.textContent = "✓";

        musicToggleLabel.textContent =
            "Song finished";

        musicToggle.setAttribute(
            "aria-label",
            "The wedding song has finished"
        );

        musicToggle.setAttribute(
            "aria-pressed",
            "false"
        );

        musicToggle.disabled = true;

        musicHasEnded = true;

        return;
    }

    musicToggle.disabled = false;

    // Song is paused.
    if (backgroundMusic.paused) {

        musicToggleIcon.textContent = "▶";

        musicToggleLabel.textContent =
            "Play music";

        musicToggle.setAttribute(
            "aria-label",
            "Play wedding music"
        );

        musicToggle.setAttribute(
            "aria-pressed",
            "false"
        );

    }

    // Song is playing.
    else {

        musicToggleIcon.textContent = "Ⅱ";

        musicToggleLabel.textContent =
            "Pause music";

        musicToggle.setAttribute(
            "aria-label",
            "Pause wedding music"
        );

        musicToggle.setAttribute(
            "aria-pressed",
            "true"
        );

    }
}


// ------------------------------------------
// PLAY BACKGROUND MUSIC
// ------------------------------------------

function attemptMusicPlayback() {

    if (
        !backgroundMusic ||
        musicHasEnded ||
        backgroundMusic.ended
    ) {

        updateMusicControl();

        return;
    }

    /*
       IMPORTANT:

       play() is called directly inside the visitor's
       tap interaction.

       This is what allows mobile browsers to permit
       audible playback.
    */

    let playPromise;

    try {

        playPromise = backgroundMusic.play();

    } catch (error) {

        console.warn(
            "Wedding music could not start:",
            error
        );

        updateMusicControl();

        return;
    }

    if (
        playPromise &&
        typeof playPromise.then === "function"
    ) {

        playPromise
            .then(updateMusicControl)
            .catch((error) => {

                console.warn(
                    "Wedding music did not start:",
                    error
                );

                // Guest can try using the music button.
                updateMusicControl();

            });

    } else {

        updateMusicControl();

    }
}


// ------------------------------------------
// OPEN INVITATION
// ------------------------------------------

function openInvitationFromWelcome() {

    if (!welcomeIsOpen || !welcomeScreen) return;

    // Start music immediately from the tap.
    attemptMusicPlayback();

    welcomeIsOpen = false;

    // Unlock the background website.
    document.documentElement.classList.remove(
        "welcome-locked"
    );

    document.body.classList.remove(
        "welcome-locked"
    );

    // Start smooth welcome-screen exit.
    welcomeScreen.classList.add("is-opening");

    // Show music control.
    if (musicToggle) {

        musicToggle.hidden = false;

        updateMusicControl();

    }

    // Remove overlay after transition.
    window.setTimeout(() => {

        welcomeScreen.remove();

        window.scrollTo(0, 0);

    }, 950);
}


// ------------------------------------------
// TAP ANYWHERE TO OPEN
// ------------------------------------------

if (welcomeScreen) {

    let pointerStart = null;

    // Detect initial tap position.
    welcomeScreen.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }

            pointerStart = {
                x: event.clientX,
                y: event.clientY
            };

        }
    );


    // A short tap opens the invitation.
// A swipe does not accidentally open it.
welcomeScreen.addEventListener(
    "pointerup",
    (event) => {

        if (!pointerStart) return;

        const deltaX = Math.abs(
            event.clientX - pointerStart.x
        );

        const deltaY = Math.abs(
            event.clientY - pointerStart.y
        );

        pointerStart = null;

        if (
            deltaX <= 12 &&
            deltaY <= 12
        ) {

            // Prevent the same tap from activating
            // a button underneath the welcome screen.
            event.preventDefault();
            event.stopPropagation();

            openInvitationFromWelcome();

        }

    }
);


// Prevent clicks on the welcome screen from
// reaching elements underneath it during its exit.
welcomeScreen.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        event.stopPropagation();
    },
    true
);

    // Keyboard support.
    welcomeScreen.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openInvitationFromWelcome();

            }

        }
    );

}


// ==========================================
// PREVENT BACKGROUND SCROLLING
// WHILE WELCOME SCREEN IS OPEN
// ==========================================

function preventScrollWhileWelcomeIsOpen(event) {

    if (welcomeIsOpen) {

        event.preventDefault();

    }
}


// Block mouse wheel scrolling.

document.addEventListener(
    "wheel",
    preventScrollWhileWelcomeIsOpen,
    {
        passive: false,
        capture: true
    }
);


// Block mobile touch scrolling.

document.addEventListener(
    "touchmove",
    preventScrollWhileWelcomeIsOpen,
    {
        passive: false,
        capture: true
    }
);


// Block keyboard scrolling.

document.addEventListener(
    "keydown",
    (event) => {

        if (!welcomeIsOpen) return;

        const scrollingKeys = [
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End"
        ];

        if (scrollingKeys.includes(event.key)) {

            event.preventDefault();

        }

    },
    {
        capture: true
    }
);


// ==========================================
// MUSIC PAUSE / RESUME BUTTON
// ==========================================

musicToggle?.addEventListener(
    "click",
    () => {

        if (
            !backgroundMusic ||
            musicHasEnded ||
            backgroundMusic.ended
        ) {

            updateMusicControl();

            return;
        }

        // Resume from the paused position.
        if (backgroundMusic.paused) {

            attemptMusicPlayback();

        }

        // Pause without resetting playback position.
        else {

            backgroundMusic.pause();

            updateMusicControl();

        }

    }
);


// Update button when audio changes state.

backgroundMusic?.addEventListener(
    "play",
    updateMusicControl
);

backgroundMusic?.addEventListener(
    "pause",
    updateMusicControl
);


// Stop permanently when the song finishes.

backgroundMusic?.addEventListener(
    "ended",
    () => {

        musicHasEnded = true;

        updateMusicControl();

    }
);


// Detect missing audio file.

backgroundMusic?.addEventListener(
    "error",
    () => {

        console.error(
            "Could not load assets/wedding-song.mp3. Check the filename and assets folder."
        );

        if (musicToggle) {

            musicToggleIcon.textContent = "!";

            musicToggleLabel.textContent =
                "Music unavailable";

            musicToggle.setAttribute(
                "aria-label",
                "Wedding music file could not be loaded"
            );

        }

    }
);


// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

const revealElements = document.querySelectorAll(`
    .blessing,
    .photo-card,
    .celebration > .eyebrow,
    .celebration > h2,
    .date-large,
    .weekday,
    .event-grid,
    .venue,
    .family > .eyebrow,
    .family > h2,
    .family-list,
    .paw-note,
    .closing
`);


revealElements.forEach((element, index) => {

    element.classList.add("scroll-reveal");

    if (element.classList.contains("photo-card")) {

        element.classList.add(
            index % 2 === 0
                ? "scroll-left"
                : "scroll-right"
        );

    }

});


if ("IntersectionObserver" in window) {

    const scrollObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {

        scrollObserver.observe(element);

    });

} else {

    // Fallback for older browsers.
    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


// ==========================================
// WEDDING VIDEO MODAL
// ==========================================

const openWeddingVideoButton =
    document.getElementById("openWeddingVideo");

const closeWeddingVideoButton =
    document.getElementById("closeWeddingVideo");

const weddingVideoDialog =
    document.getElementById("weddingVideoDialog");

const weddingVideo =
    document.getElementById("weddingVideo");

// ==========================================
// PAUSE MEDIA WHEN VISITOR LEAVES THE WEBSITE
// ==========================================

let pageIsHidden = false;

function pauseMediaWhenPageHidden() {

    pageIsHidden = true;

    // Stop background music.
    if (backgroundMusic && !backgroundMusic.paused) {
        backgroundMusic.pause();
        updateMusicControl();
    }

    // Stop invitation video.
    if (weddingVideo && !weddingVideo.paused) {
        weddingVideo.pause();
    }

    // Do not automatically restart music
    // when the visitor returns to the website.
    shouldResumeAfterVideo = false;
}


// Detect when the visitor switches apps,
// presses Home, or moves to another tab.
document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {
            pauseMediaWhenPageHidden();
        } else {
            pageIsHidden = false;
        }

    }
);


// Also handle the browser unloading the page.
window.addEventListener(
    "pagehide",
    pauseMediaWhenPageHidden
);


function closeWeddingVideo() {

    if (
        weddingVideo &&
        !weddingVideo.paused
    ) {

        weddingVideo.pause();

    }

    if (weddingVideoDialog?.open) {

        weddingVideoDialog.close();

    }

}


// Open the invitation video.

openWeddingVideoButton?.addEventListener(
    "click",
    async () => {

        if (!weddingVideoDialog) return;

        // Pause background music when the video plays,
        // so both audio tracks do not overlap.

        shouldResumeAfterVideo = Boolean(
            backgroundMusic &&
            !backgroundMusic.paused &&
            !musicHasEnded
        );

        if (shouldResumeAfterVideo) {

            backgroundMusic.pause();

            updateMusicControl();

        }

        if (
            typeof weddingVideoDialog.showModal === "function"
        ) {

            weddingVideoDialog.showModal();

        } else {

            weddingVideoDialog.setAttribute(
                "open",
                ""
            );

        }

        if (weddingVideo) {

            try {

                await weddingVideo.play();

            } catch (error) {

                console.info(
                    "Tap the video play control to start playback.",
                    error
                );

            }

        }

    }
);


// Close button.

closeWeddingVideoButton?.addEventListener(
    "click",
    closeWeddingVideo
);


// Close by tapping outside the video.

weddingVideoDialog?.addEventListener(
    "click",
    (event) => {

        if (event.target === weddingVideoDialog) {

            closeWeddingVideo();

        }

    }
);


// Pause video and resume background song
// from its previous position when the video closes.

weddingVideoDialog?.addEventListener(
    "close",
    () => {

        if (
            weddingVideo &&
            !weddingVideo.paused
        ) {

            weddingVideo.pause();

        }

        if (
            shouldResumeAfterVideo &&
            backgroundMusic &&
            !musicHasEnded &&
            !pageIsHidden &&
            !document.hidden
        ) {

            attemptMusicPlayback();

        }

        shouldResumeAfterVideo = false;

    }
);
