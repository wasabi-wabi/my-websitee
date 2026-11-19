const PAGE_WIPE_DURATION = 700;

/* Add "click to start" or smth
or the sounds won't work bruh */
const phoneContainers = document.querySelectorAll('.phone-container, .phone');

phoneContainers.forEach((phoneContainer) => {
    phoneContainer.addEventListener('click', () => {
        phoneContainer.classList.toggle('paused');
    });
});


const links = document.querySelectorAll('.links-container a, .back-button a');
const menuHoverSound = document.querySelector('.menu-sound');

const transitionUrl = new URL(window.location.href);
if (document.body.classList.contains('loading-page')) {
    document.body.classList.add('page-entering');
} else if (transitionUrl.searchParams.has('pageWipe')) {
    transitionUrl.searchParams.delete('pageWipe');
    window.history.replaceState(null, '', transitionUrl);
    document.body.classList.add('page-entering');
}

links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
        // Rewind
        menuHoverSound.currentTime = 0

        // Catch autoplay vid warnings
        menuHoverSound.play().catch(() => {

        });
    });

    link.addEventListener('click', (event) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            link.target === '_blank' ||
            link.hasAttribute('download')
        ) {
            return;
        }

        const destination = new URL(link.href, window.location.href);
        if (!['http:', 'https:', 'file:'].includes(destination.protocol)) return;

        event.preventDefault();
        const loadingUrl = new URL('./loading.html', window.location.href);
        loadingUrl.searchParams.set('next', destination.href);
        document.body.classList.add('page-leaving');
        setTimeout(() => {
            window.location.href = loadingUrl.href;
        }, PAGE_WIPE_DURATION);
    });
});

/* loading */

const percent = document.querySelector('.percent');
const progress = document.querySelector('.progress');

if (percent && progress) {
    const text = document.querySelector('.text');
    const destination = new URLSearchParams(window.location.search).get('next');
    let count = 0;

    const loading = setInterval(() => {
        count += 1;
        progress.style.width = `${count}%`;
        percent.textContent = `${count}%`;

        if (count === 100) {
            percent.classList.add('text-blink');
            if (text) text.style.display = 'grid';
            clearInterval(loading);

            if (destination) {
                const nextPage = new URL(destination, window.location.href);
                if (['http:', 'https:', 'file:'].includes(nextPage.protocol)) {
                    setTimeout(() => {
                        document.body.classList.remove('page-entering');
                        document.body.classList.add('page-leaving');
                        setTimeout(() => {
                            nextPage.searchParams.set('pageWipe', '1');
                            window.location.href = nextPage.href;
                        }, PAGE_WIPE_DURATION);
                    }, 1500);
                }
            }
        }
    }, 20);
}