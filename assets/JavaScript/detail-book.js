"use strict";
function getQueryParameter(bookIndex) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(bookIndex);
}
const bookIndex = getQueryParameter("index");
if (bookIndex !== null) {
    fetch("../../dummyBooksDetails.json")
        .then((response) => response.json())
        .then((data) => {
        const book = data[parseInt(bookIndex)];
        if (book) {
            document.getElementById("book-title").value =
                book.title;
            document.getElementById("book-description").value = book.description;
            document.getElementById("book-author").value =
                book.author;
            document.getElementById("book-isbn").value =
                book.isbn;
            document.getElementById("book-genre").value =
                book.genre;
            document.getElementById("book-publish-date").value = book.publish_date;
            document.getElementById("book-image").src =
                book.image;
            document.getElementById("book-image").alt =
                book.title;
            document.getElementById("book-price").value =
                book.price;
            document.getElementById("book-size").value =
                book.size;
            document.getElementById("book-pages").value =
                book.pages;
        }
        else {
            document.getElementById("book-title").value =
                "Book not found";
            document.getElementById("book-description").value = "No details available.";
            document.getElementById("book-image").src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbS_-_ReefLn6YBu1nQCO2Nnmol793vjHbye5mD0dp0Y9fklSH3sZREaB23V2dNIUF8Y&usqp=CAU";
            document.getElementById("book-image").alt =
                "No image available";
        }
    })
        .catch((error) => {
        document.getElementById("book-title").value =
            "Error";
        document.getElementById("book-description").value =
            "Could not load book details.";
    });
}
else {
    document.getElementById("book-title").value =
        "No book selected";
    document.getElementById("book-description").value =
        "Please select a book from the list.";
}
