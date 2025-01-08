document.addEventListener("DOMContentLoaded", (): void => {
  const form: HTMLFormElement = document.getElementById(
    "bookForm"
  ) as HTMLFormElement;

  form.addEventListener("submit", (event): void => {
    event.preventDefault();

    if (!validateFormData()) return;

    const title: string = (
      document.getElementById("bookTitle") as HTMLInputElement
    ).value;

    const author: string = (
      document.getElementById("bookAuthor") as HTMLInputElement
    ).value;

    const isbn: number = parseInt(
      (document.getElementById("bookIsbn") as HTMLInputElement).value,
      10
    );

    const genre: string = (
      document.getElementById("bookType") as HTMLInputElement
    ).value;

    const year: string = (
      document.getElementById("bookPubDate") as HTMLInputElement
    ).value;

    const price: number = parseFloat(
      (document.getElementById("bookPrice") as HTMLInputElement).value
    );

    const age: { y: number; m: number; d: number } = BaseBook.findBookAge(year);

    addBook(new BaseBook(title, author, isbn, genre, year, age, price, "", 0));

    // addBook(new BaseBook(title, author, isbn, genre, year, age, price, size, pages));

    form.reset();
  });

  fetchBooksFromApi();
});

function validateFormData(): boolean {
  const title: string = (
    document.getElementById("bookTitle") as HTMLInputElement
  ).value;

  const author: string = (
    document.getElementById("bookAuthor") as HTMLInputElement
  ).value;

  const isbn: number = parseInt(
    (document.getElementById("bookIsbn") as HTMLInputElement).value,
    10
  );

  if (!title) {
    alert("Title fields must be requried");
    return false; // Something is wrong prevent form submission.
  }

  if (!author) {
    alert("Author fields must be requried");
    return false; // Something is wrong prevent form submission.
  }

  if (!isbn) {
    alert("ISBN fields must be requried");
    return false; // Something is wrong prevent form submission.
  }

  if (isNaN(isbn)) {
    alert("ISBN must be a number");
    return false; // Something is wrong prevent form submission.
  }

  return true; // All fields are correct allow form submission.
}

class BaseBook {
  constructor(
    public title: string,
    public author: string,
    public isbn: number,
    public genre: string,
    public year: string,
    public age: { y: number; m: number; d: number },
    public price: number,
    public size: string,
    public pages: number
  ) {}

  getBookAge(): string {
    return `${this.age.y} years, ${this.age.m} months, ${this.age.d} days`;
  }

  static findBookAge(year: string): { y: number; m: number; d: number } {
    const currDate = new Date();
    const bookDate = new Date(year);

    let diffYear: number = currDate.getFullYear() - bookDate.getFullYear();
    let diffMonth: number = currDate.getMonth() - bookDate.getMonth();
    let diffDay: number = currDate.getDate() - bookDate.getDate();

    if (diffDay < 0) {
      diffMonth -= 1;
      diffDay += new Date(
        currDate.getFullYear(),
        currDate.getMonth(),
        0
      ).getDate();
    }

    if (diffMonth < 0) {
      diffYear -= 1;
      diffMonth += 12;
    }

    if (diffMonth >= 12) {
      diffYear += Math.floor(diffMonth / 12);
      diffMonth %= 12;
    }

    return { y: diffYear, m: diffMonth, d: diffDay };
  }
}

class EBook extends BaseBook {
  constructor(
    public title: string,
    public author: string,
    public isbn: number,
    public genre: string,
    public year: string,
    public age: { y: number; m: number; d: number }
  ) {
    super(title, author, isbn, genre, year, age, 0, "", 0);
  }

  calculateDiscountPrice(originalPrice: number): number {
    return originalPrice * 0.8; // 20% discount for eBooks
  }
}

class PrintedBook extends BaseBook {
  constructor(
    public title: string,
    public author: string,
    public isbn: number,
    public genre: string,
    public year: string,
    public age: { y: number; m: number; d: number }
  ) {
    super(title, author, isbn, genre, year, age, 0, "", 0);
  }

  calculateDiscountPrice(originalPrice: number): number {
    return originalPrice * 0.9; // 10% discount for printed books
  }
}

let books: BaseBook[] = [];

const addBook = (book: BaseBook): void => {
  books.push(book);
  displayBook(books);
};

const displayBook = (books: BaseBook[]): void => {
  const tableBody: HTMLTableElement = document.querySelector(
    "#bookTable tbody"
  ) as HTMLTableElement;

  tableBody.innerHTML = "";

  books.forEach((book, index): void => {
    const row: HTMLTableRowElement = document.createElement("tr");

    row.className =
      "bg-white hover:bg-gray-100 border-b border-gray-200 text-sm text-gray-700";
    row.innerHTML = `
      <td class="py-2 px-4">${book.title}</td>
      <td class="py-2 px-4">${book.author}</td>
      <td class="py-2 px-4">${book.isbn}</td>
      <td class="py-2 px-4">${book.year}</td>
      <td class="py-2 px-4 relative">${book.genre}
        <button
          id="infoBtn"
          onclick="infoBook('${index}')"
          class="absolute top-1.5 right-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">
          Book info.
        </button>
      </td>
      <td class="py-2 px-4">${book.getBookAge()}</td>
      <td class="py-2 px-4 flex space-x-3">
        <button
          id="deleteBtn"
          onclick="deleteBook('${book.isbn}')"
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">
          Delete
        </button>
        <button
          id="editBtn"
          onclick="editBook('${book.isbn}')"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">
          Edit
        </button>
      </td>
      <td class="text-center">${book.price}</td>
      <td class="text-center">
      ${new EBook(
        book.title,
        book.author,
        book.isbn,
        book.genre,
        book.year,
        BaseBook.findBookAge(JSON.stringify(book.age))
      )
        .calculateDiscountPrice(book.price)
        .toFixed(2)}
      </td>
      <td class="text-center">
      ${new PrintedBook(
        book.title,
        book.author,
        book.isbn,
        book.genre,
        book.year,
        BaseBook.findBookAge(JSON.stringify(book.age))
      )
        .calculateDiscountPrice(book.price)
        .toFixed(2)}
      </td>
    `;
    tableBody.appendChild(row);
  });
};

/*
  BaseBook is a type that has a set of properties, like title, author, year, etc.
  When you use Partial<BaseBook>, it means that you can create an object where
  any or all of those properties are optional.
*/

const updateBook = (isbn: number, updatedData: Partial<BaseBook>): void => {
  const bookIndex: number = books.findIndex((book) => book.isbn === isbn);

  if (bookIndex !== -1) {
    const updatedBook: BaseBook = {
      ...books[bookIndex],
      ...updatedData,
      getBookAge: updatedData.getBookAge ?? books[bookIndex].getBookAge,
    };

    books[bookIndex] = updatedBook;
    displayBook(books);

    const form: HTMLFormElement = document.getElementById(
      "bookForm"
    ) as HTMLFormElement;
    form.reset();
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};
const editBook = (isbn: number): void => {
  const book: BaseBook | undefined = books.find((book) => book.isbn === isbn);

  if (book) {
    // Set the form fields with the current values of the book
    (document.getElementById("bookTitle") as HTMLInputElement).value =
      book.title;

    (document.getElementById("bookAuthor") as HTMLInputElement).value =
      book.author;

    (document.getElementById("bookIsbn") as HTMLInputElement).value =
      book.isbn.toString();

    (document.getElementById("bookType") as HTMLSelectElement).value =
      book.genre.toLowerCase();

    (document.getElementById("bookPubDate") as HTMLInputElement).value =
      book.year.toString();

    (document.getElementById("bookPrice") as HTMLInputElement).value =
      book.price.toString();

    // Listen for form submission
    document.addEventListener("DOMContentLoaded", (): void => {
      const form: HTMLFormElement = document.getElementById(
        "bookForm"
      ) as HTMLFormElement;

      form.onsubmit = (event: Event): void => {
        event.preventDefault();

        // Collect updated data from the form
        const updatedData: Partial<BaseBook> = {
          title: (document.getElementById("bookTitle") as HTMLInputElement)
            .value,

          author: (document.getElementById("bookAuthor") as HTMLInputElement)
            .value,

          isbn: parseInt(
            (document.getElementById("bookIsbn") as HTMLInputElement).value,
            10
          ),

          year: (document.getElementById("bookPubDate") as HTMLInputElement)
            .value,

          genre: (document.getElementById("bookType") as HTMLSelectElement)
            .value,

          price: parseFloat(
            (document.getElementById("bookPrice") as HTMLInputElement).value
          ),

          age: BaseBook.findBookAge(
            (document.getElementById("bookPubDate") as HTMLInputElement).value
          ),
        };

        /*
        the updatedData object you are passing does not fully match the
        BaseBook type. Specifically, the BaseBook type has additional required
        properties like age, size, pages, and getBookAge, which are missing in
        your updatedData.
        */

        // Update the book data
        updateBook(isbn, updatedData);
      };
    });

    // Optionally delete the book after editing, based on your logic
    deleteBook(isbn);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

const deleteBook = (isbn: number): void => {
  const removeBookIndex: number = books.findIndex((book) => book.isbn === isbn);
  if (removeBookIndex !== -1) {
    books.splice(removeBookIndex, 1);
    displayBook(books);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

const fetchBooksFromApi = async (): Promise<void> => {
  try {
    const response = await fetch("../../dummy.json");

    if (!response.ok) throw new Error("Failed to fetch books");

    const data: BaseBook[] = await response.json();

    const fetchBooks: BaseBook[] = data.map(
      (book) =>
        new BaseBook(
          book.title,
          book.author,
          book.isbn,
          book.genre.toLowerCase(),
          book.year,
          book.age,
          book.price,
          book.size,
          book.pages
        )
    );
    books = [...books, ...fetchBooks];
    displayBook(books);
  } catch (error) {
    alert(`Error: ${(error as Error).message}`);
  }
};

const inputGenre: HTMLInputElement = document.getElementById(
  "searchGenre"
) as HTMLInputElement;

inputGenre.addEventListener("input", async (): Promise<void> => {
  const inputValue: string = inputGenre.value.toLowerCase();
  try {
    if (inputValue == "") {
      displayBook(books);
    } else {
      const resultBooks: BaseBook[] = await filterBooksByGenre(inputValue);
      displayBook(resultBooks);
    }
  } catch (error) {
    console.error("Error filtering books by genre:", error);
  }
});

const filterBooksByGenre = (genre: string): Promise<BaseBook[]> => {
  return new Promise((resolve, reject) => {
    setTimeout((): void => {
      try {
        const filteredBooks: BaseBook[] = books.filter(
          (book) => book.genre.toLowerCase() === genre
        );
        resolve(filteredBooks);
      } catch (error) {
        reject(error);
      }
    });
  });
};

/*
  Flag to toggle between ascending and descending order
  true -> ascending
  false -> descending
*/

const sortBooks = (sortBy: boolean): void => {
  books.sort((a, b): number => {
    const ageA: number = a.age.y * 365 + a.age.m * 30 + a.age.d;
    const ageB: number = b.age.y * 365 + b.age.m * 30 + b.age.d;
    return sortBy ? ageA - ageB : ageB - ageA;
  });
  displayBook(books);
};

const handleSortChange = (value: string): void => {
  if (value === "ascending") {
    sortBooks(true);
  } else if (value === "descending") {
    sortBooks(false);
  }
};

function infoBook(bookIndex: number): void {
  window.location.href = `detail-book.html?index=${bookIndex}`;
}
