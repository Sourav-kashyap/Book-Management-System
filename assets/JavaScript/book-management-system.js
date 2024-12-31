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
});

function validateFormData() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const isbn = document.getElementById("bookIsbn").value;

  if (!title || !author || !isbn) {
    alert("All fields must be requried");
    return false; // Something is wrong prevent form submission.
  }

  if (isNaN(isbn)) {
    alert("ISBN must be a number");
    return false; // Something is wrong prevent form submission.
  }

  return true; // All fields are correct allow form submission.
}

/* Book array store book objects. */
const books = [
  {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262033848",
    genre: "educational",
    year: "2009",
    age: { y: 15, m: 2, d: 0 },
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    isbn: "9780486266846",
    genre: "horror",
    year: "1897",
    age: { y: 127, m: 0, d: 0 },
  },
  {
    title: "The Waste Land",
    author: "T.S. Eliot",
    isbn: "9780156711425",
    genre: "poetry",
    year: "1922",
    age: { y: 102, m: 0, d: 0 },
  },
  {
    title: "The Joy of Cooking",
    author: "Irma S. Rombauer",
    isbn: "9780743246262",
    genre: "cookbooks",
    year: "1931",
    age: { y: 93, m: 0, d: 0 },
  },
  {
    title: "Goodnight Moon",
    author: "Margaret Wise Brown",
    isbn: "9780694003617",
    genre: "children's",
    year: "1947",
    age: { y: 77, m: 0, d: 0 },
  },
  {
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    isbn: "9780156012195",
    genre: "children's",
    year: "1943",
    age: { y: 81, m: 0, d: 0 },
  },
  {
    title: "The Cookbook for the Modern Chef",
    author: "Gordon Ramsay",
    isbn: "9781408816142",
    genre: "cookbooks",
    year: "2012",
    age: { y: 12, m: 0, d: 0 },
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    genre: "educational",
    year: "1988",
    age: { y: 36, m: 0, d: 0 },
  },
];

const addBook = (book) => {
  books.push(book);
  displayBook(books);
};

const displayBook = (books) => {
  const tableBody = document.querySelector("#bookTable tbody");
  tableBody.innerHTML = "";

  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = ` 
            <td>${book.title}</td> 
            <td>${book.author}</td> 
            <td>${book.isbn}</td> 
            <td>${book.year}</td> 
            <td>${book.genre}</td> 
            <td>${book.age.y} years, ${book.age.m} months, ${book.age.d} days</td>
            <td>
                <button id="deleteBtn" onclick="deleteBook('${book.isbn}')">Delete</button>
                <button id="editBtn" onclick="editBook('${book.isbn}')">Edit</button>
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
    document.getElementById("bookType").value = book.genre;
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
inputGenre.addEventListener("input", () => {
  const inputValue = inputGenre.value.toLowerCase();
  if (inputValue == "") {
    displayBook(books);
  } else {
    const resultBooks = books.filter((book) => book.genre === inputValue);
    displayBook(resultBooks);
  }
});
