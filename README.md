# O'qish Rehberi

Create a modern, professional web platform for Uzbek students preparing for the State Admission Tests and choosing universities in Uzbekistan.

The platform should be in Uzbek language by default and have a clean, premium, modern education-tech design. It should work perfectly on both desktop and mobile.

PROJECT CONCEPT

The website helps an applicant:

1. Enter their State Test score.
2. Select their subjects, education language, study format and other preferences.
3. See which universities and degree programs they could potentially enter based on previous admission scores.
4. Compare universities and programs.
5. Practice State Test questions.
6. Study preparation materials.
7. Track their progress.
8. Receive personalized recommendations.

IMPORTANT:
Never tell the user that admission is guaranteed. Use wording such as:

- "Yuqori imkoniyat"
- "Real imkoniyat"
- "Raqobat yuqori"
- "O'tgan yilgi ma'lumotlar asosida"

Clearly display the year of the admission-score data.

---

1. HOME PAGE

Create a strong hero section.

Headline:

"Ballingiz bilan qayerga kira olishingizni bilib oling."

Subtitle:

"Test natijangizni kiriting va O'zbekiston universitetlari orasidan sizga mos variantlarni toping."

Primary button:
"Ballimni tekshirish"

Secondary button:
"Test ishlash"

Below the hero show 3 feature cards:

🎓 Universitet tanlash
"Ballingizga mos yo'nalishlarni toping."

📊 Ball tahlili
"Natijangizni o'tgan yilgi ko'rsatkichlar bilan solishtiring."

📚 Testga tayyorgarlik
"Mavzular, testlar va materiallar orqali tayyorlaning."

Add a statistics section:

- Universitetlar
- Yo'nalishlar
- Test savollari
- O'quvchilar

Use realistic placeholder numbers for now, but make them easy to replace later with real database values.

---

2. SCORE CALCULATOR

Create a dedicated page:

"/calculator"

Title:

"Ballingizni tekshiring"

Form fields:

- To'plagan ball
- Fanlar majmuasi
- Ta'lim tili
- Ta'lim shakli
- Hudud
- Grant / Kontrakt
- Preferred university type

The user should be able to enter their score and click:

"Universitetlarni topish"

After submission, show a results dashboard.

---

3. UNIVERSITY RESULTS

Create a page:

"/results"

Display results as cards or a clean table.

Each result should contain:

- University name
- Degree program
- Previous admission score
- User's score
- Difference
- Grant / Contract
- Education language
- Study format
- Region
- Admission year

Show a status badge:

GREEN:
"Yuqori imkoniyat"

YELLOW:
"Real imkoniyat"

RED:
"Raqobat yuqori"

Example:

Toshkent Axborot Texnologiyalari Universiteti

Dasturiy injiniring

O'tgan yilgi o'tish bali: 172.4
Sizning ballingiz: 175.0

+2.6 ball

Status:
"Real imkoniyat"

IMPORTANT:
The algorithm must NOT say "Siz albatta kirasiz."

Add a disclaimer:

"Natijalar o'tgan yillardagi ma'lumotlar asosida taxminiy hisoblanadi. O'tish ballari har yili o'zgarishi mumkin."

Add filters:

- Universitet
- Hudud
- Yo'nalish
- Grant
- Kontrakt
- Ta'lim tili
- Ta'lim shakli
- Minimum / maximum score

Add sorting:

- Ball bo'yicha
- Universitet nomi
- Eng katta imkoniyat
- Eng yaqin o'tish bali

---

4. UNIVERSITY DATABASE

Create:

"/universities"

A searchable university directory.

Each university card should contain:

- University name
- Logo placeholder
- Location
- Number of programs
- Previous admission scores
- "Batafsil" button

University detail page:

"/universities/:id"

Show:

- University name
- Location
- About
- Programs
- Admission scores
- Grant scores
- Contract scores
- Education languages
- Study formats

Add a search bar:

"Universitet yoki yo'nalish qidiring..."

---

5. PROGRAM SEARCH

Create:

"/programs"

Allow users to search degree programs.

Filters:

- Subject combination
- University
- Region
- Education language
- Grant / Contract
- Study format

Each program should show:

Program name
University
Previous admission score
Available study formats
"Ballim bilan tekshirish" button

---

6. TEST PREPARATION

Create:

"/tests"

This should be one of the main sections.

Show subject cards:
[9/14/2026 7:06 PM] Aybxon jgar: - Matematika

- Ona tili
- O'zbekiston tarixi
- Ingliz tili
- Other subjects depending on the selected admission combination

Each subject page:

"/tests/:subject"

Show categories:

- Mavzular
- Testlar
- Mini test
- Mock test
- Xatolarim

Allow the student to start a test.

---

7. TEST INTERFACE

Create a professional exam interface.

Top section:

"Matematika — Mini Test"

Show:

Question number
Timer
Progress

Example:

12 / 30

Question area:

"Question text"

Answer choices:

A
B
C
D

Buttons:

"Oldingi"
"Keyingi"

Add:

"Belgilang"

for questions the student wants to review later.

At the end show:

"Testni yakunlash"

Before submitting, show a confirmation modal.

---

8. TEST RESULTS

After completing a test, show a detailed results page.

Display:

- Total questions
- Correct answers
- Incorrect answers
- Unanswered
- Percentage
- Time spent

Example:

Natija: 24 / 30

80%

Then show question review.

Correct answer:
Green indicator

Incorrect answer:
Red indicator

For every question show:

- User answer
- Correct answer
- Explanation

Add:

"Xatolarimni qayta ishlash"

button.

---

9. STUDY MATERIALS

Create:

"/materials"

Sections:

📚 Darsliklar
📝 Konspektlar
📄 PDF materiallar
🎥 Video darslar
🧠 Formulalar
📌 Muhim mavzular

Each material card:

Title
Subject
Topic
Difficulty
Format
"Ko'rish" button

Design this section like a digital library.

---

10. PERSONAL DASHBOARD

Create:

"/dashboard"

For logged-in users.

Show:

Welcome message:

"Salom, [name]!"

Dashboard cards:

🎯 Maqsad ball
📊 Hozirgi natija
📝 Ishlangan testlar
🔥 Streak

Progress section:

"Maqsad sari"

Example:

Current score: 142
Target score: 175

Progress bar.

Then:

"Bugungi vazifalar"

Example:

☐ 30 ta matematika testi
☐ 20 ta ona tili testi
☐ 1 ta mini mock
☐ 1 ta mavzu o'rganish

---

11. PERSONALIZED WEAKNESS ANALYSIS

Create a section:

"Mening kuchsiz mavzularim"

After enough tests, calculate performance by topic.

Example:

Matematika:

Tenglamalar — 58%
Funksiyalar — 71%
Geometriya — 89%

Then recommend:

"Sizga hozir Tenglamalar mavzusini qayta ishlash tavsiya qilinadi."

Button:

"Mavzuni o'rganish"

---

12. UNIVERSITY COMPARISON

Allow users to select two or more universities.

Create:

"/compare"

Compare:

- University
- Location
- Program
- Previous admission score
- Grant
- Contract
- Education language
- Study format

Make the comparison visually clean and easy to understand.

---

13. "MENING UNIVERSITETLARIM"

Allow users to save universities.

Heart/bookmark icon:

"Saqlash"

Create:

"/saved"

Show saved universities and programs.

---

14. ROADMAP

Create:

"/roadmap"

The user enters:

Current score
Target score
Exam date

Then generate a study roadmap.

Example:

142 → 150
150 → 160
160 → 170
170 → 175

Show weekly goals.

Do not promise a guaranteed score increase.

---

15. LEADERBOARD

Create:

"/leaderboard"

Show weekly/monthly test rankings.

Use usernames rather than requiring real names.

Columns:

Rank
Username
Tests completed
Average score

Add filters:

- Today
- This week
- This month

---

16. USER AUTHENTICATION

Add:

Register
Login
Logout

Registration:

- Name
- Username
- Email
- Password

After registration create a personal dashboard.

Do not expose sensitive personal information publicly.

---

17. NAVIGATION

Desktop navbar:

Logo

Bosh sahifa
Universitetlar
Yo'nalishlar
Ballimni tekshirish
Testlar
Materiallar

Right side:

Kirish
Profil

Mobile:

Use a clean bottom navigation or hamburger menu.

---

18. DESIGN

Design style:

Modern Uzbek education technology platform.

Use:

- Dark navy / blue as the main visual identity
- White and light gray backgrounds where appropriate
- Blue accent colors
- Rounded cards
- Subtle shadows
- Clean typography
- Professional icons
- Smooth animations
- Plenty of whitespace

Do NOT make it childish.

Do NOT use excessive stickers or emojis.

Avoid excessive gradients.

The website should feel similar in quality to a modern SaaS product.

Use responsive design.

Desktop, tablet and mobile must all work properly.

---

19. DATABASE STRUCTURE
    [9/14/2026 7:06 PM] Aybxon jgar: Prepare the application so it can later connect to Supabase.

Create database-ready structures for:

users
universities
programs
admission_scores
subjects
topics
questions
answers
tests
test_attempts
materials
saved_universities
user_progress
user_goals

Important fields for admission_scores:

- year
- university_id
- program_id
- admission_type
- education_language
- study_format
- score

The system should be designed so that admission-score data can be updated every year without rebuilding the website.

---

20. ADMIN PANEL

Create an admin area:

"/admin"

Admin should be able to:

- Add university
- Edit university
- Add program
- Edit program
- Add admission score
- Update yearly scores
- Add questions
- Edit questions
- Add explanations
- Upload materials
- View test statistics
- View users

Add confirmation dialogs before destructive actions.

---

21. IMPORTANT DATA LOGIC

The university recommendation system must compare:

USER SCORE vs PREVIOUS ADMISSION SCORE

Calculate:

difference = userScore - previousScore

Use a configurable threshold for status.

For example:

difference >= +5:
"Yuqori imkoniyat"

difference between -2 and +5:
"Real imkoniyat"

difference < -2:
"Raqobat yuqori"

Make these thresholds configurable in the future.

Never hard-code the assumption that previous admission scores guarantee future admission.

---

22. FUTURE FEATURES

Prepare the architecture so we can later add:

- AI study assistant
- AI explanation of questions
- Personalized study plans
- Telegram bot integration
- Notifications
- Daily challenges
- Streak system
- Premium materials
- Paid courses
- Mock exams
- Scholarship information
- Admission calendar
- Exam countdown
- University reviews
- Student community
- Question reporting
- Teacher/admin accounts

Do not implement complicated paid features yet. Make the architecture expandable.

---

23. UX REQUIREMENTS

The most important user journey should be:

HOME
↓
Enter Score
↓
Select preferences
↓
Find Universities
↓
See Results
↓
Choose University
↓
See Programs
↓
Start Preparation
↓
Take Test
↓
See Mistakes
↓
Improve Score

Make this journey extremely simple.

The user should understand what to do within 5 seconds of opening the website.

---

24. DEMO DATA

For the first version, use realistic placeholder/demo data for universities, programs, questions and scores.

Clearly structure the data so I can replace it later with official data.

Do not claim demo data is official.

Add a small label where appropriate:

"Demo ma'lumot"

---

25. FINAL QUALITY

Make the website production-quality visually.

Prioritize:

1. Clean UX
2. Fast navigation
3. Responsive design
4. Accurate score calculations
5. Easy database updates
6. Professional UI
7. Expandable architecture

Do not create a simple landing page.

Build the actual multi-page application with functional navigation, forms, filters, test interface, score calculator, results pages and dashboard.

Start with the core MVP functionality first, but structure everything so additional features can easily be added later.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://unitopuz.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/85a01f9e-a5d9-4aaf-ad7b-0d58b45ec623).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
