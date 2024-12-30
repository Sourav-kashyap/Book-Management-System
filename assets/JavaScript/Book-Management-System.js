/*  DOMContentLoaded is an event in JS that fires when the initial HTML document has been completely 
    loaded and parsed without waiting for stylesheets, image, and other resources to finish loading */

document.addEventListener("DOMContentLoaded" , () => {
    const form = document.getElementById("bookForm");

    form.addEventListener("submit" , (event) =>{
        event.preventDefault();

        if(!validateFormData()) return;

        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;
        const isbn = document.getElementById("bookIsbn").value;
        const genre = document.getElementById("bookType").value;
        const year = document.getElementById("bookPubDate").value;
        const age = findBookAge(year);
        /* new Date(document.getElementById("bookPubDate").value).getFullYear(); */

        addBook({title , author , isbn , genre , year , age});
        
        /* 
            reset function is a built-in JS method on HTML form elements. it clear all user
            input in the form fields, resetting them to their intitial values(defined in the 
            HTML or blanck by default)
        */
        form.reset();
    })
})

function validateFormData(){
    const title = document.getElementById("bookTitle").value;
    const author = document.getElementById("bookAuthor").value;
    const isbn = document.getElementById("bookIsbn").value;

    if(!title || !author || !isbn){
        alert("All fields must be requried");
        return false; // Something is wrong prevent form submission.
    }
    
    if(isNaN(isbn)){
        alert("ISBN must be a number");
        return false; // Something is wrong prevent form submission.
    }
    
    return true; // All fields are correct allow form submission.
}

/* Book array store book objects. */
let books = [];

const addBook = (book) =>{
    books.push(book);
    displayBook(books);
}

const displayBook = (books) => { 
    const tableBody = document.querySelector("#bookTable tbody"); 
    tableBody.innerHTML = ""; 

    books.forEach(book => { 
        const row = document.createElement("tr"); 
        row.innerHTML = 
        ` 
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
    const bookIndex = books.findIndex(book => book.isbn === isbn);    
    if(bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...updatedData };
        displayBook();  
        const form = document.getElementById("bookForm");
        form.reset();
    }else{
        console.log(`Book with ISBN ${isbn} not found`);
    }
};

const editBook = (isbn) => {
    const book = books.find(book => book.isbn === isbn);

    if(book) {
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookIsbn').value = book.isbn;
        document.getElementById('bookType').value = book.genre;
        document.getElementById('bookPubDate').value = book.year;
       
        document.addEventListener("DOMContentLoaded" , () => {
            const form = document.getElementById('bookForm');
            form.onsubmit = (event) => {
                event.preventDefault();
                const updatedData = {
                    title: document.getElementById('bookTitle').value,
                    author: document.getElementById('bookAuthor').value,
                    isbn: document.getElementById('bookIsbn').value,
                    year: document.getElementById('bookPubDate').value,
                    genre: document.getElementById('bookType').value
                };
                updateBook(isbn, updatedData);  
            };
        });
        deleteBook(isbn);
    }else{
        console.log(`Book with ISBN ${isbn} not found`);
    }
};

const deleteBook = (isbn) =>{
    // findIndex method returns the index of the first element that satisfies the condition.
    const removeBookIndex = books.findIndex(book => book.isbn === isbn);
    if(removeBookIndex !== -1){
        books.splice(removeBookIndex , 1);
        displayBook();
    }else{
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
        diffDay += new Date(currDate.getFullYear(), currDate.getMonth(), 0).getDate(); // Add days from the previous month
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
inputGenre.addEventListener("input" , () =>{
    const inputValue = inputGenre.value.toLowerCase();
    if(inputValue == ""){
        displayBook(books);
    }else{
        const resultBooks = books.filter((book) => book.genre === inputValue);
        displayBook(resultBooks);
    }
})