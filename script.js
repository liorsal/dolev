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

    // פונקציה לקביעת שעות פעילות לפי יום בשבוע
    function getWorkingHours(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const dayOfWeek = date.getDay(); // 0 = ראשון, 5 = שישי
        
        if (dayOfWeek === 5) { // שישי
            return { min: '08:30', max: '15:00' };
        } else if (dayOfWeek >= 0 && dayOfWeek <= 4) { // א-ה
            return { min: '09:00', max: '19:00' };
        }
        return { min: '09:00', max: '19:00' }; // ברירת מחדל
    }

    // עדכן שעות פעילות בהתאם לתאריך שנבחר
    function updateTimeInput() {
        if (!dateInput?.value || !timeInput) return;
        
        const workingHours = getWorkingHours(dateInput.value);
        timeInput.setAttribute('min', workingHours.min);
        timeInput.setAttribute('max', workingHours.max);
        
        // אם השעה הנוכחית לא תקינה, איפוס
        if (timeInput.value && (timeInput.value < workingHours.min || timeInput.value > workingHours.max)) {
            timeInput.value = '';
        }
    }

    // פונקציה להמרת זמן לדקות
    function timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // פונקציה להמרת דקות לזמן
    function minutesToTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // פונקציה לבדיקת תור תפוס (כולל 30 דקות לפני ואחרי)
    async function isTimeSlotTaken(date, time) {
        if (!window.firebaseDb) {
            console.warn('Firebase not initialized');
            return false;
        }
        
        try {
            const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            const bookingsRef = collection(window.firebaseDb, 'bookings');
            const q = query(bookingsRef, where('date', '==', date));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) return false;
            
            // בדוק אם יש תור בטווח של 30 דקות (לפני או אחרי)
            const requestedTimeMinutes = timeToMinutes(time);
            const bookings = [];
            querySnapshot.forEach((doc) => {
                bookings.push(doc.data().time);
            });
            
            // בדוק כל תור קיים
            for (const bookingTime of bookings) {
                const bookingTimeMinutes = timeToMinutes(bookingTime);
                const timeDiff = Math.abs(requestedTimeMinutes - bookingTimeMinutes);
                
                // אם ההבדל קטן או שווה ל-30 דקות, התור תפוס
                if (timeDiff <= 30) {
                    console.log(`תור תפוס: ${time} קרוב מדי ל-${bookingTime} (הבדל: ${timeDiff} דקות)`);
                    return true;
                }
            }
            
            return false;
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
        if (!dateInput?.value || !timeInput?.value) {
            if (timeInput) {
                timeInput.setCustomValidity('');
                timeInput.classList.remove('error');
            }
            return;
        }
        
        // בדוק תחילה שהשעה בטווח שעות הפעילות
        const workingHours = getWorkingHours(dateInput.value);
        if (timeInput.value < workingHours.min || timeInput.value > workingHours.max) {
            const dayName = new Date(dateInput.value + 'T00:00:00').toLocaleDateString('he-IL', { weekday: 'long' });
            if (dayName === 'יום שישי') {
                timeInput.setCustomValidity('ביום שישי שעות הפעילות הן 8:30-15:00');
            } else {
                timeInput.setCustomValidity('שעות הפעילות הן 9:00-19:00');
            }
            timeInput.classList.add('error');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'שעה לא תקינה';
            }
            return;
        }
        
        if (!window.firebaseDb) {
            timeInput.setCustomValidity('');
            timeInput.classList.remove('error');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = `
                    <svg class="whatsapp-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    הירשם
                `;
            }
            return;
        }
        
        const isTaken = await isTimeSlotTaken(dateInput.value, timeInput.value);
        
        if (isTaken) {
            // נסה למצוא איזה תור תפוס קרוב כדי לתת הודעה ברורה יותר
            try {
                const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const bookingsRef = collection(window.firebaseDb, 'bookings');
                const q = query(bookingsRef, where('date', '==', dateInput.value));
                const querySnapshot = await getDocs(q);
                
                const requestedTimeMinutes = timeToMinutes(timeInput.value);
                let closestTime = null;
                let minDiff = Infinity;
                
                querySnapshot.forEach((doc) => {
                    const bookingTime = doc.data().time;
                    const bookingTimeMinutes = timeToMinutes(bookingTime);
                    const timeDiff = Math.abs(requestedTimeMinutes - bookingTimeMinutes);
                    
                    if (timeDiff <= 30 && timeDiff < minDiff) {
                        minDiff = timeDiff;
                        closestTime = bookingTime;
                    }
                });
                
                let errorMessage = 'תור זה תפוס או קרוב מדי לתור אחר. אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).';
                if (closestTime) {
                    errorMessage = `תור זה תפוס! יש כבר תור ב-${closestTime} (${minDiff} דקות מהזמן שביקשת). אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).`;
                }
                
                timeInput.setCustomValidity(errorMessage);
            } catch (error) {
                console.error('Error getting booking details:', error);
                timeInput.setCustomValidity('תור זה תפוס או קרוב מדי לתור אחר. אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).');
            }
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
                    <svg class="whatsapp-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    הירשם
                `;
            }
        }
    }

    // האזנה לשינויים בתאריך ושעה
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            updateTimeInput();
            if (timeInput?.value) {
                checkAvailability();
            }
        });
    }
    if (timeInput) {
        timeInput.addEventListener('change', checkAvailability);
        timeInput.addEventListener('input', checkAvailability);
    }
    
    // עדכן שעות פעילות בהתאם לתאריך הנוכחי
    updateTimeInput();

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const date = formData.get('date');
            const time = formData.get('time');
            const notes = formData.get('notes') || '';
            
            // בדיקת תקינות השעה בטווח שעות הפעילות
            const workingHours = getWorkingHours(date);
            if (time < workingHours.min || time > workingHours.max) {
                const dayName = new Date(date + 'T00:00:00').toLocaleDateString('he-IL', { weekday: 'long' });
                if (dayName === 'יום שישי') {
                    alert('ביום שישי שעות הפעילות הן 8:30-15:00');
                } else {
                    alert('שעות הפעילות הן 9:00-19:00');
                }
                return;
            }
            
            // בדיקת תור תפוס לפני שליחה
            if (window.firebaseDb) {
                const isTaken = await isTimeSlotTaken(date, time);
                if (isTaken) {
                    // בדוק איזה תור תפוס קרוב כדי לתת הודעה ברורה יותר
                    try {
                        const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                        const bookingsRef = collection(window.firebaseDb, 'bookings');
                        const q = query(bookingsRef, where('date', '==', date));
                        const querySnapshot = await getDocs(q);
                        
                        const requestedTimeMinutes = timeToMinutes(time);
                        let closestTime = null;
                        let minDiff = Infinity;
                        
                        querySnapshot.forEach((doc) => {
                            const bookingTime = doc.data().time;
                            const bookingTimeMinutes = timeToMinutes(bookingTime);
                            const timeDiff = Math.abs(requestedTimeMinutes - bookingTimeMinutes);
                            
                            if (timeDiff <= 30 && timeDiff < minDiff) {
                                minDiff = timeDiff;
                                closestTime = bookingTime;
                            }
                        });
                        
                        if (closestTime) {
                            alert(`תור זה תפוס! יש כבר תור ב-${closestTime} (${minDiff} דקות מהזמן שביקשת). אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).`);
                        } else {
                            alert('תור זה תפוס או קרוב מדי לתור אחר. אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).');
                        }
                    } catch (error) {
                        console.error('Error getting booking details:', error);
                        alert('תור זה תפוס או קרוב מדי לתור אחר. אנא בחרו תאריך או שעה אחרת (חייב להיות לפחות חצי שעה בין תורים).');
                    }
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
            } else {
                alert('Firebase לא מוגדר. אנא נסו שוב מאוחר יותר.');
                return;
            }
            
            // פורמט תאריך לעברית
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('he-IL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // בניית הודעה ל-WhatsApp
            let message = `שלום! תיאמתי תור:\n\n`;
            message += `👤 שם: ${name}\n`;
            message += `📞 טלפון: ${phone}\n`;
            message += `📅 תאריך: ${formattedDate}\n`;
            message += `🕐 שעה: ${time}\n`;
            
            if (notes.trim()) {
                message += `📝 הערות: ${notes}\n`;
            }
            
            message += `\nתודה!`;
            
            // קידוד הודעה ל-URL
            const encodedMessage = encodeURIComponent(message);
            
            // פתיחת WhatsApp עם הודעה מוכנה ישירות לדולב
            // מספר טלפון בפורמט בינלאומי: 0525222787 -> 972525222787
            const phoneNumber = '972525222787'; // דולב מלול
            
            // פתיחת WhatsApp ישירות באפליקציה (לא באתר)
            // נשתמש ב-wa.me שיפתח את האפליקציה אם מותקנת, אחרת את האתר
            // או whatsapp:// לפתיחה ישירה באפליקציה
            // ננסה קודם whatsapp:// ואם זה לא עובד, נשתמש ב-wa.me
            const whatsappAppUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
            const whatsappWebUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            // איפוס הטופס לפני מעבר לווצאפ
            bookingForm.reset();
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.setAttribute('min', today);
            }
            
            // פתח WhatsApp ישירות באפליקציה - ההודעה תישלח ישירות לדולב
            // נשתמש ב-wa.me שיפתח את האפליקציה ישירות אם היא מותקנת
            // wa.me עובד טוב יותר מ-whatsapp:// כי הוא מטפל גם במקרה שהאפליקציה לא מותקנת
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || 
                           (navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && 
                            navigator.userAgent && !navigator.userAgent.match('CriOS') && 
                            !navigator.userAgent.match('FxiOS'));
            
            // wa.me יפתח את האפליקציה ישירות אם היא מותקנת, אחרת את האתר
            // זה עדיף מ-whatsapp:// כי הוא עובד גם אם האפליקציה לא מותקנת
            if (isSafari) {
                // בספארי, נשתמש ב-location.href ישירות
                window.location.href = whatsappWebUrl;
            } else {
                // בדפדפנים אחרים, ננסה לפתוח בחלון חדש
                try {
                    const newWindow = window.open(whatsappWebUrl, '_blank', 'noopener,noreferrer');
                    
                    // אם popup נחסם, נשתמש ב-location.href
                    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                        window.location.href = whatsappWebUrl;
                    }
                } catch (error) {
                    // אם יש שגיאה, נשתמש ב-location.href ישירות
                    console.error('Error opening WhatsApp:', error);
                    window.location.href = whatsappWebUrl;
                }
            }
        });
    }
});
