// ── Helpers ──
const $ = id => document.getElementById(id);
const names = { spandana: 'Spandana', prashanth: 'Prashanth', sejal: 'Sejal' };
const getName = key => names[key] || key || 'Unknown';
const DAY = 86400000;

// ── Sample Data ──
const seedBooks = [
  // ── Prashanth (3 books) ──
  { id: 'b1', title: 'Operating System Concepts',            author: 'Abraham Silberschatz',  edition: '10th',   course: 'CS301', dept: 'Computer Science', condition: 'Good',      owner: 'prashanth', status: 'Available' },
  { id: 'b2', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose',     edition: '8th',    course: 'CS302', dept: 'Computer Science', condition: 'Like New',  owner: 'prashanth', status: 'Available' },
  { id: 'b4', title: 'Digital Design',                       author: 'M. Morris Mano',       edition: '6th',    course: 'EC204', dept: 'Electronics',      condition: 'Well Used', owner: 'prashanth', status: 'Available' },
  // ── Spandana (3 books) ──
  { id: 'b3', title: 'Database System Concepts',             author: 'Abraham Silberschatz',  edition: '7th',    course: 'CS303', dept: 'Computer Science', condition: 'Good',      owner: 'spandana',  status: 'Available' },
  { id: 'b5', title: 'Engineering Mathematics',              author: 'B. S. Grewal',          edition: '44th',   course: 'MA201', dept: 'Mathematics',      condition: 'Good',      owner: 'spandana',  status: 'Available' },
  { id: 'b7', title: 'Concepts of Physics',                  author: 'H. C. Verma',           edition: 'Part I', course: 'PH101', dept: 'Physics',          condition: 'Good',      owner: 'spandana',  status: 'Available' },
  // ── Sejal (3 books) ──
  { id: 'b9', title: 'Introduction to Algorithms',           author: 'Thomas H. Cormen',      edition: '4th',    course: 'CS305', dept: 'Computer Science', condition: 'Like New',  owner: 'sejal',     status: 'Available' },
  { id: 'b6', title: 'Engineering Mechanics',                author: 'R. K. Bansal',          edition: 'Latest', course: 'ME201', dept: 'Mechanical',       condition: 'Like New',  owner: 'sejal',     status: 'Available' },
  { id: 'b8', title: 'Let Us C',                             author: 'Yashavant Kanetkar',    edition: '18th',   course: 'CS101', dept: 'Computer Science', condition: 'Good',      owner: 'sejal',     status: 'Available' },
];

// ── State ──
const DATA_VERSION = 'v3';
if (localStorage.getItem('pv_version') !== DATA_VERSION) {
  localStorage.removeItem('pv_books');
  localStorage.removeItem('pv_requests');
  localStorage.removeItem('pv_user');
  localStorage.setItem('pv_version', DATA_VERSION);
}

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

let books    = load('pv_books', seedBooks);
let requests = load('pv_requests', []);
let user     = localStorage.getItem('pv_user') || 'spandana';

function save() {
  localStorage.setItem('pv_books',    JSON.stringify(books));
  localStorage.setItem('pv_requests', JSON.stringify(requests));
  localStorage.setItem('pv_user',     user);
  localStorage.setItem('pv_version',  DATA_VERSION);
}

// ── Toast ──
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// ── Escape HTML ──
function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── Book Cover ──
function cover(title, course) {
  return `<div class="cover"><b>${esc(title)}</b><small>${esc(course)} · OPENSHELF</small></div>`;
}

// ── Days Left ──
function daysLeft(due) { return Math.ceil((due - Date.now()) / DAY); }

// ── Catalog ──
function renderCatalog() {
  const q   = $('searchInput').value.toLowerCase();
  const st  = $('statusFilter').value;
  const dep = $('deptFilter').value;

  const found = books.filter(b =>
    [b.title, b.author, b.course, b.dept].join(' ').toLowerCase().includes(q) &&
    (st  === 'all' || b.status === st) &&
    (dep === 'all' || b.dept   === dep)
  );

  $('resultCount').textContent = `${found.length} book${found.length !== 1 ? 's' : ''}`;

  $('bookGrid').innerHTML = found.length
    ? found.map(b => `
        <article class="book-card">
          ${cover(b.title, b.course)}
          <div class="book-info">
            <h4>${esc(b.title)}</h4>
            <div class="author">${esc(b.author)}</div>
            <div class="tags">
              <span class="tag course">${esc(b.course)}</span>
              <span class="tag">${esc(b.condition)}</span>
            </div>
            <span class="status ${b.status.toLowerCase()}">${b.status}</span>
            <div class="card-bottom">
              <span class="owner">By ${getName(b.owner)}</span>
              ${b.owner === user
                ? `<span class="muted">Your book</span>`
                : b.status === 'Available'
                  ? `<button class="btn btn-primary btn-sm" onclick="requestBook('${b.id}')">Request</button>`
                  : `<span class="muted">${b.status}</span>`}
            </div>
          </div>
        </article>`).join('')
    : `<div class="empty">⌕<strong>No books found</strong>Try a different title or course code.</div>`;
}

// ── Request a Book ──
function requestBook(id) {
  const b = books.find(x => x.id === id);
  if (!b || b.status !== 'Available' || b.owner === user) return;
  b.status = 'Reserved';
  requests.push({ id: 'r' + Date.now(), bookId: id, owner: b.owner, borrower: user, status: 'Pending', requestedAt: Date.now(), dueDate: null });
  save(); render();
  toast(`Borrow request sent to ${getName(b.owner)}`);
}

// ── Approve / Reject / Return ──
function approve(id) {
  const r = requests.find(x => x.id === id);
  if (!r || r.status !== 'Pending') return;
  r.status = 'Approved'; r.approvedAt = Date.now(); r.dueDate = Date.now() + 7 * DAY;
  const b = books.find(x => x.id === r.bookId);
  if (b) b.status = 'Borrowed';
  save(); render(); toast('Request approved — 7-day loan started');
}

function reject(id) {
  const r = requests.find(x => x.id === id);
  if (!r) return;
  r.status = 'Rejected';
  const b = books.find(x => x.id === r.bookId);
  if (b) b.status = 'Available';
  save(); render(); toast('Request declined');
}

function markReturned(id) {
  const r = requests.find(x => x.id === id);
  if (!r) return;
  r.status = 'Returned'; r.returnedAt = Date.now();
  const b = books.find(x => x.id === r.bookId);
  if (b) b.status = 'Available';
  save(); render(); toast('Book marked as returned');
}

// ── Dashboard ──
function renderDashboard() {
  const mine     = books.filter(b => b.owner === user);
  const borrowed = requests.filter(r => r.borrower === user && r.status === 'Approved');
  const pending  = requests.filter(r => r.owner   === user && r.status === 'Pending');
  const done     = requests.filter(r => (r.owner === user || r.borrower === user) && r.status === 'Returned');

  $('welcomeName').textContent   = getName(user);
  $('statListed').textContent    = mine.length;
  $('statBorrowed').textContent  = borrowed.length;
  $('statPending').textContent   = pending.length;
  $('statReturned').textContent  = done.length;

  // Reminders
  $('reminderArea').innerHTML = borrowed.map(r => {
    const b = books.find(x => x.id === r.bookId);
    const d = daysLeft(r.dueDate);
    const msg = d < 0 ? `Overdue by ${Math.abs(d)} day(s).` : d === 0 ? 'Due today!' : `${d} day(s) left.`;
    return `<div class="reminder"><span>⏰</span><div><strong>${esc(b?.title || 'Book')}</strong><p>${msg} Due ${new Date(r.dueDate).toLocaleDateString()}.</p></div></div>`;
  }).join('');

  // Incoming requests
  $('incomingRequests').innerHTML = pending.length
    ? pending.map(r => {
        const b = books.find(x => x.id === r.bookId);
        return `<div class="request-card">
          <div>
            <strong>${esc(b?.title || 'Book')}</strong>
            <p>${getName(r.borrower)} requested · ${new Date(r.requestedAt).toLocaleDateString()}</p>
          </div>
          <div class="actions">
            <button class="btn btn-primary btn-sm" onclick="approve('${r.id}')">Approve</button>
            <button class="btn btn-light btn-sm"   onclick="reject('${r.id}')">Decline</button>
          </div>
        </div>`;
      }).join('')
    : `<p class="muted" style="padding:10px 0;">No pending requests.</p>`;

  // Current borrowings
  $('dashBorrowings').innerHTML = borrowed.length
    ? borrowed.map(r => {
        const b = books.find(x => x.id === r.bookId);
        const d = daysLeft(r.dueDate);
        const pct = Math.max(0, Math.min(100, (d / 7) * 100));
        return `<div class="request-card">
          <div style="flex:1;">
            <strong>${esc(b?.title || 'Book')}</strong>
            <p>Borrowed from ${getName(r.owner)} · Due ${new Date(r.dueDate).toLocaleDateString()}</p>
            <div class="progress"><span style="width:${pct}%"></span></div>
          </div>
          <span class="muted">${d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'Due today' : `${d}d left`}</span>
        </div>`;
      }).join('')
    : `<p class="muted" style="padding:10px 0;">No active borrowings. Explore the catalog!</p>`;
}

// ── My Listings ──
function renderMyBooks() {
  const mine = books.filter(b => b.owner === user);
  $('myBooksTable').innerHTML = mine.length
    ? `<div class="table-wrap"><table>
        <thead><tr><th>Book</th><th>Course</th><th>Condition</th><th>Status</th></tr></thead>
        <tbody>${mine.map(b => `
          <tr>
            <td><div class="book-cell">${esc(b.title)}</div><div class="muted">${esc(b.author)}</div></td>
            <td>${esc(b.course)}</td>
            <td>${esc(b.condition)}</td>
            <td><span class="status ${b.status.toLowerCase()}">${b.status}</span></td>
          </tr>`).join('')}
        </tbody>
      </table></div>`
    : `<div class="empty">You haven't listed any books yet.</div>`;
}

// ── Exchanges ──
function renderExchanges() {
  const mine = requests.filter(r => r.owner === user || r.borrower === user);
  $('exchangeList').innerHTML = mine.length
    ? [...mine].reverse().map(r => {
        const b          = books.find(x => x.id === r.bookId);
        const isBorrower = r.borrower === user;
        const d          = r.dueDate ? daysLeft(r.dueDate) : null;
        return `<div class="request-card">
          <div>
            <strong>${esc(b?.title || 'Book')}</strong>
            <p>${isBorrower ? `Borrowing from ${getName(r.owner)}` : `Requested by ${getName(r.borrower)}`} · ${new Date(r.requestedAt).toLocaleDateString()}</p>
            <span class="status ${r.status.toLowerCase()}">${r.status}</span>
            ${r.status === 'Approved' ? `<span class="muted"> · ${d < 0 ? `${Math.abs(d)}d overdue` : `${d}d left`}</span>` : ''}
          </div>
          <div class="actions">
            ${r.status === 'Approved' && !isBorrower
              ? `<button class="btn btn-primary btn-sm" onclick="markReturned('${r.id}')">Confirm returned</button>` : ''}
          </div>
        </div>`;
      }).join('')
    : `<div class="empty">No exchanges yet. Request a book to get started.</div>`;
}

// ── Full Render ──
function render() {
  renderCatalog();
  renderDashboard();
  renderMyBooks();
  renderExchanges();
  $('avatar').textContent = getName(user)[0];
  $('userSelect').value   = user;
  save();
}

// ── Page Navigation ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === id));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Event Listeners ──
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', () => showPage(b.dataset.page)));

$('userSelect').addEventListener('change', e => {
  user = e.target.value;
  render();
  toast(`Switched to ${getName(user)}`);
});

['searchInput', 'statusFilter', 'deptFilter'].forEach(id => {
  $(id).addEventListener(id === 'searchInput' ? 'input' : 'change', renderCatalog);
});

// Open modal buttons
['openAdd', 'heroList', 'dashList', 'myList'].forEach(id => {
  $(id)?.addEventListener('click', () => $('addModal').classList.add('show'));
});

// Close modal buttons
document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => $(btn.dataset.close).classList.remove('show'));
});

$('addModal').addEventListener('click', e => {
  if (e.target.id === 'addModal') e.target.classList.remove('show');
});

// Add book form
$('bookForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  books.unshift({
    id: 'b' + Date.now(),
    title:     f.get('title').trim(),
    author:    f.get('author').trim(),
    edition:   f.get('edition').trim(),
    course:    f.get('course').trim().toUpperCase(),
    dept:      f.get('department'),
    condition: f.get('condition'),
    owner:     user,
    status:    'Available',
  });
  save();
  e.target.reset();
  $('addModal').classList.remove('show');
  render();
  showPage('mybooks');
  toast('Your book is now listed on OpenShelf!');
});

// ── Init ──
render();
