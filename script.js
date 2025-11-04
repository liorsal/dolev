document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = modal ? modal.querySelector('.close') : null;
    const header = document.querySelector('.site-header');
    const siteNav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const gallery = document.getElementById('image-gallery');

    // Image files: 1.png through 10.png, then 13.png through 18.png
    const imageFiles = [
        '1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png', '10.png',
        '13.png', '14.png', '15.png', '16.png', '17.png', '18.png'
    ];

    // Create simple gallery
    if (gallery) {
        imageFiles.forEach((filename, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            item.setAttribute('aria-label', `פתח תמונה ${index + 1} מתוך ${imageFiles.length} - מספר דולב מלול`);
            
            const img = document.createElement('img');
            img.src = `images/${filename}`;
            img.alt = `תמונה ${index + 1} מתוך ${imageFiles.length} - עבודת תספורת מספר דולב מלול, קריית שמונה`;
            img.loading = index < 6 ? 'eager' : 'lazy';
            img.decoding = 'async';
            
            item.appendChild(img);
            item.addEventListener('click', () => openModal(filename, index + 1));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(filename, index + 1);
                }
            });
            
            gallery.appendChild(item);
        });
    }

    let lastFocusElement = null;
    let focusableElements = [];

    function getFocusableElements(container) {
        const selectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        return Array.from(container.querySelectorAll(selectors));
    }

    function trapFocus(e) {
        if (!focusableElements.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    function openModal(filename, pageNumber) {
        if (!modal || !modalImg || !modalCaption) return;
        
        // Save the element that opened the modal
        lastFocusElement = document.activeElement;
        
        modalImg.src = `images/${filename}`;
        modalImg.alt = `תמונה ${pageNumber} מתוך ${imageFiles.length} - עבודת תספורת מספר דולב מלול, קריית שמונה`;
        modalCaption.textContent = `תמונה ${pageNumber} מתוך ${imageFiles.length} - עבודת תספורת מספר דולב מלול`;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('aria-modal', 'true');
        document.body.style.overflow = 'hidden';
        
        // Get focusable elements and trap focus
        focusableElements = getFocusableElements(modal);
        if (closeModalBtn) {
            closeModalBtn.focus();
        }
        
        // Add focus trap
        modal.addEventListener('keydown', trapFocus);
        
        // Hide background content from screen readers
        document.querySelectorAll('main, header, footer').forEach(el => {
            el.setAttribute('aria-hidden', 'true');
        });
    }

    function closeModal() {
        if (!modal || !modalImg) return;
        
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'false');
        modalImg.removeAttribute('src');
        modalImg.removeAttribute('alt');
        document.body.style.overflow = '';
        
        // Remove focus trap
        modal.removeEventListener('keydown', trapFocus);
        
        // Restore background content visibility
        document.querySelectorAll('main, header, footer').forEach(el => {
            el.removeAttribute('aria-hidden');
        });
        
        // Return focus to the element that opened the modal
        if (lastFocusElement) {
            lastFocusElement.focus();
            lastFocusElement = null;
        }
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

    // טופס הזמנת תור - עם Firebase לבדיקת תורים תפוסים
    const bookingForm = document.getElementById('booking-form');
    const dateInput = document.getElementById('booking-date');
    const timeInput = document.getElementById('booking-time');
    const submitButton = bookingForm?.querySelector('button[type="submit"]');
    
    // הגדר תאריך מינימלי להיום
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // פונקציה לבדיקת תור תפוס
    async function isTimeSlotTaken(date, time) {
        if (!window.firebaseDb) {
            console.warn('Firebase not initialized');
            return false;
        }
        
        try {
            const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const bookingsRef = collection(window.firebaseDb, 'bookings');
            const q = query(bookingsRef, where('date', '==', date), where('time', '==', time));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        } catch (error) {
            console.error('Error checking time slot:', error);
            return false;
        }
    }

    // פונקציה לשמירת תור ב-Firebase
    async function saveBooking(name, phone, date, time, notes) {
        if (!window.firebaseDb) {
            console.warn('Firebase not initialized');
            return false;
        }
        
        try {
            const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const bookingsRef = collection(window.firebaseDb, 'bookings');
            await addDoc(bookingsRef, {
                name: name,
                phone: phone,
                date: date,
                time: time,
                notes: notes || '',
                createdAt: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error('Error saving booking:', error);
            return false;
        }
    }

    // בדיקת תורים תפוסים בעת שינוי תאריך/שעה
    async function checkAvailability() {
        if (!dateInput?.value || !timeInput?.value || !window.firebaseDb) return;
        
        const isTaken = await isTimeSlotTaken(dateInput.value, timeInput.value);
        
        if (isTaken) {
            timeInput.setCustomValidity('תור זה תפוס. אנא בחרו תאריך או שעה אחרת.');
            timeInput.classList.add('error');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'תור תפוס - בחרו זמן אחר';
            }
        } else {
            timeInput.setCustomValidity('');
            timeInput.classList.remove('error');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path d="M5 13l4 4L19 7"/>
                    </svg>
                    שמור תור
                `;
            }
        }
    }

    // האזנה לשינויים בתאריך ושעה
    if (dateInput) {
        dateInput.addEventListener('change', checkAvailability);
    }
    if (timeInput) {
        timeInput.addEventListener('change', checkAvailability);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const date = formData.get('date');
            const time = formData.get('time');
            const notes = formData.get('notes') || '';
            
            // בדיקת תור תפוס לפני שליחה
            if (window.firebaseDb) {
                const isTaken = await isTimeSlotTaken(date, time);
                if (isTaken) {
                    alert('תור זה תפוס. אנא בחרו תאריך או שעה אחרת.');
                    return;
                }
            }
            
            // שמירת התור ב-Firebase
            if (window.firebaseDb) {
                const saved = await saveBooking(name, phone, date, time, notes);
                if (!saved) {
                    alert('אירעה שגיאה בשמירת התור. אנא נסו שוב.');
                    return;
                }
                
                // הודעה על הצלחה (ללא שליחה ל-WhatsApp לבדיקה)
                alert('התור נשמר בהצלחה!');
                
                // איפוס הטופס
                bookingForm.reset();
                if (dateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    dateInput.setAttribute('min', today);
                }
            } else {
                alert('Firebase לא מוגדר. אנא נסו שוב מאוחר יותר.');
            }
        });
    }
});
