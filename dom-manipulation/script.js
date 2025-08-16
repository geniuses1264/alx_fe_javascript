// script.js

// Quotes array: objects with text + category
let quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

// Display a random quote and update the DOM
function displayRandomQuote() {
  const out = document.getElementById("quoteDisplay");
  if (!Array.isArray(quotes) || quotes.length === 0) {
    out.innerText = "No quotes available.";
    return;
  }

  const i = Math.floor(Math.random() * quotes.length);
  const q = quotes[i];

  // Update DOM
  out.innerHTML = `<p>"${q.text}"</p><small>(${q.category})</small>`;
}

// Add a new quote from inputs, push to array, and update DOM
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl  = document.getElementById("newQuoteCategory");

  const text = textEl.value.trim();
  const category = catEl.value.trim().toLowerCase();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text, category });

  // Update DOM to reflect the latest added quote
  const out = document.getElementById("quoteDisplay");
  out.innerHTML = `<p>"${text}"</p><small>(${category})</small>`;

  // Clear inputs
  textEl.value = "";
  catEl.value = "";
}

// Event listener for the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
