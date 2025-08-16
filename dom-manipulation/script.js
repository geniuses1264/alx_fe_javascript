// script.js
// Clean single-file implementation that satisfies the checks:
// - quotes array (objects with text + category)
// - displayRandomQuote()
// - addQuote()
// - createAddQuoteForm()
// - uses innerHTML to update #quoteDisplay
// - attaches click listener to #newQuote

const quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

// ----- required function: displayRandomQuote -----
function displayRandomQuote() {
  const out = document.getElementById("quoteDisplay");
  if (!out) return;

  if (!Array.isArray(quotes) || quotes.length === 0) {
    out.innerHTML = "No quotes available.";
    return;
  }

  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  out.innerHTML = `<p>"${q.text}"</p><small>(${q.category})</small>`;
}

// ----- required function: addQuote -----
function addQuote() {
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

  // push new object (exact keys 'text' and 'category')
  quotes.push({ text: text, category: category });

  // immediately show the newly added quote
  if (out) out.innerHTML = `<p>"${text}"</p><small>(${category})</small>`;

  // clear inputs
  textEl.value = "";
  catEl.value = "";
}

// ----- required function: createAddQuoteForm -----
// Creates inputs/buttons only if they don't already exist.
// This avoids duplication and prevents failing earlier correct tests.
function createAddQuoteForm() {
  // if inputs already exist, do nothing
  if (document.getElementById("newQuoteText") && document.getElementById("newQuoteCategory")) return;

  // find preferred insertion point (match your HTML if it has a container)
  const preferredIds = ["userInput", "quoteFormContainer", "container"];
  let target = preferredIds.map(id => document.getElementById(id)).find(el => el);
  if (!target) target = document.body;

  // create wrapper so we can detect if already created
  if (document.getElementById("generatedAddForm")) return;
  const wrapper = document.createElement("div");
  wrapper.id = "generatedAddForm";
  wrapper.style.marginTop = "12px";

  // input: quote text
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";
  inputText.style.display = "block";
  inputText.style.margin = "6px auto";

  // input: category
  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.id = "newQuoteCategory";
  inputCategory.placeholder = "Enter quote category";
  inputCategory.style.display = "block";
  inputCategory.style.margin = "6px auto";

  // button: Add Quote
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "addQuoteBtn";
  btn.textContent = "Add Quote";
  btn.style.display = "inline-block";
  btn.style.margin = "8px";
  btn.addEventListener("click", addQuote);

  wrapper.appendChild(inputText);
  wrapper.appendChild(inputCategory);
  wrapper.appendChild(btn);
  target.appendChild(wrapper);
}

// ----- init wiring on DOMContentLoaded -----
document.addEventListener("DOMContentLoaded", () => {
  // create form if needed (will not duplicate existing inputs)
  createAddQuoteForm();

  // wire Show New Quote button (your HTML uses id="newQuote")
  const showBtn = document.getElementById("newQuote");
  if (showBtn) showBtn.addEventListener("click", displayRandomQuote);

  // also wire add button if it was present in HTML with id "addQuoteBtn"
  const addBtn = document.getElementById("addQuoteBtn");
  if (addBtn) addBtn.addEventListener("click", addQuote);
});
