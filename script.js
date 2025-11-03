document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = modal ? modal.querySelector('.close') : null;
    const header = document.querySelector('.site-header');
    const siteNav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');

    const imageFiles = [
        '01986724-d273-43a5-864e-35e41541bc98 2.JPG',
        '01986724-d273-43a5-864e-35e41541bc98.JPG',
        '082535d2-3ce1-460e-a290-840f509a6d3f 2.JPG',
        '082535d2-3ce1-460e-a290-840f509a6d3f.JPG',
        '0c980338-3f55-4c7d-be7c-a213d18c8f97.JPG',
        '29feaaaf-f8ca-413d-8bf8-2f84b8f3e0e3 2.JPG',
        '29feaaaf-f8ca-413d-8bf8-2f84b8f3e0e3.JPG',
        '342c8fba-a190-4d85-a514-9be1f7912f3b 2.JPG',
        '342c8fba-a190-4d85-a514-9be1f7912f3b.JPG',
        '4b33a832-38f7-4b61-974f-3b585756270b 2.JPG',
        '4b33a832-38f7-4b61-974f-3b585756270b.JPG',
        '586874ec-5b98-468c-a6dc-8d611f0d50e6 2.JPG',
        '586874ec-5b98-468c-a6dc-8d611f0d50e6.JPG',
        '5b6e98a7-e501-4c05-b80f-af261d91e597 2.JPG',
        '5b6e98a7-e501-4c05-b80f-af261d91e597.JPG',
        '91d40433-536b-4a8c-bacc-ec979c9756ac 2.JPG',
        '91d40433-536b-4a8c-bacc-ec979c9756ac.JPG',
        'a45fc942-ea52-4493-873d-5d3c7c79f57d 2.JPG',
        'a45fc942-ea52-4493-873d-5d3c7c79f57d.JPG',
        'a9bb1888-52c8-4350-aff1-92c7ab3e7a46 2.JPG',
        'a9bb1888-52c8-4350-aff1-92c7ab3e7a46.JPG',
        'ad25c35f-72e6-416d-97eb-18cefe874b3c.JPG',
        'b17dbccc-1b65-4344-8eb7-77e1bea0a903 2.JPG',
        'b17dbccc-1b65-4344-8eb7-77e1bea0a903.JPG',
        'b68aa51b-2e7b-4c98-b1e5-753dd78b055b 2.JPG',
        'b68aa51b-2e7b-4c98-b1e5-753dd78b055b.JPG',
        'e54c7c5d-9f85-4a02-b8a2-31d471fe0180 2.JPG',
        'e54c7c5d-9f85-4a02-b8a2-31d471fe0180.JPG',
        'IMG_2310.JPG'
    ];

    const carouselTrack = document.getElementById('gallery-grid');
    const currentImgElement = document.getElementById('current-img');
    const totalImgElement = document.getElementById('total-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentSlide = 0;
    let autoPlayInterval = null;
    let isUserInteracting = false;

    if (totalImgElement) {
        totalImgElement.textContent = imageFiles.length;
    }

    if (carouselTrack) {
        const fragment = document.createDocumentFragment();

        imageFiles.forEach((filename, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            if (index === 0) galleryItem.classList.add('active');
            galleryItem.setAttribute('data-index', index);
            galleryItem.setAttribute('aria-label', `עמוד ${index + 1} מתוך ${imageFiles.length}`);

            const img = document.createElement('img');
            // Load first 3 images immediately, rest lazy
            img.loading = index < 3 ? 'eager' : 'lazy';
            img.src = `images/${filename}`;
            img.alt = `דולב מלול - עמוד ${index + 1}`;

            img.onerror = function handleImageError() {
                console.error('Error loading image:', filename);
                this.style.display = 'none';
            };

            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => openModal(filename, index + 1));
            fragment.appendChild(galleryItem);
        });

        carouselTrack.appendChild(fragment);
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active slide
        const slides = carouselTrack.querySelectorAll('.gallery-item');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update indicator
        if (currentImgElement) {
            currentImgElement.textContent = currentSlide + 1;
        }
        
        // Preload adjacent images
        preloadImages(currentSlide);
    }

    function preloadImages(currentIndex) {
        [currentIndex - 1, currentIndex + 1].forEach(index => {
            if (index >= 0 && index < imageFiles.length) {
                const img = new Image();
                img.src = `images/${imageFiles[index]}`;
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % imageFiles.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + imageFiles.length) % imageFiles.length;
        updateCarousel();
    }

    function startAutoPlay() {
        if (autoPlayInterval) return;
        
        autoPlayInterval = setInterval(() => {
            if (!isUserInteracting) {
                nextSlide();
            }
        }, 3000); // 3 seconds
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function pauseOnInteraction() {
        isUserInteracting = true;
        stopAutoPlay();
        
        // Resume after 10 seconds of no interaction
        setTimeout(() => {
            isUserInteracting = false;
            startAutoPlay();
        }, 10000);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            pauseOnInteraction();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            pauseOnInteraction();
        });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselTrack) {
        const carouselWrapper = carouselTrack.closest('.carousel-wrapper');
        
        if (carouselWrapper) {
            carouselWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                pauseOnInteraction();
            }, { passive: true });

            carouselWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe right = next
                nextSlide();
            } else {
                // Swipe left = previous
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            pauseOnInteraction();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            pauseOnInteraction();
        }
    });

    // Initialize
    updateCarousel();
    startAutoPlay();

    // Pause on hover (desktop)
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopAutoPlay();
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startAutoPlay();
        });
    }

    function openModal(filename, pageNumber) {
        if (!modal || !modalImg || !modalCaption) return;

        modalImg.src = `images/${filename}`;
        modalImg.alt = `איור מספר ${pageNumber} מתוך הספר דולב מלול`;
        modalCaption.textContent = `עמוד ${pageNumber} מתוך הספר "דולב מלול"`;
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
