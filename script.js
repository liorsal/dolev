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

    if (galleryGrid) {
        const fragment = document.createDocumentFragment();

        imageFiles.forEach((filename, index) => {
            const galleryItem = document.createElement('button');
            galleryItem.className = 'gallery-item';
            galleryItem.type = 'button';
            galleryItem.setAttribute('data-index', index);
            galleryItem.setAttribute('aria-label', `פתיחת עמוד ${index + 1} מהספר`);

            const img = document.createElement('img');
            img.src = `images/${filename}`;
            img.alt = `דולב נלול - עמוד ${index + 1}`;
            img.loading = 'lazy';

            img.onerror = function handleImageError() {
                this.remove();
                galleryItem.remove();
            };

            galleryItem.appendChild(img);
            galleryItem.addEventListener('click', () => openModal(filename, index + 1));
            fragment.appendChild(galleryItem);
        });

        galleryGrid.appendChild(fragment);
    }

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
