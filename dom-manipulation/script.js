// script.js

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function nowTs() {
  return new Date().toISOString();
}

// Quotes array with objects (text + category)
let quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

// ✅ Load saved quotes from localStorage (if any)
if (localStorage.getItem("quotes")) {
  quotes = JSON.parse(localStorage.getItem("quotes"));
}

// ✅ Save quotes to localStorage
// ---- Local storage helpers (ADD if you don't already have them) ----
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotes() {
  try {
    const raw = localStorage.getItem("quotes");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      quotes = parsed;
    }
  } catch (_) { /* ignore */ }
}


// ✅ Function: Select a random quote and update DOM
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>(${randomQuote.category})</small>
  `;

  // ✅ Store last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ✅ Function: Add a new quote dynamically
function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText").value.trim();
  let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!newQuoteText || !newQuoteCategory) {
    alert("⚠️ Please enter both quote and category!");
    return;
  }

  // Add to quotes array
  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // ✅ Save updated quotes
  saveQuotes();

  alert(`✅ Quote added successfully! Category: ${newQuoteCategory}`);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ✅ Event listener on "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
document.getElementById("exportQuotesBtn").addEventListener("click", exportQuotes);

// ✅ Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("✅ Quotes imported successfully!");
      } else {
        alert("⚠️ Invalid JSON format.");
      }
    } catch (error) {
      alert("⚠️ Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Restore last viewed quote from sessionStorage on page load
window.onload = function() {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quoteObj = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `"${quoteObj.text}" <br><small>(${quoteObj.category})</small>`;
  }
};

//Run functions when page loads
// Populate categories dynamically from the quotes array
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories

  // Clear old options (except "All Categories")
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes(); // apply saved filter
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quotesContainer = document.getElementById("quotesContainer");

  quotesContainer.innerHTML = ""; // clear old quotes

  const filteredQuotes = selectedCategory === "all" 
    ? quotes 
    : quotes.filter(q => q.category === selectedCategory);

  filteredQuotes.forEach(quote => {
    const quoteDiv = document.createElement("div");
    quoteDiv.classList.add("quote");
    quoteDiv.innerHTML = `
      <p>${quote.text}</p>
      <p><strong>- ${quote.author}</strong></p>
      <p><em>Category: ${quote.category}</em></p>
    `;
    quotesContainer.appendChild(quoteDiv);
  });

  // Save selected category in localStorage
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Update categories if new quote with a new category is added
function updateCategoriesOnAdd(newCategory) {
  const categoryFilter = document.getElementById("categoryFilter");
  const options = Array.from(categoryFilter.options).map(opt => opt.value);

  if (!options.includes(newCategory)) {
    const option = document.createElement("option");
    option.value = newCategory;
    option.textContent = newCategory;
    categoryFilter.appendChild(option);
  }
}

// ---- Simulated server API (ADD) ----
const SERVER_ENDPOINT = "https://jsonplaceholder.typicode.com/posts"; 
// We'll map server "posts" -> quotes for demo purposes

async function fetchServerQuotes() {
  // Simulate getting quotes from server (map posts to our schema)
  const res = await fetch(SERVER_ENDPOINT + "?_limit=10");
  const posts = await res.json();
  // map to our quote shape (id/text/category/updatedAt/source)
  // Here we fake category and updatedAt since the mock API doesn't have them
  return posts.map(p => ({
    id: String(p.id),
    text: p.title,
    category: "server",       // demo category
    updatedAt: nowTs(),       // pretend they are "fresh"
    source: "server",
    dirty: false
  }));
}

async function pushLocalDirtyQuotes(localDirty) {
  // Simulate POSTing local quotes that need syncing
  const results = [];
  for (const q of localDirty) {
    const res = await fetch(SERVER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });
    const created = await res.json();
    // JSONPlaceholder returns an id but doesn’t persist;
    // we’ll mark the quote as clean now.
    results.push({ ...q, id: String(created.id || q.id), dirty: false, source: "server", updatedAt: nowTs() });
  }
  return results;
}


// ---- Merge & conflict resolution (ADD) ----
function mergeFromServer(serverQuotes) {
  // Build a map of current local quotes by id
  const localById = new Map(quotes.map(q => [q.id, q]));
  let conflictsResolved = 0;
  let newFromServer = 0;

  for (const srv of serverQuotes) {
    const local = localById.get(srv.id);

    if (!local) {
      // new item from server -> add
      quotes.push(srv);
      newFromServer++;
      continue;
    }

    // same id exists locally: if different text/category or updatedAt -> server wins
    const different =
      local.text !== srv.text ||
      local.category !== srv.category ||
      local.updatedAt !== srv.updatedAt;

    if (different) {
      // Resolve in favor of server
      local.text = srv.text;
      local.category = srv.category;
      local.updatedAt = srv.updatedAt;
      local.source = "server";
      local.dirty = false;
      conflictsResolved++;
    }
  }

  if (newFromServer || conflictsResolved) {
    saveQuotes?.();
    showSyncNotice(`Synced. New from server: ${newFromServer}, conflicts resolved: ${conflictsResolved}.`);
  }
}

function markSynced(updatedList) {
  const updatedById = new Map(updatedList.map(q => [q.id, q]));
  let changed = 0;

  quotes = quotes.map(q => {
    const upd = updatedById.get(q.id);
    if (!upd) return q;
    changed++;
    return { ...q, dirty: false, source: "server", updatedAt: upd.updatedAt, id: upd.id };
  });

  if (changed) saveQuotes?.();
}

// ---- Sync loop & UI (ADD) ----
let syncTimer = null;

function showSyncNotice(msg) {
  let bar = document.getElementById("syncNotice");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "syncNotice";
    bar.style.marginTop = "10px";
    bar.style.padding = "8px 12px";
    bar.style.borderRadius = "8px";
    bar.style.background = "#fff";
    bar.style.color = "#333";
    bar.style.fontSize = "14px";
    bar.style.display = "inline-block";
    const container = document.getElementById("container") || document.body;
    container.appendChild(bar);
  }
  bar.textContent = msg;
}

async function syncQuotes() {
  try {
    // 1) Push local dirty quotes
    const dirty = quotes.filter(q => q.dirty);
    if (dirty.length) {
      const posted = await pushLocalDirtyQuotes(dirty);
      markSynced(posted);
    }

    // 2) Fetch from server and merge (server wins)
    const server = await fetchServerQuotes();
    mergeFromServer(server);

    // 3) Remember last sync timestamp in sessionStorage (optional)
    sessionStorage.setItem("lastSyncAt", nowTs());
    showSyncNotice("Sync OK ✔");
  } catch (err) {
    showSyncNotice("Sync failed. Check network.");
    // console.error(err);
  }
}

function injectSyncControls() {
  const container = document.getElementById("container") || document.body;

  const btn = document.createElement("button");
  btn.id = "syncNowBtn";
  btn.textContent = "Sync Now";
  btn.style.marginLeft = "6px";
  btn.addEventListener("click", syncQuotes);

  container.appendChild(btn);
}

function startSyncLoop() {
  // Load quotes from localStorage first (if you have loadQuotes)
  loadQuotes?.();

  // Start periodic sync every 15s
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(syncQuotes, 15000);

  // Do an immediate sync on load
  syncQuotes();
}

// Kick things off when page is ready
window.addEventListener("load", () => {
  injectSyncControls();
  startSyncLoop();
});

sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));

try {
  const last = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (last && last.text) {
    document.getElementById("quoteDisplay").innerHTML =
      `<p>"${last.text}"</p><small>(${last.category})</small>`;
  }
} catch (_) {}


function createAddQuoteForm() {
  // Create the container div
  const div = document.createElement("div");
  div.id = "userInput"; // ✅ Add the id to the div container

  // Create the first input
  const inputQuote = document.createElement("input");
  inputQuote.id = "newQuoteText";
  inputQuote.type = "text";
  inputQuote.placeholder = "Enter a new quote";

  // Create the second input
  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  // Create the button
  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.onclick = addQuote; // attach the function

  // Append inputs and button to div
  div.appendChild(inputQuote);
  div.appendChild(inputCategory);
  div.appendChild(button);

  // Append the div to the body or another container
  document.body.appendChild(div);
}

// Call the function to add it to the DOM
createAddQuoteForm();
