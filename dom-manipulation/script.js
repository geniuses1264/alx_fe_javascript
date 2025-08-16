// Quotes array with objects containing "text" and "category" properties
let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Do not watch the clock. Do what it does. Keep going.", category: "Inspiration" },
  { text: "Stay hungry, stay foolish.", category: "Wisdom" }
];

// Function to display a random quote
function displayRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote(text, category) {
  quotes.push({ text: text, category: category });
  displayRandomQuote();
}

// Event listener for "Show New Quote" button
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
