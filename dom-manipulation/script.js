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

 const serverQuotes = [
      { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
      { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
      { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" }
    ];

    // Store fetched quotes
    let fetchedQuotes = [];

    // Simulate fetching data from server
    async function fetchQuotesFromServer() {
      try {
        // Fake server delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Randomly simulate failure
        if (Math.random() < 0.2) {
          throw new Error("Server failed to upload a code.");
        }

        return serverQuotes;
      } catch (error) {
        throw error;
      }
    }

    async function getQuote() {
      const quoteEl = document.getElementById("quote");
      const authorEl = document.getElementById("author");
      const errorEl = document.getElementById("error");

      try {
        errorEl.textContent = ""; // Clear old errors
        const quotes = await fetchQuotesFromServer();
        fetchedQuotes = quotes; // Save them for export

        // Pick random quote
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = `"${random.text}"`;
        authorEl.textContent = `– ${random.author}`;
      } catch (err) {
        errorEl.textContent = err.message;
        quoteEl.textContent = "⚠️ Unable to fetch quote.";
        authorEl.textContent = "";
      }
    }

    function exportQuotes() {
      if (fetchedQuotes.length === 0) {
        alert("No quotes available to export. Fetch first.");
        return;
      }

      let content = "Exported Quotes:\n\n";
      fetchedQuotes.forEach(q => {
        content += `"${q.text}" — ${q.author}\n`;
      });

      // Download as text file
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quotes.txt";
      a.click();
      URL.revokeObjectURL(url);
    }

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
