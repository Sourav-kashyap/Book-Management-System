"use strict";
const getQueryParameter = (bookIndex) => {
    if (typeof bookIndex === "string") {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(bookIndex);
    }
    else {
        return null;
    }
};
const bookIndex = getQueryParameter("index");
if (bookIndex !== null) {
    fetch("../../dummyBooksDetails.json")
        .then((response) => response.json())
        .then((data) => {
        const book = data[parseInt(bookIndex)];
        if (book) {
            document.getElementById("book-title").innerHTML = book.title;
            document.getElementById("book-description").innerHTML = book.description;
            document.getElementById("book-author").innerHTML =
                book.author.name;
            document.getElementById("book-isbn").innerHTML =
                book.isbn;
            document.getElementById("book-genre").innerHTML =
                book.genre;
            document.getElementById("book-publish-date").innerHTML = book.publish_date;
            document.getElementById("book-image").src =
                book.image;
            document.getElementById("book-image").alt =
                book.title;
            document.getElementById("book-price").innerHTML =
                book.price;
            document.getElementById("book-size").innerHTML =
                book.size;
            document.getElementById("book-pages").innerHTML =
                book.pages;
        }
        else {
            document.getElementById("book-title").innerHTML =
                "Book not found";
            document.getElementById("book-description").innerHTML = "No details available.";
            document.getElementById("book-image").src =
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbS_-_ReefLn6YBu1nQCO2Nnmol793vjHbye5mD0dp0Y9fklSH3sZREaB23V2dNIUF8Y&usqp=CAU";
            document.getElementById("book-image").alt =
                "No image available";
        }
    })
        .catch((error) => {
        document.getElementById("book-title").innerHTML =
            "Error";
        document.getElementById("book-description").innerHTML = "Could not load book details.";
    });
}
else {
    console.log(`BookIndex ${bookIndex} is not a string`);
    document.getElementById("book-title").innerHTML =
        "No book selected";
    document.getElementById("book-description").innerHTML = "Please select a book from the list.";
}
