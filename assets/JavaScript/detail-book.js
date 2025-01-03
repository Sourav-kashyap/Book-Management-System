function getQueryParameter(bookIndex) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(bookIndex);
}

const bookIndex = getQueryParameter("index");

if (bookIndex !== null) {
  fetch("/Book-Management-System/dummyBooksDetails.json")
    .then((response) => response.json())
    .then((data) => {
      const book = data[parseInt(bookIndex)];
      if (book) {
        document.getElementById("book-title").textContent = book.title;
        document.getElementById("book-description").textContent =
          book.description;
        document.getElementById("book-author").textContent = book.author;
        document.getElementById("book-isbn").textContent = book.isbn;
        document.getElementById("book-genre").textContent = book.genre;
        document.getElementById("book-publish-date").textContent =
          book.publish_date;
        document.getElementById("book-image").src = book.image;
        document.getElementById("book-image").alt = book.title;
      } else {
        document.getElementById("book-title").textContent = "Book not found";
        document.getElementById("book-description").textContent =
          "No details available.";
        document.getElementById("book-image").src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbS_-_ReefLn6YBu1nQCO2Nnmol793vjHbye5mD0dp0Y9fklSH3sZREaB23V2dNIUF8Y&usqp=CAU";
        document.getElementById("book-image").alt = "No image available";
      }
    })
    .catch((error) => {
      document.getElementById("book-title").textContent = "Error";
      document.getElementById("book-description").textContent =
        "Could not load book details.";
    });
} else {
  document.getElementById("book-title").textContent = "No book selected";
  document.getElementById("book-description").textContent =
    "Please select a book from the list.";
}
