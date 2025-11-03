document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.getElementById('gallery-track');
    const carouselThumbs = document.getElementById('gallery-thumbs');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const carouselWindow = document.querySelector('.carousel-window');
    const currentIndexEl = document.getElementById('current-index');
    const totalCountEl = document.getElementById('total-count');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = modal ? modal.querySelector('.close') : null;
    const header = document.querySelector('.site-header');
    const siteNav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');

    // Generate image file list: 1.png, 2.png, ... 17.png
    const imageFiles = Array.from({ length: 17 }, (_, i) => `${i + 1}.png`);

    let currentIndex = 0;
    const slideButtons = [];
    const thumbButtons = [];

    if (totalCountEl) {
        totalCountEl.textContent = imageFiles.length;
    }

    if (carouselTrack && carouselThumbs) {
        const slideFragment = document.createDocumentFragment();
        const thumbsFragment = document.createDocumentFragment();

        imageFiles.forEach((filename, index) => {
            const slideButton = document.createElement('button');
            slideButton.type = 'button';
            slideButton.className = 'carousel-slide';
            slideButton.setAttribute('data-index', index);
            slideButton.setAttribute('aria-label', `תצוגה מוגדלת של עמוד ${index + 1}`);

            const slideImg = document.createElement('img');
            slideImg.decoding = 'async';
            slideImg.loading = index < 4 ? 'eager' : 'lazy';
            slideImg.src = `images/${filename}`;
            slideImg.alt = `איור מספר ${index + 1} מתוך הספר דולב נלול`;

            let thumbButton;

            slideImg.onerror = () => {
                slideButton.remove();
                thumbButton?.remove();

                const slideIdx = slideButtons.indexOf(slideButton);
                if (slideIdx !== -1) {
                    slideButtons.splice(slideIdx, 1);
                }

                const thumbIdx = thumbButtons.indexOf(thumbButton);
                if (thumbIdx !== -1) {
                    thumbButtons.splice(thumbIdx, 1);
                }

                if (totalCountEl) {
                    totalCountEl.textContent = slideButtons.length;
                }

                if (currentIndex >= slideButtons.length) {
                    currentIndex = Math.max(slideButtons.length - 1, 0);
                }

                updateCarousel();
            };

            slideButton.appendChild(slideImg);
            slideButton.addEventListener('click', () => openModal(filename, index + 1));
            slideFragment.appendChild(slideButton);
            slideButtons.push(slideButton);

            thumbButton = document.createElement('button');
            thumbButton.type = 'button';
            thumbButton.className = 'carousel-thumb';
            thumbButton.setAttribute('data-index', index);
            thumbButton.setAttribute('aria-label', `מעבר לעמוד ${index + 1}`);

            const thumbImg = document.createElement('img');
            thumbImg.decoding = 'async';
            thumbImg.loading = index < 10 ? 'eager' : 'lazy';
            thumbImg.src = `images/${filename}`;
            thumbImg.alt = `איור ממוזער מספר ${index + 1}`;

            thumbButton.appendChild(thumbImg);
            thumbButton.addEventListener('click', () => goToSlide(index));
            thumbsFragment.appendChild(thumbButton);
            thumbButtons.push(thumbButton);
        });

        carouselTrack.appendChild(slideFragment);
        carouselThumbs.appendChild(thumbsFragment);

        updateCarousel();
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        const totalSlides = slideButtons.length;

        if (!totalSlides) {
            carouselTrack.style.transform = 'translateX(0)';
            if (currentIndexEl) {
                currentIndexEl.textContent = '0';
            }
            return;
        }

        const slideWidth = slideButtons[0]?.getBoundingClientRect().width || (carouselWindow?.clientWidth || 0);
        // Ensure track width matches total slides to avoid weird flex shrink
        if (slideWidth && totalSlides) {
            carouselTrack.style.width = `${slideWidth * totalSlides}px`;
        }
        const offsetPx = -currentIndex * slideWidth;
        carouselTrack.style.transform = `translateX(${offsetPx}px)`;

        slideButtons.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });

        thumbButtons.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });

        if (currentIndexEl) {
            currentIndexEl.textContent = currentIndex + 1;
        }
    }

    function goToSlide(index) {
        if (!slideButtons.length) return;
        currentIndex = (index + slideButtons.length) % slideButtons.length;
        updateCarousel();
    }

    function goNext() {
        goToSlide(currentIndex + 1);
    }

    function goPrev() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', goNext);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', goPrev);
    }

    carouselTrack?.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselTrack?.addEventListener('touchmove', handleTouchMove, { passive: true });
    carouselTrack?.addEventListener('touchend', handleTouchEnd, { passive: true });

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }

    function handleTouchMove(event) {
        touchEndX = event.changedTouches[0].screenX;
    }

    function handleTouchEnd() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goNext();
            } else {
                goPrev();
            }
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            goNext();
        } else if (event.key === 'ArrowRight') {
            goPrev();
        }
    });

    // Auto-play carousel
    let autoPlayInterval = null;
    let isPaused = false;

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isPaused && slideButtons.length > 0) {
                goNext();
            }
        }, 3000); // 3 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    // Pause auto-play on user interaction
    function pauseAutoPlay() {
        isPaused = true;
        stopAutoPlay();
        setTimeout(() => {
            isPaused = false;
            startAutoPlay();
        }, 10000); // Resume after 10 seconds
    }

    // Start auto-play after initialization
    setTimeout(() => {
        startAutoPlay();
    }, 1000);

    // Pause on hover
    if (carouselWindow) {
        carouselWindow.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoPlay();
        });
        carouselWindow.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoPlay();
        });
    }

    // Pause on interaction
    if (nextBtn) {
        nextBtn.addEventListener('click', pauseAutoPlay);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', pauseAutoPlay);
    }
    carouselTrack?.addEventListener('touchstart', pauseAutoPlay, { passive: true });

    // Recalculate on resize/orientation change
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 120);
    }, { passive: true });

    // Recalculate once all assets are loaded
    window.addEventListener('load', updateCarousel, { once: true });

    function openModal(filename, pageNumber) {
        if (!modal || !modalImg || !modalCaption) return;
        modalImg.src = `images/${filename}`;
        modalImg.alt = `איור מספר ${pageNumber} מתוך הספר דולב נלול`;
        modalCaption.textContent = `עמוד ${pageNumber} מתוך הספר "דולב נלול"`;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal || !modalImg) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modalImg.removeAttribute('src');
        modalImg.removeAttribute('alt');
        document.body.style.overflow = '';
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal?.classList.contains('open')) {
            closeModal();
        }
    });

    const updateHeaderState = () => {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 20);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.classList.toggle('is-open', isOpen);
        });

        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (siteNav.classList.contains('is-open')) {
                    siteNav.classList.remove('is-open');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('is-open');
                }
            });
        });
    }
});
