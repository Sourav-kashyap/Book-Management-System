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
        const title = document.getElementById("bookTitle").value;
        const author = {
            name: document.getElementById("bookAuthor").value,
        };
        const isbn = parseInt(document.getElementById("bookIsbn").value, 10);
        if (!validateFormData(title, author, isbn))
            return;
        const category = {
            name: document.getElementById("bookType").value,
        };
        const year = document.getElementById("bookPubDate").value;
        const price = parseFloat(document.getElementById("bookPrice").value);
        const age = BaseBook.findBookAge(year);
        addBook(new BaseBook(title, author, isbn, category, year, age, price, "", 0));
        form.reset();
    });
    fetchBooksFromApi();
});
function validateFormData(title, author, isbn) {
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
    constructor(title, author, isbn, category, year, age, price, size, pages) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
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
        if (typeof year === "string") {
            // Handle the case where year is a string
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
        else {
            console.log(`Year ${year} is not a string`);
        }
        return { y: 0, m: 0, d: 0 };
    }
}
class EBook extends BaseBook {
    constructor(title, author, isbn, category, year, age) {
        super(title, author, isbn, category, year, age, 0, "", 0);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.year = year;
        this.age = age;
    }
    calculateDiscountPrice(originalPrice) {
        if (typeof originalPrice === "number")
            return (originalPrice * 0.8); // 20% discount for Ebooks
        else {
            console.log(`originalPrice ${originalPrice} is not a number`);
            return 0;
        }
    }
}
class PrintedBook extends BaseBook {
    constructor(title, author, isbn, category, year, age) {
        super(title, author, isbn, category, year, age, 0, "", 0);
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.category = category;
        this.year = year;
        this.age = age;
    }
    calculateDiscountPrice(originalPrice) {
        if (typeof originalPrice === "number")
            return (originalPrice * 0.9); // 10% discount for printed books
        else {
            console.log(`originalPrice ${originalPrice} is not a number`);
            return 0;
        }
    }
}
let books = [];
const addBook = (book) => {
    if (book instanceof BaseBook) {
        books.push(book);
        displayBook(books);
    }
    else {
        console.error("Invalid book type. Only BaseBook or its subclasses are allowed.");
    }
};
function createBookTableRow(book, index) {
    const row = document.createElement("tr");
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
      ${new EBook(book.title, book.author, book.isbn, book.category, book.year, BaseBook.findBookAge(JSON.stringify(book.age)))
        .calculateDiscountPrice(Number(book.price))
        .toFixed(2)}
      </td>
      <td class="text-center">
      ${new PrintedBook(book.title, book.author, book.isbn, book.category, book.year, BaseBook.findBookAge(JSON.stringify(book.age)))
        .calculateDiscountPrice(Number(book.price))
        .toFixed(2)}
      </td>
     `;
    return row;
}
const displayBook = (books) => {
    const tableBody = document.querySelector("#bookTable tbody");
    tableBody.innerHTML = "";
    books.forEach((book, index) => {
        if (book instanceof BaseBook) {
            tableBody.appendChild(createBookTableRow(book, index));
        }
        else {
            console.error(`Invalid book detected at index ${index}`);
        }
    });
};
/*
  BaseBook is a type that has a set of properties, like title, author, year, etc.
  When you use Partial<BaseBook>, it means that you can create an object where
  any or all of those properties are optional.
*/
const updateBook = (isbn, updatedData) => {
    const bookIndex = books.findIndex((book) => book.isbn === isbn);
    if (bookIndex !== -1) {
        // Ensure that getBookAge is not lost during update
        const updatedBook = Object.assign(Object.assign(Object.assign({}, books[bookIndex]), updatedData), { 
            // Only overwrite getBookAge if it's provided in updatedData
            getBookAge: updatedData.getBookAge || books[bookIndex].getBookAge });
        // Update the book in the array
        books[bookIndex] = updatedBook;
        displayBook(books);
        const form = document.getElementById("bookForm");
        form.reset();
    }
    else {
        console.log(`Book with ISBN ${isbn} not found`);
    }
};
function setFieldWithCurrentValues(book) {
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value =
        book.author.name;
    document.getElementById("bookIsbn").value =
        book.isbn.toString();
    document.getElementById("bookType").value =
        book.category.name.toLowerCase();
    document.getElementById("bookPubDate").value =
        book.year.toString();
    document.getElementById("bookPrice").value =
        book.price.toString();
}
function setFieldWithUpdateValues() {
    return {
        title: document.getElementById("bookTitle").value,
        author: {
            name: document.getElementById("bookAuthor").value,
        },
        isbn: parseInt(document.getElementById("bookIsbn").value, 10),
        year: document.getElementById("bookPubDate").value,
        category: {
            name: document.getElementById("bookType").value,
        },
        price: parseFloat(document.getElementById("bookPrice").value),
        age: BaseBook.findBookAge(document.getElementById("bookPubDate").value),
    };
}
const editBook = (isbn) => {
    const book = books.find((book) => book.isbn === isbn);
    if (book) {
        setFieldWithCurrentValues(book);
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("bookForm");
            form.onsubmit = (event) => {
                event.preventDefault();
                const updatedData = setFieldWithUpdateValues();
                updateBook(isbn, updatedData);
            };
        });
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
        const fetchBooks = data.map((book) => new BaseBook(book.title, book.author, book.isbn, { name: book.category.name.toLowerCase() }, book.year, book.age, book.price, book.size, book.pages));
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
const filterBooksByGenre = (category) => {
    if (typeof category === "string") {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const filteredBooks = books.filter((book) => book.category.name.toLowerCase() === category);
                    resolve(filteredBooks);
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
    else {
        return Promise.reject(new Error(`Category type ${typeof category} is not a string`));
    }
};
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
