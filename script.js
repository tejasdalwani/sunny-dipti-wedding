
// ==========================================
// WEDDING COUNTDOWN
// Wedding time: 25 November 2026, 2:00 PM IST
// ==========================================

const weddingDate = new Date("2026-11-25T14:00:00+05:30").getTime();
const countdownElement = document.getElementById("countdown");

function updateCountdown() {

    if (!countdownElement) return;

    const now = Date.now();
    const difference = weddingDate - now;

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

        const value = Math.floor(remaining / milliseconds);
        remaining %= milliseconds;

        const element = document.getElementById(unit);

        if (element) {
            element.textContent = String(value).padStart(2, "0");
        }
    }
}

updateCountdown();

window.setInterval(updateCountdown, 1000);


// ==========================================
// SCROLL-REVEAL ANIMATIONS
// Website opens directly without interaction.
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
            index % 2 === 0 ? "scroll-left" : "scroll-right"
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
// Opens when visitor taps Watch Wedding Video.
// ==========================================

const openWeddingVideoButton =
    document.getElementById("openWeddingVideo");

const closeWeddingVideoButton =
    document.getElementById("closeWeddingVideo");

const weddingVideoDialog =
    document.getElementById("weddingVideoDialog");

const weddingVideo =
    document.getElementById("weddingVideo");


// Close video and stop playback.
function closeWeddingVideo() {

    if (weddingVideo && !weddingVideo.paused) {
        weddingVideo.pause();
    }

    if (weddingVideoDialog?.open) {
        weddingVideoDialog.close();
    }
}


// Open video when the button is tapped.
openWeddingVideoButton?.addEventListener("click", async () => {

    if (!weddingVideoDialog) return;

    if (typeof weddingVideoDialog.showModal === "function") {

        weddingVideoDialog.showModal();

    } else {

        // Fallback for older browsers.
        weddingVideoDialog.setAttribute("open", "");

    }

    // Start playback after the visitor's tap.
    if (weddingVideo) {

        try {

            await weddingVideo.play();

        } catch (error) {

            // Visitor can use the visible video controls
            // if automatic playback is unavailable.
            console.info(
                "Tap the video play control to start playback.",
                error
            );

        }

    }

});


// Close button.
closeWeddingVideoButton?.addEventListener(
    "click",
    closeWeddingVideo
);


// Close when tapping outside the video.
weddingVideoDialog?.addEventListener("click", (event) => {

    if (event.target === weddingVideoDialog) {
        closeWeddingVideo();
    }

});


// Pause video whenever dialog closes.
weddingVideoDialog?.addEventListener("close", () => {

    if (weddingVideo && !weddingVideo.paused) {
        weddingVideo.pause();
    }

});
