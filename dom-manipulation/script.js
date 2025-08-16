// script.js

// Store quotes by category
const quotes = {
  motivation: [
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones."
  ],
  wisdom: [
    "The only true wisdom is in knowing you know nothing.",
    "Do not take life too seriously. You will never get out of it alive."
  ]
};

/**
 * Get a random quote from a given category
 * @param {string} category - The category of quotes
 * @returns {string} A random quote or a fallback message
 */
function getRandomQuote(category) {
  const categoryQuotes = quotes[category];

  if (!categoryQuotes || categoryQuotes.length === 0) {
    return "No quotes found for this category.";
  }

  const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}

/**
 * Display a quote in the quoteDisplay div
 */
function showQuote() {
  // Default to "motivation" for now
  const quote = getRandomQuote("motivation");
  document.getElementById("quoteDisplay").innerText = quote;
}

// Attach event to the "New Quote" button
document.getElementById("newQuote").addEventListener("click", showQuote);

/**
 * Add a new quote to a category
 */
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both a quote and a category!");
    return;
  }

  // Create category if it doesn’t exist
  if (!quotes[newQuoteCategory]) {
    quotes[newQuoteCategory] = [];
  }

  // Add the new quote to the category
  quotes[newQuoteCategory].push(newQuoteText);

  alert(`Quote added to category: ${newQuoteCategory}`);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}
