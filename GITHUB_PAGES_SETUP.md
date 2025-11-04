# הגדרת GitHub Pages - הוראות

## כדי שה-workflow יעבוד:

1. **הפעל GitHub Pages:**
   - לך ל: https://github.com/liorsal/dolev/settings/pages
   - תחת "Source" בחר: **"GitHub Actions"**
   - לחץ "Save"

2. **להשבית הודעות על כשלונות:**
   - לך ל: https://github.com/settings/notifications
   - תחת "Actions" בטל את הסימון של:
     - ✅ "Email"
     - ✅ "Workflow run failures"
   
   או להשבית רק לפרויקט הזה:
   - לך ל: https://github.com/liorsal/dolev/settings/notifications
   - בטל את הסימון של "Email" תחת Actions

## אם לא צריך GitHub Pages בכלל:

פשוט מחק את הקובץ `.github/workflows/pages.yml`

