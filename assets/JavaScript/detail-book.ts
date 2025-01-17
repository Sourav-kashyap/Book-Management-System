const getQueryParameter = <T>(bookIndex: T): T | null => {
  if (typeof bookIndex === "string") {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(bookIndex) as T;
  } else {
    return null;
  }
}

/* --------------------------------------------------------------------- */

const bookIndex: string | null = getQueryParameter<string>("index");

if (bookIndex !== null) {
  fetch("../../dummyBooksDetails.json")
    .then((response) => response.json())
    .then((data): void => {
      const book = data[parseInt(bookIndex)];
      if (book) {
        (
          document.getElementById("book-title") as HTMLHeadingElement
        ).innerHTML = book.title;

        (
          document.getElementById("book-description") as HTMLParagraphElement
        ).innerHTML = book.description;

        (document.getElementById("book-author") as HTMLSpanElement).innerHTML =
          book.author.name;

        (document.getElementById("book-isbn") as HTMLSpanElement).innerHTML =
          book.isbn;

        (document.getElementById("book-genre") as HTMLSpanElement).innerHTML =
          book.genre;

        (
          document.getElementById("book-publish-date") as HTMLSpanElement
        ).innerHTML = book.publish_date;

        (document.getElementById("book-image") as HTMLImageElement).src =
          book.image;

        (document.getElementById("book-image") as HTMLImageElement).alt =
          book.title;

        (document.getElementById("book-price") as HTMLSpanElement).innerHTML =
          book.price;

        (document.getElementById("book-size") as HTMLSpanElement).innerHTML =
          book.size;

        (document.getElementById("book-pages") as HTMLSpanElement).innerHTML =
          book.pages;
      } else {
        (document.getElementById("book-title") as HTMLSpanElement).innerHTML =
          "Book not found";

        (
          document.getElementById("book-description") as HTMLParagraphElement
        ).innerHTML = "No details available.";

        (document.getElementById("book-image") as HTMLImageElement).src =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcbS_-_ReefLn6YBu1nQCO2Nnmol793vjHbye5mD0dp0Y9fklSH3sZREaB23V2dNIUF8Y&usqp=CAU";

        (document.getElementById("book-image") as HTMLImageElement).alt =
          "No image available";
      }
    })
    .catch((error: Error) => {
      (document.getElementById("book-title") as HTMLSpanElement).innerHTML =
        "Error";

      (
        document.getElementById("book-description") as HTMLParagraphElement
      ).innerHTML = "Could not load book details.";
    });
} else {
  console.log(`BookIndex ${bookIndex} is not a string`);
  (document.getElementById("book-title") as HTMLSpanElement).innerHTML =
    "No book selected";

  (
    document.getElementById("book-description") as HTMLParagraphElement
  ).innerHTML = "Please select a book from the list.";
}
