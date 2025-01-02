/*  DOMContentLoaded is an event in JS that fires when the initial HTML document has been completely
    loaded and parsed without waiting for stylesheets, image, and other resources to finish loading */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookForm");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateFormData()) return;

    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const isbn = document.getElementById("bookIsbn").value;
    const genre = document.getElementById("bookType").value;
    const year = document.getElementById("bookPubDate").value;

    const age = findBookAge(year);
    /* new Date(document.getElementById("bookPubDate").value).getFullYear(); */

    addBook({ title, author, isbn, genre, year, age });

    /*
        reset function is a built-in JS method on HTML form elements. it clear all user
        input in the form fields, resetting them to their intitial values(defined in the
        HTML or blanck by default)
    */
    form.reset();
  });
  fetchBooksFromApi();
});

function validateFormData() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const isbn = document.getElementById("bookIsbn").value;

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

/* Book array store book objects. */
let books = [];

const addBook = (book) => {
  books.push(book);
  displayBook(books);
};

const displayBook = (books) => {
  const tableBody = document.querySelector("#bookTable tbody");
  tableBody.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.className =
      "bg-white hover:bg-gray-100 border-b border-gray-200 text-sm text-gray-700";
    row.innerHTML = `
            <td class="py-2 px-4">${book.title}</td>
            <td class="py-2 px-4">${book.author}</td>
            <td class="py-2 px-4">${book.isbn}</td>
            <td class="py-2 px-4">${book.year}</td>
            <td class="py-2 px-4">${book.genre}</td>
            <td class="py-2 px-4">${book.age.y} years, ${book.age.m} months, ${book.age.d} days</td>
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
        `;
    tableBody.appendChild(row);
  });
};
const updateBook = (isbn, updatedData) => {
  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedData };
    displayBook(books);
    const form = document.getElementById("bookForm");
    form.reset();
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

const editBook = (isbn) => {
  const book = books.find((book) => book.isbn === isbn);

  if (book) {
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookIsbn").value = book.isbn;
    document.getElementById("bookType").value = book.genre.toLowerCase();
    document.getElementById("bookPubDate").value = book.year;

    document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("bookForm");
      form.onsubmit = (event) => {
        event.preventDefault();
        const updatedData = {
          title: document.getElementById("bookTitle").value,
          author: document.getElementById("bookAuthor").value,
          isbn: document.getElementById("bookIsbn").value,
          year: document.getElementById("bookPubDate").value,
          genre: document.getElementById("bookType").value,
        };
        updateBook(isbn, updatedData);
      };
    });
    deleteBook(isbn);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

const deleteBook = (isbn) => {
  // findIndex method returns the index of the first element that satisfies the condition.
  const removeBookIndex = books.findIndex((book) => book.isbn === isbn);
  if (removeBookIndex !== -1) {
    books.splice(removeBookIndex, 1);
    displayBook(books);
  } else {
    console.log(`Book with ISBN ${isbn} not found`);
  }
};

const findBookAge = (year) => {
  const currDate = new Date();
  const bookDate = new Date(year);

  let diffYear = currDate.getFullYear() - bookDate.getFullYear();
  let diffMonth = currDate.getMonth() - bookDate.getMonth();
  let diffDay = currDate.getDate() - bookDate.getDate();

  if (diffDay < 0) {
    diffMonth -= 1; // Borrow a month
    diffDay += new Date(
      currDate.getFullYear(),
      currDate.getMonth(),
      0
    ).getDate(); // Add days from the previous month
  }

  if (diffMonth < 0) {
    diffYear -= 1; // Borrow a year
    diffMonth += 12;
  }

  if (diffMonth >= 12) {
    diffYear += Math.floor(diffMonth / 12);
    diffMonth %= 12;
  }

  return {
    y: diffYear,
    m: diffMonth,
    d: diffDay,
  };
};

const inputGenre = document.getElementById("searchGenre");
inputGenre.addEventListener("input", async () => {
  const inputValue = inputGenre.value.toLowerCase();
  try {
    if (inputValue == "") {
      displayBook(books);
    } else {
      const resultBooks = await filterBooksByGenre(inputValue);
      displayBook(resultBooks);
    }
  } catch (error) {
    console.error("Error filtering books by genre:", error);
  }
});

const fetchBooksFromApi = async () => {
  try {
    const respsone = await fetch("/Book-Management-System/dummy.json");
    if (!respsone.ok) throw new Error("Failed to fetch books");
    const data = await respsone.json();
    const fetchBooks = data.map((book, index) => ({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      year: book.year,
      age: book.age,
    }));
    books = [...books, ...fetchBooks];
    displayBook(books);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

const filterBooksByGenre = (genre) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const filteredBooks = books.filter(
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

let isAscending = true;

const sortBooks = () => {
  books.sort((a, b) => {
    // 1 y, 0 m, 0 d --> 1 * 365 = 365 days
    const ageA = a.age.y * 365 + a.age.m * 30 + a.age.d;
    const ageB = b.age.y * 365 + b.age.m * 30 + b.age.d;

    return isAscending ? ageA - ageB : ageB - ageA;
  });

  isAscending = !isAscending;

  displayBook(books);
};
