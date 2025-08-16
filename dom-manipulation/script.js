// Quotes array with objects containing text and category
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// Function to display a random quote
function displayRandomQuote() {
  let quoteContainer = document.getElementById("quoteDisplay");
  if (!quoteContainer) return;

  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  // Update the DOM
  quoteContainer.innerHTML = `
    <p><strong>${randomQuote.text}</strong></p>
    <small>Category: ${randomQuote.category}</small>
  `;
}

// Function to add a new quote
function addQuote(text, category) {
  if (text.trim() === "" || category.trim() === "") return;

  quotes.push({ text: text, category: category });

  // Update DOM immediately after adding
  displayRandomQuote();
}

// Function to create a form dynamically to add quotes
function createAddQuoteForm() {
  let formContainer = document.getElementById("formContainer");
  if (!formContainer) return;

  formContainer.innerHTML = `
    <input type="text" id="quoteText" placeholder="Enter quote" />
    <input type="text" id="quoteCategory" placeholder="Enter category" />
    <button id="submitQuote">Add Quote</button>
  `;

  // Event listener for adding new quote
  document.getElementById("submitQuote").addEventListener("click", () => {
    let text = document.getElementById("quoteText").value;
    let category = document.getElementById("quoteCategory").value;
    addQuote(text, category);
  });
}

// Event listener on “Show New Quote” button
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);

// Initialize form on page load
createAddQuoteForm();
