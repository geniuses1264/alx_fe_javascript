// script.js

// Quotes stored by category
let quotes = {
  motivation: [
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones."
  ],
  wisdom: [
    "The only true wisdom is in knowing you know nothing.",
    "Do not take life too seriously. You will never get out of it alive."
  ]
};

function getRandomQuote(category) {
  let categoryQuotes = quotes[category];

  if (!categoryQuotes || categoryQuotes.length === 0) {
    return "No quotes found for this category.";
  }

  let randomIndex = Math.floor(Math.random() * categoryQuotes.length);
  return categoryQuotes[randomIndex];
}

// Show quote in the div
function showQuote() {
  // For now, let’s just pick from "motivation"
  let quote = getRandomQuote("motivation");
  document.getElementById("quoteDisplay").innerText = quote;
}

// Attach event to button
document.getElementById("newQuote").addEventListener("click", showQuote);


function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText").value.trim();
  let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!newQuoteText || !newQuoteCategory) {
    alert("Please enter both quote and category!");
    return;
  }

  // If category doesn’t exist, create it
  if (!quotes[newQuoteCategory]) {
    quotes[newQuoteCategory] = [];
  }

  // Add the new quote
  quotes[newQuoteCategory].push(newQuoteText);

  alert(`Quote added to category: ${newQuoteCategory}`);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}
