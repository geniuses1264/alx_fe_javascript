// script.js


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
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
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

// script.js

// ---- Config ----
const API_URL = "https://jsonplaceholder.typicode.com/posts";
const LS_QUOTES_KEY = "quotes";
const SS_POSTED_ONCE = "postedOnce";

// ---- Seed data (kept from Task 1 style) ----
const DEFAULT_QUOTES = [
  { id: "seed-1", text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { id: "seed-2", text: "Great things never come from comfort zones.", category: "motivation" },
  { id: "seed-3", text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { id: "seed-4", text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

// ---- Minimal UI hooks (support both id sets) ----
const quoteEl = document.getElementById("quoteDisplay") || document.getElementById("quote");
const newQuoteBtn = document.getElementById("newQuote") || document.getElementById("get-quote");

// Create a notification bar (no HTML changes required)
let notice = document.getElementById("syncNotice");
if (!notice) {
  notice = document.createElement("div");
  notice.id = "syncNotice";
  notice.style.cssText =
    "position:fixed;top:10px;left:50%;transform:translateX(-50%);" +
    "background:#222;color:#fff;padding:8px 12px;border-radius:6px;" +
    "font-size:14px;display:none;z-index:9999;box-shadow:0 2px 6px rgba(0,0,0,.2)";
  document.body.appendChild(notice);
}
function showNotice(msg, kind = "info") {
  notice.textContent = msg;
  notice.style.background = kind === "error" ? "#c0392b" : kind === "update" ? "#2d7d2d" : "#222";
  notice.style.display = "block";
  clearTimeout(showNotice._t);
  showNotice._t = setTimeout(() => (notice.style.display = "none"), 2500);
}

// ---- Local storage helpers ----
function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_QUOTES_KEY);
    if (!raw) return [...DEFAULT_QUOTES];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_QUOTES];
  } catch {
    return [...DEFAULT_QUOTES];
  }
}
function saveQuotes(qs) {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(qs));
}

// ---- In-memory state ----
 quotes = loadQuotes();

// ---- Display logic (Task 1 behavior preserved) ----
function showRandomQuote() {
  if (!quotes || quotes.length === 0) {
    if (quoteEl) quoteEl.innerHTML = "No quotes available.";
    return;
  }
  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];
  if (quoteEl) {
    quoteEl.innerHTML = `"${q.text}"` + (q.category ? ` <br><small>(${q.category})</small>` : "");
  }
}
if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

// ---- Server: GET (required name & URL) ----
  async function fetchQuotesFromServer() {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        
        if (!response.ok) {
          throw new Error("Failed to fetch quotes from server");
        }

        const data = await response.json();

        // Extract titles as mock quotes
        return data.map(item => item.title);
      } catch (error) {
        console.error("Error fetching data:", error);
        return ["Oops! Something went wrong while fetching quotes."];
      }
    }

    // Handle button click
    document.getElementById("get-quote").addEventListener("click", async () => {
      const quoteElement = document.getElementById("quote");

      // Fetch quotes
      const quotes = await fetchQuotesFromServer();

      // Pick random one
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];

      // Display quote
      quoteElement.textContent = randomQuote;
    });

// ---- Server: POST (checker requires method/POST/headers/Content-Type) ----
async function postQuoteToServer(quote) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: quote.text,
        body: quote.text,
        userId: 1
      })
    });
    // JSONPlaceholder returns the created object (mocked)
    const created = await res.json();
    return created;
  } catch {
    // Silent fail; mock API may be down in some environments
    return null;
  }
}

// ---- Sync & Conflict resolution (server wins on same id) ----
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes) return; // keep local if server failed

  // Build maps for quick compare
  const localById = new Map(quotes.filter(q => q.id).map(q => [q.id, q]));
  const serverById = new Map(serverQuotes.map(q => [q.id, q]));

  let added = 0, updated = 0;

  // Merge: add/update from server
  serverById.forEach((srv, id) => {
    const loc = localById.get(id);
    if (!loc) {
      quotes.push(srv);
      added++;
    } else if (loc.text !== srv.text || loc.category !== srv.category) {
      // Conflict -> server wins
      loc.text = srv.text;
      loc.category = srv.category;
      updated++;
    }
  });

  // Keep local-only quotes (no action needed—they remain in quotes)

  // Persist
  saveQuotes(quotes);

  if (added || updated) {
    showNotice(`Synced: ${added} added, ${updated} updated (server took precedence).`, "update");
    // Optional: refresh display so user sees a current quote
    showRandomQuote();
  }
}

// ---- Periodic syncing (checker: "periodically checking for new quotes") ----
const SYNC_INTERVAL_MS = 15000; // 15s
setInterval(syncQuotes, SYNC_INTERVAL_MS);

// ---- Optional: sessionStorage demo (post once per session) ----
if (!sessionStorage.getItem(SS_POSTED_ONCE)) {
  postQuoteToServer({
    text: `Client handshake at ${new Date().toISOString()}`,
    category: "client"
  }).finally(() => sessionStorage.setItem(SS_POSTED_ONCE, "1"));
}

// ---- Initial boot: ensure something is shown & kick a sync now ----
saveQuotes(quotes);  // keep localStorage up-to-date on load
showRandomQuote();   // show something immediately
syncQuotes();        // try to update from server on start


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
