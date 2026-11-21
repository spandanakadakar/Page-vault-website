# 📚 PageVault — OpenShelf · Campus Exchange

> A peer-to-peer campus textbook lending platform where students can list, discover, borrow, and return textbooks within their college community.

---

## ✨ Features

- **Explore Books** — Browse all textbooks shared by campus students; filter by availability, department, or search by title, author, or course code
- **List a Textbook** — Share a book you own with the campus community
- **Borrow Request Flow** — Request a book → lender approves/declines → 7-day loan starts automatically
- **Dashboard** — Personalized stats (books listed, active borrowings, pending requests, completed exchanges) with due-date reminders
- **My Listings** — View and track all books you've shared
- **My Exchanges** — Full history of borrow requests as both lender and borrower
- **Multi-user Preview** — Switch between demo users (Spandana, Prashanth, Sejal) to see how the app behaves for each role
- **Persistent State** — All data is saved to `localStorage`; your listings and exchanges survive page refreshes

---

## 🗂️ Project Structure

```
FSD/
├── index.html   # App shell — layout, pages, modal, and toast markup
├── style.css    # All styling — variables, components, responsive breakpoints
└── script.js    # App logic — state management, rendering, event handling
└── README.md    # You are here
```

---

## 🚀 Setup & Running Locally

This is a **pure front-end project** — no build tools, no package manager, no server required.

### Option 1 — Open directly in a browser (quickest)

1. Download or clone the repository so all three files are in the same folder.
2. Double-click `index.html` **or** drag it into any modern browser tab.
3. The app loads instantly.

### Option 2 — Use VS Code Live Server (recommended for development)

1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Install the **Live Server** extension (search `ritwickdey.liveserver` in the Extensions panel).
3. Open the project folder in VS Code.
4. Right-click `index.html` → **Open with Live Server**.
5. The browser opens at `http://127.0.0.1:5500/index.html` with hot-reload on save.

### Option 3 — Serve with Python (no install needed on most systems)

```bash
# Python 3
cd path/to/FSD
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### Option 4 — Serve with Node.js `npx`

```bash
cd path/to/FSD
npx serve .
```

Then follow the URL printed in the terminal (usually `http://localhost:3000`).

---

## 🧭 Usage Walkthrough

| Step | Action |
|------|--------|
| 1 | Use the **"Viewing as"** dropdown (top-right) to pick a demo user |
| 2 | Click **⌕ Explore Books** to browse the catalog |
| 3 | Click **Request** on any available book you don't own |
| 4 | Switch to the book owner's user and go to **Dashboard** to approve or decline the request |
| 5 | Switch back to the borrower — the book now shows as **Borrowed** with a 7-day due date |
| 6 | As the lender, go to **My Exchanges** and click **Confirm returned** when the book is back |
| 7 | Click **＋ List a book** (anywhere) to add your own textbook to the catalog |

---

## 🗄️ Data & State

- All data lives in **`localStorage`** under the keys `pv_books`, `pv_requests`, and `pv_user`.
- On first load the app seeds 9 sample textbooks across 5 departments (CS, Electronics, Mechanical, Mathematics, Physics).
- To reset to factory defaults, open your browser's DevTools → **Application → Local Storage** → clear the three `pv_*` keys and reload.

---

## 🌐 Browser Compatibility

Requires a modern browser with ES6+ and `localStorage` support.

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 80+            |
| Firefox | 75+            |
| Edge    | 80+            |
| Safari  | 13.1+          |

---

## 📐 Responsive Breakpoints

| Screen width | Layout |
|---|---|
| ≥ 900 px | 3-column book grid, 4-column stats |
| 640 – 900 px | 2-column book grid, 2-column stats |
| < 640 px | 1-column layout, sidebar hidden |

---

## 🛠️ Customisation Tips

- **Add more users** — extend the `names` object in `script.js` and add an `<option>` in the `#userSelect` dropdown in `index.html`.
- **Add more departments** — add `<option>` entries to both the filter `<select id="deptFilter">` and the form `<select name="department">`.
- **Change the loan period** — edit `r.dueDate = Date.now() + 7 * DAY` in the `approve()` function (`script.js`).
- **Swap localStorage for a real backend** — replace the `load()` / `save()` helpers with `fetch()` calls to your API.

---

## 📄 License

This project is intended for educational and campus-community use.  
Feel free to fork, extend, or adapt it for your institution.

---

*PageVault OpenShelf · Made for student communities* 📖
