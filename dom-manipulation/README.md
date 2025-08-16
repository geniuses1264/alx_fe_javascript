# Quotes App  

A simple web app that allows users to **store quotes locally** and display them only when requested. The app demonstrates the use of **JavaScript arrays, DOM manipulation, and event handling**.  

## Features  

- Add new quotes to the system (stored in memory).  
- Quotes are **not immediately shown** when added.  
- Users can click the **"Show Quote" button** to display a random stored quote.  
- Prevents loss of quotes when the page is refreshed by using `localStorage`.  
- Clean and minimal design with buttons for interaction.  

## How It Works  

1. **Adding a Quote**  
   - Enter your quote in the input field.  
   - Click the **Add Quote** button.  
   - The quote is stored in the system but not displayed immediately.  

2. **Showing a Quote**  
   - Click the **Show Quote** button.  
   - A random quote from the stored list will appear.  
   - Each click displays a new random quote.  

3. **Data Persistence**  
   - All quotes are stored using **localStorage**.  
   - This means your data stays even after refreshing or closing the browser.  

## Tech Stack  

- **HTML** – structure  
- **CSS** – styling  
- **JavaScript** – functionality  

## Example Code Snippet  

```javascript
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

function addQuote(newQuote) {
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showQuote() {
  if (quotes.length === 0) {
    alert("No quotes available!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteDisplay").innerText = quotes[randomIndex];
}
