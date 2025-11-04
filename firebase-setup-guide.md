# מדריך צעד אחר צעד להגדרת Firebase

## שלב 1: יצירת פרויקט Firebase

1. היכנס ל-[Firebase Console](https://console.firebase.google.com/)
2. לחץ על **"Add project"** (או "הוסף פרויקט")
3. מלא שם לפרויקט (למשל: "dolev-barber")
4. לחץ **"Continue"**
5. (אופציונלי) בטל את הסימון ב-Google Analytics אם לא צריך
6. לחץ **"Create project"**
7. לחץ **"Continue"** כשהפרויקט מוכן

## שלב 2: מציאת פרטי הקונפיגורציה (Firebase Config)

### איפה מוצאים את הפרטים?

1. בפרויקט שיצרת, לחץ על האייקון **`</>`** (Web) או על **"Add app"** → **"Web"**
   - או לחץ על **⚙️** (Settings) → **"Project settings"** → גלול למטה לסקשן **"Your apps"**

2. מלא שם לאפליקציה (למשל: "Dolev Barber Website")
   - **אין צורך** לסמן את "Also set up Firebase Hosting"

3. לחץ **"Register app"**

4. **כאן תראה את הקוד!** זה נראה כך:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC1234567890abcdefghijklmnopqrst",
     authDomain: "dolev-barber.firebaseapp.com",
     projectId: "dolev-barber",
     storageBucket: "dolev-barber.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```

5. **העתק את כל הערכים** מ-`firebaseConfig`

6. פתח את הקובץ `index.html` באתר שלך

7. מצא את השורות 309-316:
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

8. **החלף** את כל הערכים עם הערכים שהעתקת

### דוגמה:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC1234567890abcdefghijklmnopqrst",
    authDomain: "dolev-barber.firebaseapp.com",
    projectId: "dolev-barber",
    storageBucket: "dolev-barber.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

**שמור את הקובץ!**

## שלב 3: הפעלת Firestore Database

### איך להפעיל?

1. ב-Firebase Console, בתפריט השמאלי, לחץ על **"Firestore Database"**
   - אם לא רואה, לחץ על **"Build"** → **"Firestore Database"**

2. לחץ על **"Create database"** (או "צור מסד נתונים")

3. **בחר מצב**:
   - **"Start in test mode"** ← **בחר את זה!** (לצורך התחלה)
   - לחץ **"Next"**

4. **בחר מיקום** (Location):
   - בחר מיקום קרוב (למשל: `us-central1` או `europe-west1`)
   - לחץ **"Enable"**

5. **המתן** כמה שניות עד שהמסד נתונים מוכן

6. ✅ **זהו!** Firestore מופעל

## שלב 4: הגדרת כללי אבטחה (Rules)

1. בלשונית **"Rules"** (ב-Firestore Database)

2. החלף את הכללים עם הקוד הבא:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /bookings/{bookingId} {
         // אפשר קריאה לכל אחד
         allow read: if true;
         // אפשר כתיבה (יצירת תורים חדשים) לכל אחד
         allow create: if true;
         // מניעת עדכון ומחיקה
         allow update, delete: if false;
       }
     }
   }
   ```

3. לחץ **"Publish"**

## שלב 5: בדיקה

1. פתח את האתר שלך
2. נסה להזמין תור בטופס
3. חזור ל-Firebase Console → **"Firestore Database"**
4. לחץ על **"bookings"** (אם לא רואה, רענן את הדף)
5. אתה אמור לראות את התור שנרשם!

## פתרון בעיות

### "Firebase not initialized"
- וודא שהעתקת את כל הפרטים נכון ב-`index.html`
- וודא שאין שגיאות ב-Console של הדפדפן

### "Permission denied"
- וודא שהגדרת את Rules ב-Firestore (שלב 4)
- וודא שלחצת "Publish" אחרי שינוי ה-Rules

### לא רואה את התורים ב-Firestore
- רענן את הדף ב-Firebase Console
- בדוק שהתור באמת נשלח (ללא שגיאות ב-Console)

## הצעדים הבאים (אופציונלי)

לאחר שזה עובד, מומלץ:
1. לשנות את ה-Rules ליותר מאובטחים
2. להוסיף לוגין למנהל כדי לראות את כל התורים
3. להוסיף אפשרות למחוק תורים ישנים

---

**אם יש בעיות, בדוק את ה-Console של הדפדפן (F12) כדי לראות שגיאות.**

