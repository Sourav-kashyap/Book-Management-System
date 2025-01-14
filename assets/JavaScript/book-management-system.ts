interface Author {
  name: string;
}

interface Category {
  name: string;
}

interface Book {
  title: string;
  author: Author;
  isbn: number;
  category: Category;
  year: string;
  age: { y: number; m: number; d: number };
  price: number;
  size: string;
  pages: number;
  getBookAge(): string;
}

document.addEventListener("DOMContentLoaded", (): void => {
  const form: HTMLFormElement = document.getElementById(
    "bookForm"
  ) as HTMLFormElement;

  form.addEventListener("submit", (event): void => {
    event.preventDefault();

    const title: string = (
      document.getElementById("bookTitle") as HTMLInputElement
    ).value;

    const author: Author = {
      name: (document.getElementById("bookAuthor") as HTMLInputElement).value,
    };

    const isbn: number = parseInt(
      (document.getElementById("bookIsbn") as HTMLInputElement).value,
      10
    );

    if (!validateFormData(title, author, isbn)) return;

    const category: Category = {
      name: (document.getElementById("bookType") as HTMLSelectElement).value,
    };

    const year: string = (
      document.getElementById("bookPubDate") as HTMLInputElement
    ).value;

    const price: number = parseFloat(
      (document.getElementById("bookPrice") as HTMLInputElement).value
    );

    const age: { y: number; m: number; d: number } =
      BaseBook.findBookAge<string>(year);

    addBook<BaseBook>(
      new BaseBook(title, author, isbn, category, year, age, price, "", 0)
    );

    form.reset();
  });

  fetchBooksFromApi();
});

function validateFormData(
  title: string,
  author: Author,
  isbn: number
): boolean {
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

class BaseBook implements Book {
  constructor(
    public title: string,
    public author: Author,
    public isbn: number,
    public category: Category,
    public year: string,
    public age: { y: number; m: number; d: number },
    public price: number,
    public size: string,
    public pages: number
  ) {}

  getBookAge(): string {
    return `${this.age.y} years, ${this.age.m} months, ${this.age.d} days`;
  }

  static findBookAge<T>(year: T): { y: number; m: number; d: number } {
    const currDate = new Date();
    if (typeof year === "string") {
      // Handle the case where year is a string
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
    } else {
      console.log(`Year ${year} is not a string`);
    }
    return { y: 0, m: 0, d: 0 };
  }
}

class EBook extends BaseBook {
  constructor(
    public title: string,
    public author: Author,
    public isbn: number,
    public category: Category,
    public year: string,
    public age: { y: number; m: number; d: number }
  ) {
    super(title, author, isbn, category, year, age, 0, "", 0);
  }

  calculateDiscountPrice<T>(originalPrice: T): T {
    if (typeof originalPrice === "number")
      return (originalPrice * 0.8) as T; // 20% discount for Ebooks
    else {
      console.log(`originalPrice ${originalPrice} is not a number`);
      return 0 as T;
    }
  }
}

class PrintedBook extends BaseBook {
  constructor(
    public title: string,
    public author: Author,
    public isbn: number,
    public category: Category,
    public year: string,
    public age: { y: number; m: number; d: number }
  ) {
    super(title, author, isbn, category, year, age, 0, "", 0);
  }

  calculateDiscountPrice<T>(originalPrice: T): T {
    if (typeof originalPrice === "number")
      return (originalPrice * 0.9) as T; // 10% discount for printed books
    else {
      console.log(`originalPrice ${originalPrice} is not a number`);
      return 0 as T;
    }
  }
}

let books: BaseBook[] = [];

const addBook = <T>(book: T): void => {
  if (book instanceof BaseBook) {
    books.push(book);
    displayBook<BaseBook>(books);
  } else {
    console.error(
      "Invalid book type. Only BaseBook or its subclasses are allowed."
    );
  }
};

function createBookTableRow(
  book: BaseBook,
  index: number
): HTMLTableRowElement {
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
      ${new EBook(
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.year,
        BaseBook.findBookAge<string>(JSON.stringify(book.age))
      )
        .calculateDiscountPrice<number>(Number(book.price))
        .toFixed(2)}
      </td>
      <td class="text-center">
      ${new PrintedBook(
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.year,
        BaseBook.findBookAge<string>(JSON.stringify(book.age))
      )
        .calculateDiscountPrice<number>(Number(book.price))
        .toFixed(2)}
      </td>
     `;
  return row;
}

const displayBook = <T>(books: T[]): void => {
  const tableBody: HTMLTableElement = document.querySelector(
    "#bookTable tbody"
  ) as HTMLTableElement;
  tableBody.innerHTML = "";
  books.forEach((book, index): void => {
    if (book instanceof BaseBook) {
      tableBody.appendChild(createBookTableRow(book, index));
    } else {
      console.error(`Invalid book detected at index ${index}`);
    }
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
    // Ensure that getBookAge is not lost during update
    const updatedBook: BaseBook = {
      ...books[bookIndex],
      ...updatedData,

      // Only overwrite getBookAge if it's provided in updatedData
      getBookAge: updatedData.getBookAge || books[bookIndex].getBookAge,
    };

    // Update the book in the array
    books[bookIndex] = updatedBook;
    displayBook<BaseBook>(books);

    const form: HTMLFormElement = document.getElementById(
      "bookForm"
    ) as HTMLFormElement;
    form.reset();
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

function setFieldWithCurrentValues(book: BaseBook) {
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
}

function setFieldWithUpdateValues() {
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

    age: BaseBook.findBookAge(
      <string>(document.getElementById("bookPubDate") as HTMLInputElement).value
    ),
  };
}

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

const deleteBook = (isbn: number): void => {
  const removeBookIndex: number = books.findIndex((book) => book.isbn === isbn);
  if (removeBookIndex !== -1) {
    books.splice(removeBookIndex, 1);
    displayBook<BaseBook>(books);
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
          { name: book.category.name.toLowerCase() },
          book.year,
          book.age,
          book.price,
          book.size,
          book.pages
        )
    );
    books = [...books, ...fetchBooks];
    displayBook<BaseBook>(books);
  } catch (error) {
    alert(`Error: ${(error as Error).message}`);
  }
};

const inputGenre: HTMLSelectElement = document.getElementById(
  "searchGenre"
) as HTMLSelectElement;

inputGenre.addEventListener("input", async (): Promise<void> => {
  const inputValue: string = inputGenre.value.toLowerCase();
  try {
    if (inputValue == "") {
      displayBook<BaseBook>(books);
    } else {
      const resultBooks: BaseBook[] = await filterBooksByGenre<string>(
        inputValue
      );
      displayBook<BaseBook>(resultBooks);
    }
  } catch (error) {
    console.error("Error filtering books by genre:", error);
  }
});

const filterBooksByGenre = <T>(category: T): Promise<BaseBook[]> => {
  if (typeof category === "string") {
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
  } else {
    return Promise.reject(
      new Error(`Category type ${typeof category} is not a string`)
    );
  }
};

const sortBooks = <T>(sortBy: T): void => {
  books.sort((a, b): number => {
    const ageA: number = a.age.y * 365 + a.age.m * 30 + a.age.d;
    const ageB: number = b.age.y * 365 + b.age.m * 30 + b.age.d;
    return sortBy ? ageA - ageB : ageB - ageA;
  });
  displayBook<BaseBook>(books);
};

const handleSortChange = (value: string): void => {
  if (value === "ascending") {
    sortBooks<boolean>(true);
  } else if (value === "descending") {
    sortBooks<boolean>(false);
  }
};

function infoBook(bookIndex: number): void {
  window.location.href = `detail-book.html?index=${bookIndex}`;
}