document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing carousel...');

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = document.querySelector('.close');

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
        console.log('Creating carousel with', imageFiles.length, 'images');
        
        // Create all gallery items
        imageFiles.forEach((filename, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            galleryItem.setAttribute('data-filename', filename);
            galleryItem.setAttribute('aria-label', `עמוד ${index + 1} מתוך ${imageFiles.length}`);

            const img = document.createElement('img');
            img.loading = index < 3 ? 'eager' : 'lazy';
            const imagePath = `images/${filename}`;
            
            img.alt = `דולב מלול - עמוד ${index + 1}`;
            img.setAttribute('data-filename', filename);
            img.setAttribute('data-index', index);
            img.setAttribute('data-path', imagePath);
            
            img.onerror = function() {
                console.error(`❌ Error loading image ${index}:`, filename);
            };

            img.onload = function() {
                console.log(`✓ Image ${index} loaded:`, filename);
            };
            
            img.src = imagePath;
            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => openModal(filename, index + 1));
            carouselTrack.appendChild(galleryItem);
        });

        console.log('✓ Carousel track created with', imageFiles.length, 'items');
    } else {
        console.error('❌ Carousel track element not found!');
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        
        // Ensure currentSlide is within bounds
        if (currentSlide < 0) currentSlide = 0;
        if (currentSlide >= imageFiles.length) currentSlide = imageFiles.length - 1;
        
        // Get wrapper width for accurate calculation
        const wrapper = document.getElementById('carousel-wrapper');
        if (!wrapper) return;
        
        const wrapperWidth = wrapper.offsetWidth;
        const transformValue = -currentSlide * wrapperWidth;
        
        // Apply transform
        carouselTrack.style.transform = `translateX(${transformValue}px)`;
        carouselTrack.style.webkitTransform = `translateX(${transformValue}px)`;
        carouselTrack.style.msTransform = `translateX(${transformValue}px)`;
        carouselTrack.style.OTransform = `translateX(${transformValue}px)`;
        carouselTrack.style.MozTransform = `translateX(${transformValue}px)`;
        
        // Update indicator
        if (currentImgElement) {
            currentImgElement.textContent = currentSlide + 1;
        }
        
        console.log('Carousel updated - slide:', currentSlide + 1, '/', imageFiles.length, 'transform:', transformValue + 'px', 'wrapperWidth:', wrapperWidth);
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
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isUserInteracting) {
                nextSlide();
            }
        }, 3000);
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
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }, { passive: true });
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
    currentSlide = 0;
    
    // Wait for images to load and DOM to be ready
    setTimeout(() => {
        updateCarousel();
        startAutoPlay();
        console.log('Carousel initialized');
        
        // Update on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateCarousel();
            }, 150);
        });
    }, 500);

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

    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

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
                siteNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('is-open');
            });
        });
    }
});
