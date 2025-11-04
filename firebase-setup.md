# הגדרת Firebase לזימון תורים

## שלב 1: יצירת פרויקט Firebase

1. היכנס ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על "Add project" או בחר פרויקט קיים
3. מלא את פרטי הפרויקט ושמור

## שלב 2: הוספת Web App

1. בחר את הפרויקט שלך
2. לחץ על האייקון `</>` (Web) או "Add app"
3. מלא שם עבור האפליקציה (למשל: "Dolev Barber")
4. העתק את פרטי הקונפיגורציה (firebaseConfig)

## שלב 3: הפעלת Firestore Database

1. בתפריט השמאלי, לחץ על "Firestore Database"
2. לחץ על "Create database"
3. בחר "Start in test mode" (לצורך התחלה)
4. בחר מיקום (למשל: us-central1)
5. לחץ "Enable"

## שלב 4: הגדרת כללי אבטחה (Rules)

1. בלשונית "Rules" ב-Firestore
2. החלף את הכללים עם:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{bookingId} {
      // אפשר קריאה לכל אחד
      allow read: if true;
      // אפשר כתיבה לכל אחד (לצורך שמירת תורים)
      allow create: if true;
      // מניעת עדכון ומחיקה (רק יצירת תורים חדשים)
      allow update, delete: if false;
    }
  }
}
```

3. לחץ "Publish"

## שלב 5: עדכון הקוד באתר

פתח את `index.html` ומצא את הקוד הבא:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

החלף את כל הערכים עם הפרטים מהקונפיגורציה שהעתקת בשלב 2.

## שלב 6: בדיקה

1. פתח את האתר
2. נסה להזמין תור
3. בדוק ב-Firebase Console שהתור נשמר ב-collection "bookings"

## איך זה עובד?

- כל תור נשמר ב-Firestore ב-collection בשם "bookings"
- כל תור מכיל: שם, טלפון, תאריך, שעה, הערות
- לפני שמירת תור חדש, המערכת בודקת אם יש כבר תור עם אותו תאריך ושעה
- אם התור תפוס, המשתמש מקבל הודעה ויוכל לבחור זמן אחר

## אבטחה (להמשך)

לאחר בדיקה, מומלץ לשנות את כללי האבטחה כדי להגביל כתיבה רק ממקורות מוגדרים.

