function getQueryParameter(bookIndex: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(bookIndex);
}

const bookIndex: string | null = getQueryParameter("index");

if (bookIndex !== null) {
  fetch("../../dummyBooksDetails.json")
    .then((response) => response.json())
    .then((data): void => {
      const book = data[parseInt(bookIndex)];
      if (book) {
        (document.getElementById("book-title") as HTMLInputElement).value =
          book.title;

        (
          document.getElementById("book-description") as HTMLInputElement
        ).value = book.description;

        (document.getElementById("book-author") as HTMLInputElement).value =
          book.author;

        (document.getElementById("book-isbn") as HTMLInputElement).value =
          book.isbn;

        (document.getElementById("book-genre") as HTMLInputElement).value =
          book.genre;

        (
          document.getElementById("book-publish-date") as HTMLInputElement
        ).value = book.publish_date;

        (document.getElementById("book-image") as HTMLImageElement).src =
          book.image;

        (document.getElementById("book-image") as HTMLImageElement).alt =
          book.title;

        (document.getElementById("book-price") as HTMLInputElement).value =
          book.price;

        (document.getElementById("book-size") as HTMLInputElement).value =
          book.size;

        (document.getElementById("book-pages") as HTMLInputElement).value =
          book.pages;
      } else {
        (document.getElementById("book-title") as HTMLInputElement).value =
          "Book not found";

        (
          document.getElementById("book-description") as HTMLInputElement
        ).value = "No details available.";

        (document.getElementById("book-image") as HTMLImageElement).src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbS_-_ReefLn6YBu1nQCO2Nnmol793vjHbye5mD0dp0Y9fklSH3sZREaB23V2dNIUF8Y&usqp=CAU";

        (document.getElementById("book-image") as HTMLImageElement).alt =
          "No image available";
      }
    })
    .catch((error: Error) => {
      (document.getElementById("book-title") as HTMLInputElement)!.value =
        "Error";

      (document.getElementById("book-description") as HTMLInputElement)!.value =
        "Could not load book details.";
    });
} else {
  (document.getElementById("book-title") as HTMLInputElement).value =
    "No book selected";

  (document.getElementById("book-description") as HTMLInputElement).value =
    "Please select a book from the list.";
}
