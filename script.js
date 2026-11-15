
// ==========================================
// WEDDING COUNTDOWN
// ==========================================

const weddingDate = new Date("2026-11-25T14:00:00+05:30").getTime();

function updateCountdown() {
    const now = Date.now();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById("countdown").innerHTML =
            "<p>The celebration has begun. जय श्री झूलेलाल!</p>";
        return;
    }

    const units = {
        days: 86400000,
        hours: 3600000,
        minutes: 60000,
        seconds: 1000
    };

    let remaining = diff;

    for (const [id, size] of Object.entries(units)) {
        const value = Math.floor(remaining / size);
        remaining %= size;

        document.getElementById(id).textContent =
            String(value).padStart(2, "0");
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// OPENING INVITATION ANIMATION
// ==========================================

const celebrationLayer = document.getElementById("celebrationLayer");



// ==========================================
// ELEGANT OPENING ANIMATION
// No balloons or confetti
// ==========================================

const welcomeScreen = document.getElementById("welcomeScreen");
const openInvitationButton = document.getElementById("openInvitation");

openInvitationButton?.addEventListener("click", () => {

    if (
        !welcomeScreen ||
        welcomeScreen.classList.contains("is-opening")
    ) {
        return;
    }

    // Unlock the invitation
    document.body.classList.remove("invitation-locked");

    // Start elegant opening transition
    welcomeScreen.classList.add("is-opening");

    // Remove opening screen after transition
    window.setTimeout(() => {

        welcomeScreen.classList.add("is-gone");
        welcomeScreen.setAttribute("aria-hidden", "true");

    }, 1000);

});



// ==========================================
// OPEN INVITATION ON CLICK / TAP
// ==========================================

openInvitationButton?.addEventListener("click", () => {

    if (
        !welcomeScreen ||
        welcomeScreen.classList.contains("is-opening")
    ) {
        return;
    }

    // Launch balloons and confetti
    launchCelebration();

    // Animate the opening screen
    welcomeScreen.classList.add("is-opening");

    // Allow scrolling
    document.body.classList.remove("invitation-locked");

    // Remove opening screen after animation
    window.setTimeout(() => {

        welcomeScreen.classList.add("is-gone");

        welcomeScreen.setAttribute("aria-hidden", "true");

        // Smoothly move to the main invitation
        document.getElementById("home")?.scrollIntoView({
            behavior: "smooth"
        });

    }, 850);

});



// ==========================================
// PREMIUM SCROLL FADE-IN ANIMATIONS
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
    .countdown-wrap,
    .family > .eyebrow,
    .family > h2,
    .family-list,
    .paw-note,
    .closing
`);

// Add animation class to every selected element
revealElements.forEach((element, index) => {

    element.classList.add("scroll-reveal");

    // Alternate photo entrance directions
    if (element.classList.contains("photo-card")) {
        element.classList.add(
            index % 2 === 0 ? "scroll-left" : "scroll-right"
        );
    }
});


// Observe elements while scrolling
const scrollObserver = new IntersectionObserver(

    (entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                // Reveal element
                entry.target.classList.add("visible");

                // Stop observing after animation
                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    }

);


// Start observing all elements
revealElements.forEach((element) => {
    scrollObserver.observe(element);
});
