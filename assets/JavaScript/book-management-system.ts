interface Author {
  name: string;
}

/* --------------------------------------------------------------------- */

interface Category {
  name: string;
}

/* --------------------------------------------------------------------- */

interface Book {
  title: string;
  author: Author;
  isbn: number;
  category: Category;
  year: string;
  age: { y: number; m: number; d: number };
  price: number;
  size?: string;
  pages?: number;
  getBookAge(): string;
}

/* --------------------------------------------------------------------- */

interface AgeCalculator {
  findBookAge(year: string): { y: number; m: number; d: number };
}

/* --------------------------------------------------------------------- */

interface DiscountStrategy {
  calculateDiscountPrice(originalPrice: number): number;
}

/* --------------------------------------------------------------------- */

interface BookCreator {
  createBook(formData: Partial<Book>): BaseBook;
}

/* --------------------------------------------------------------------- */

interface BookValidater {
  validateFormData(
    title: string | undefined,
    author: object | undefined,
    isbn: number | undefined
  ): boolean;
}

/* --------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", (): void => {
  const formProcessor = new FormProcessor("bookForm");
  formProcessor.startExecution();
});

/* --------------------------------------------------------------------- */

class FormDataFetcher {
  constructor(private form: HTMLFormElement) {}

  fetchFormData(): Partial<Book> {
    const title: string =
      (this.form.querySelector("#bookTitle") as HTMLInputElement)?.value || "";
    const authorName: string =
      (this.form.querySelector("#bookAuthor") as HTMLInputElement)?.value || "";
    const isbn: number = parseInt(
      (this.form.querySelector("#bookIsbn") as HTMLInputElement)?.value || "0",
      10
    );
    const categoryName: string =
      (this.form.querySelector("#bookType") as HTMLSelectElement)?.value || "";
    const year: string =
      (this.form.querySelector("#bookPubDate") as HTMLInputElement)?.value ||
      "";
    const price: number = parseFloat(
      (this.form.querySelector("#bookPrice") as HTMLInputElement)?.value || "0"
    );

    return {
      title,
      author: { name: authorName },
      isbn,
      category: { name: categoryName },
      year,
      price,
    };
  }
}

/* --------------------------------------------------------------------- */

class BookFactory implements BookCreator {
  createBook(formData: Partial<Book>): BaseBook {
    const age = new BookAgeCalculator().findBookAge(formData.year || "0");
    return new BaseBook(
      formData.title || "",
      formData.author || { name: "" },
      formData.isbn || 0,
      formData.category || { name: "" },
      formData.year || "",
      age,
      formData.price || 0
    );
  }
}

/* --------------------------------------------------------------------- */

class FormProcessor {
  constructor(private formId: string) {}

  startExecution(): void {
    const form = document.getElementById(this.formId) as HTMLFormElement;

    if (!form) {
      console.error(`Form with ID ${this.formId} not found.`);
      return;
    }

    form.addEventListener("submit", (event): void => {
      event.preventDefault();
      const formData = new FormDataFetcher(form).fetchFormData();

      if (
        !new DataValidater().validateFormData(
          formData.title || "",
          formData.author!,
          formData.isbn!
        )
      )
        return;

      const book = new BookFactory().createBook(formData);
      addBook(book);

      form.reset();
    });

    fetchBooksFromApi();
  }
}

/* --------------------------------------------------------------------- */

class DataValidater implements BookValidater {
  validateFormData(
    title: string | undefined,
    author: object | undefined,
    isbn: number | undefined
  ): boolean {
    if (!title) {
      console.log("Validation Error: Title is missing.");
      return false; // Validation failed
    }

    if (!author) {
      console.log("Validation Error: Author is missing.");
      return false; // Validation failed
    }

    if (isbn === undefined || isNaN(isbn)) {
      console.log("Validation Error: ISBN is not a valid number.");
      return false; // Validation failed
    }
    return true; // Validation passed
  }
}

/* --------------------------------------------------------------------- */

class BaseBook implements Book {
  constructor(
    public title: string,
    public author: Author,
    public isbn: number,
    public category: Category,
    public year: string,
    public age: { y: number; m: number; d: number },
    public price: number,
    public size?: string,
    public pages?: number
  ) {}

  getBookAge(): string {
    return `${this.age.y} years, ${this.age.m} months, ${this.age.d} days`;
  }
}

/* --------------------------------------------------------------------- */

class BookAgeCalculator implements AgeCalculator {
  findBookAge(year: string): { y: number; m: number; d: number } {
    const currDate = new Date();
    const bookDate = new Date(year);

    let diffYear = currDate.getFullYear() - bookDate.getFullYear();
    let diffMonth = currDate.getMonth() - bookDate.getMonth();
    let diffDay = currDate.getDate() - bookDate.getDate();

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

/* --------------------------------------------------------------------- */

class EBookDiscount implements DiscountStrategy {
  calculateDiscountPrice(originalPrice: number): number {
    return originalPrice * 0.2;
  }
}

/* --------------------------------------------------------------------- */

class PrintedBookDiscount implements DiscountStrategy {
  calculateDiscountPrice(originalPrice: number): number {
    return originalPrice * 0.1;
  }
}

/* --------------------------------------------------------------------- */

let books: BaseBook[] = [];

/* --------------------------------------------------------------------- */

const addBook = (book: BaseBook): void => {
  books.push(book);
  displayBook(books);
};

/* --------------------------------------------------------------------- */

const createBookTableRow = (
  book: BaseBook,
  index: number
): HTMLTableRowElement => {
  const row: HTMLTableRowElement = document.createElement("tr");

  row.className =
    "bg-white hover:bg-gray-100 border-b border-gray-200 text-sm text-gray-700";
  row.innerHTML = `
      <td class="py-2 px-4">${book.title}</td>
      <td class="py-2 px-4">${book.author.name}</td>
      <td class="py-2 px-4">${book.isbn}</td>
      <td class="py-2 px-4">${book.year}</td>
      <td class="py-2 px-4 relative">${book.category.name}
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
      ${new EBookDiscount()
        .calculateDiscountPrice(Number(book.price))
        .toFixed(2)}
      </td>
      <td class="text-center">
      ${new PrintedBookDiscount()
        .calculateDiscountPrice(Number(book.price))
        .toFixed(2)}
      </td>
     `;

  return row;
};

/* --------------------------------------------------------------------- */

const displayBook = (books: BaseBook[]): void => {
  const tableBody: HTMLTableElement = document.querySelector(
    "#bookTable tbody"
  ) as HTMLTableElement;
  tableBody.innerHTML = "";
  books.forEach((book, index): void => {
    tableBody.appendChild(createBookTableRow(book, index));
  });
};

/* --------------------------------------------------------------------- */

/*
  BaseBook is a type that has a set of properties, like title, author, year, etc.
  When you use Partial<BaseBook>, it means that you can create an object where
  any or all of those properties are optional.
*/

const updateBook = (isbn: number, updatedData: Partial<BaseBook>): void => {
  const bookIndex: number = books.findIndex((book) => book.isbn === isbn);

  if (bookIndex !== -1) {
    // Ensure that getBookAge is not lost during update
    const updatedBook: BaseBook = {
      ...books[bookIndex],
      ...updatedData,

      // Only overwrite getBookAge if it's provided in updatedData
      getBookAge: updatedData.getBookAge || books[bookIndex].getBookAge,
    };

    // Update the book in the array
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

/* --------------------------------------------------------------------- */

const setFieldWithCurrentValues = (book: BaseBook): void => {
  (document.getElementById("bookTitle") as HTMLInputElement).value = book.title;

  (document.getElementById("bookAuthor") as HTMLInputElement).value =
    book.author.name;

  (document.getElementById("bookIsbn") as HTMLInputElement).value =
    book.isbn.toString();

  (document.getElementById("bookType") as HTMLSelectElement).value =
    book.category.name.toLowerCase();

  (document.getElementById("bookPubDate") as HTMLInputElement).value =
    book.year.toString();

  (document.getElementById("bookPrice") as HTMLInputElement).value =
    book.price.toString();
};

/* --------------------------------------------------------------------- */

const setFieldWithUpdateValues = (): object => {
  return {
    title: (document.getElementById("bookTitle") as HTMLInputElement).value,

    author: {
      name: (document.getElementById("bookAuthor") as HTMLInputElement).value,
    },

    isbn: parseInt(
      (document.getElementById("bookIsbn") as HTMLInputElement).value,
      10
    ),

    year: (document.getElementById("bookPubDate") as HTMLInputElement).value,

    category: {
      name: (document.getElementById("bookType") as HTMLSelectElement).value,
    },

    price: parseFloat(
      (document.getElementById("bookPrice") as HTMLInputElement).value
    ),

    age: new BookAgeCalculator().findBookAge(
      (document.getElementById("bookPubDate") as HTMLInputElement).value
    ),
  };
};

/* --------------------------------------------------------------------- */

const editBook = (isbn: number): void => {
  const book: BaseBook | undefined = books.find((book) => book.isbn === isbn);

  if (book) {
    setFieldWithCurrentValues(book);
    document.addEventListener("DOMContentLoaded", (): void => {
      const form: HTMLFormElement = document.getElementById(
        "bookForm"
      ) as HTMLFormElement;
      form.onsubmit = (event: Event): void => {
        event.preventDefault();
        const updatedData: Partial<BaseBook> = setFieldWithUpdateValues();
        updateBook(isbn, updatedData);
      };
    });
    deleteBook(isbn);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

/* --------------------------------------------------------------------- */

const deleteBook = (isbn: number): void => {
  const removeBookIndex: number = books.findIndex((book) => book.isbn === isbn);
  if (removeBookIndex !== -1) {
    books.splice(removeBookIndex, 1);
    displayBook(books);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

/* --------------------------------------------------------------------- */

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
          { name: book.category.name.toLowerCase() },
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

/* --------------------------------------------------------------------- */

const inputGenre: HTMLSelectElement = document.getElementById(
  "searchGenre"
) as HTMLSelectElement;

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

/* --------------------------------------------------------------------- */

const filterBooksByGenre = (category: string): Promise<BaseBook[]> => {
  return new Promise((resolve, reject) => {
    setTimeout((): void => {
      try {
        const filteredBooks: BaseBook[] = books.filter(
          (book) => book.category.name.toLowerCase() === category
        );
        resolve(filteredBooks);
      } catch (error) {
        reject(error);
      }
    });
  });
};

/* --------------------------------------------------------------------- */

const sortBooks = (sortBy: boolean): void => {
  books.sort((a, b): number => {
    const ageA: number = a.age.y * 365 + a.age.m * 30 + a.age.d;
    const ageB: number = b.age.y * 365 + b.age.m * 30 + b.age.d;
    return sortBy ? ageA - ageB : ageB - ageA;
  });
  displayBook(books);
};

/* --------------------------------------------------------------------- */

const handleSortChange = (value: string): void => {
  if (value === "ascending") {
    sortBooks(true);
  } else if (value === "descending") {
    sortBooks(false);
  }
};

/* --------------------------------------------------------------------- */

const infoBook = (bookIndex: number): void => {
  window.location.href = `detail-book.html?index=${bookIndex}`;
};

/* --------------------------------------------------------------------- */