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
        /* new Date(document.getElementById("bookPubDate").value).getFullYear(); */

        addBook({title , author , isbn , genre , year});
        
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
    displayBook();
}

const displayBook = () => { 
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
            <td>
                <button id="deleteBtn" onclick="deleteBook('${book.isbn}')">Delete</button>
                <button id="editBtn" onclick="editBook('${book.isbn}')">Edit</button>
            </td> 
        `;
        tableBody.appendChild(row); 
    }); 
};