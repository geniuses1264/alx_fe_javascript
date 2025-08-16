// script.js

// Quotes array with objects (text + category)
let quotes = [
  { text: "Push yourself, because no one else is going to do it for you.", category: "motivation" },
  { text: "Great things never come from comfort zones.", category: "motivation" },
  { text: "The only true wisdom is in knowing you know nothing.", category: "wisdom" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "wisdom" }
];

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

  alert(`✅ Quote added to category: ${newQuoteCategory}`);

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ✅ Event listener on "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Function to show a random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML =
    `"${randomQuote.text}" <br><small>(${randomQuote.category})</small>`;
}

// Function to add a new quote
function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText").value.trim();
  let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim().toLowerCase();

  if (!newQuoteText || !newQuoteCategory) {
    alert("⚠️ Please enter both quote and category!");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  alert("✅ Quote added successfully!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

//Run functions when page loads

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
