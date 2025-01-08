"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!validateFormData())
            return;
        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;
        const isbn = parseInt(document.getElementById("bookIsbn").value, 10);
        const genre = document.getElementById("bookType").value;
        const year = document.getElementById("bookPubDate").value;
        const price = parseFloat(document.getElementById("bookPrice").value);
        const age = BaseBook.findBookAge(year);
        addBook(new BaseBook(title, author, isbn, genre, year, age, price, "", 0));
        // addBook(new BaseBook(title, author, isbn, genre, year, age, price, size, pages));
        form.reset();
    });
    fetchBooksFromApi();
});
function validateFormData() {
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const isbn = parseInt(document.getElementById("bookIsbn").value, 10);
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
    constructor(title, author, isbn, genre, year, age, price, size, pages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.year = year;
        this.age = age;
        this.price = price;
        this.size = size;
        this.pages = pages;
    }
    getBookAge() {
        return `${this.age.y} years, ${this.age.m} months, ${this.age.d} days`;
    }
    static findBookAge(year) {
        const currDate = new Date();
        const bookDate = new Date(year);
        let diffYear = currDate.getFullYear() - bookDate.getFullYear();
        let diffMonth = currDate.getMonth() - bookDate.getMonth();
        let diffDay = currDate.getDate() - bookDate.getDate();
        if (diffDay < 0) {
            diffMonth -= 1;
            diffDay += new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate();
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
    constructor(title, author, isbn, genre, year, age) {
        super(title, author, isbn, genre, year, age, 0, "", 0);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.year = year;
        this.age = age;
    }
    calculateDiscountPrice(originalPrice) {
        return originalPrice * 0.8; // 20% discount for eBooks
    }
}
class PrintedBook extends BaseBook {
    constructor(title, author, isbn, genre, year, age) {
        super(title, author, isbn, genre, year, age, 0, "", 0);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.genre = genre;
        this.year = year;
        this.age = age;
    }
    calculateDiscountPrice(originalPrice) {
        return originalPrice * 0.9; // 10% discount for printed books
    }
}
let books = [];
const addBook = (book) => {
    books.push(book);
    displayBook(books);
};
const displayBook = (books) => {
    const tableBody = document.querySelector("#bookTable tbody");
    tableBody.innerHTML = "";
    books.forEach((book, index) => {
        const row = document.createElement("tr");
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
      ${new EBook(book.title, book.author, book.isbn, book.genre, book.year, BaseBook.findBookAge(JSON.stringify(book.age)))
            .calculateDiscountPrice(book.price)
            .toFixed(2)}
      </td>
      <td class="text-center">
      ${new PrintedBook(book.title, book.author, book.isbn, book.genre, book.year, BaseBook.findBookAge(JSON.stringify(book.age)))
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
const updateBook = (isbn, updatedData) => {
    var _a;
    const bookIndex = books.findIndex((book) => book.isbn === isbn);
    if (bookIndex !== -1) {
        const updatedBook = Object.assign(Object.assign(Object.assign({}, books[bookIndex]), updatedData), { getBookAge: (_a = updatedData.getBookAge) !== null && _a !== void 0 ? _a : books[bookIndex].getBookAge });
        books[bookIndex] = updatedBook;
        displayBook(books);
        const form = document.getElementById("bookForm");
        form.reset();
    }
    else {
        console.log(`Book with ISBN ${isbn} not found`);
    }
};
const editBook = (isbn) => {
    const book = books.find((book) => book.isbn === isbn);
    if (book) {
        // Set the form fields with the current values of the book
        document.getElementById("bookTitle").value =
            book.title;
        document.getElementById("bookAuthor").value =
            book.author;
        document.getElementById("bookIsbn").value =
            book.isbn.toString();
        document.getElementById("bookType").value =
            book.genre.toLowerCase();
        document.getElementById("bookPubDate").value =
            book.year.toString();
        document.getElementById("bookPrice").value =
            book.price.toString();
        // Listen for form submission
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("bookForm");
            form.onsubmit = (event) => {
                event.preventDefault();
                // Collect updated data from the form
                const updatedData = {
                    title: document.getElementById("bookTitle")
                        .value,
                    author: document.getElementById("bookAuthor")
                        .value,
                    isbn: parseInt(document.getElementById("bookIsbn").value, 10),
                    year: document.getElementById("bookPubDate")
                        .value,
                    genre: document.getElementById("bookType")
                        .value,
                    price: parseFloat(document.getElementById("bookPrice").value),
                    age: BaseBook.findBookAge(document.getElementById("bookPubDate").value),
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
    }
    else {
        console.log(`Book with ISBN ${isbn} not found`);
    }
};
const deleteBook = (isbn) => {
    const removeBookIndex = books.findIndex((book) => book.isbn === isbn);
    if (removeBookIndex !== -1) {
        books.splice(removeBookIndex, 1);
        displayBook(books);
    }
    else {
        console.log(`Book with ISBN ${isbn} not found`);
    }
};
const fetchBooksFromApi = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch("../../dummy.json");
        if (!response.ok)
            throw new Error("Failed to fetch books");
        const data = yield response.json();
        const fetchBooks = data.map((book) => new BaseBook(book.title, book.author, book.isbn, book.genre.toLowerCase(), book.year, book.age, book.price, book.size, book.pages));
        books = [...books, ...fetchBooks];
        displayBook(books);
    }
    catch (error) {
        alert(`Error: ${error.message}`);
    }
});
const inputGenre = document.getElementById("searchGenre");
inputGenre.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const inputValue = inputGenre.value.toLowerCase();
    try {
        if (inputValue == "") {
            displayBook(books);
        }
        else {
            const resultBooks = yield filterBooksByGenre(inputValue);
            displayBook(resultBooks);
        }
    }
    catch (error) {
        console.error("Error filtering books by genre:", error);
    }
}));
const filterBooksByGenre = (genre) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const filteredBooks = books.filter((book) => book.genre.toLowerCase() === genre);
                resolve(filteredBooks);
            }
            catch (error) {
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
const sortBooks = (sortBy) => {
    books.sort((a, b) => {
        const ageA = a.age.y * 365 + a.age.m * 30 + a.age.d;
        const ageB = b.age.y * 365 + b.age.m * 30 + b.age.d;
        return sortBy ? ageA - ageB : ageB - ageA;
    });
    displayBook(books);
};
const handleSortChange = (value) => {
    if (value === "ascending") {
        sortBooks(true);
    }
    else if (value === "descending") {
        sortBooks(false);
    }
};
function infoBook(bookIndex) {
    window.location.href = `detail-book.html?index=${bookIndex}`;
}
