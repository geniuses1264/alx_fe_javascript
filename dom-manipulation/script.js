/* script.js
   Clean, single-file implementation that:
   - defines quotes (objects with text + category)
   - provides displayRandomQuote(), addQuote(), createAddQuoteForm()
   - dynamically creates the add-quote form and wires listeners
   - updates the DOM using innerHTML
*/

// ---- data ----
const quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

// ---- display a random quote (required: displayRandomQuote) ----
function displayRandomQuote() {
  const out = document.getElementById("quoteDisplay");
  if (!out) return; // safe-guard

  if (!Array.isArray(quotes) || quotes.length === 0) {
    out.innerHTML = "No quotes available.";
    return;
  }

  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  out.innerHTML = `<p>"${escapeHtml(q.text)}"</p><small>(${escapeHtml(q.category)})</small>`;
}

// ---- add a new quote (required: addQuote) ----
function addQuote() {
  // Elements may be created dynamically by createAddQuoteForm()
  const textEl = document.getElementById("newQuoteText");
  const catEl  = document.getElementById("newQuoteCategory");
  const out    = document.getElementById("quoteDisplay");

  if (!textEl || !catEl) {
    alert("Add form not found.");
    return;
  }

  const text = textEl.value.trim();
  const category = catEl.value.trim();

  if (!text || !category) {
    alert("⚠️ Please enter both quote text and category.");
    return;
  }

  // Push object with exact keys 'text' and 'category'
  quotes.push({ text: text, category: category });

  // Update DOM to show the newly added quote immediately
  if (out) out.innerHTML = `<p>"${escapeHtml(text)}"</p><small>(${escapeHtml(category)})</small>`;

  // Clear inputs
  textEl.value = "";
  catEl.value = "";
}

// ---- create the add-quote form dynamically (required: createAddQuoteForm) ----
function createAddQuoteForm() {
  // Prefer to insert into an existing placeholder if present
  const preferredContainers = [
    "userInput",        // your earlier HTML had this id
    "quoteFormContainer",
    "container"         // your outer container
  ];

  let target = null;
  for (const id of preferredContainers) {
    const el = document.getElementById(id);
    if (el) { target = el; break; }
  }
  // fallback to body
  if (!target) target = document.body;

  // Prevent creating the form more than once
  if (document.getElementById("generatedAddForm")) return;

  // Build form
  const wrapper = document.createElement("div");
  wrapper.id = "generatedAddForm";
  wrapper.style.marginTop = "12px";

  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  inputText.style.display = "block";
  inputText.style.margin = "6px auto";

  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.style.display = "block";
  inputCategory.style.margin = "6px auto";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "addQuoteBtn";
  btn.textContent = "Add Quote";
  btn.style.display = "inline-block";
  btn.style.margin = "8px";

  // Wire event to the existing addQuote function
  btn.addEventListener("click", addQuote);

  // Append into wrapper and target
  wrapper.appendChild(inputText);
  wrapper.appendChild(inputCategory);
  wrapper.appendChild(btn);
  target.appendChild(wrapper);
}

// ---- helper: escape HTML to avoid accidental injection when setting innerHTML ----
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---- wire up on DOM ready ----
document.addEventListener("DOMContentLoaded", () => {
  // create form (if you didn't include inputs in HTML already)
  createAddQuoteForm();

  // wire show button (id in your HTML is "newQuote")
  const showBtn = document.getElementById("newQuote");
  if (showBtn) showBtn.addEventListener("click", displayRandomQuote);

  // optional: show a random quote immediately on load
  // displayRandomQuote();
});
