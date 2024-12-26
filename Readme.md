# Book Management System Project: 

A Book Management System is a project aimed at creating a software solution that facilitates the managment of books. The system will include key functionalities for adding books, viewiing details, and organizing book related data efficiently.


# Phases of the Book Management System Project: 

1. Requirements Phase :

Objective: Clearly understand the scope and functionalities of the system.

## Activities:

Identify core features:
- Add a book (Title, Author, ISBN, Publication Date, Genre).
- Edit or delete books.
- Display books in a table format.

Non-functional requirements:
- Simple, responsive UI using CSS.
- Data persistence in Local Storage or JSON files.

Define validation rules:
- Ensure all fields are filled.
- ISBN must be numeric.
- Publication Date must be valid.

2. Design Phase :

Objective: Plan the system's structure and layout.

## Activities:

Create UI wireframes for:
- Add book form.
- Books list table.

Develop the following diagrams:
- Client-Server Model: Represents the interaction between the client and data storage.
- 3-Tier Architecture: Demonstrates separation of Presentation, Application, and Data layers.

3. Implementation Phase :

Objective: Develop the system using the planned design.

## Activities:
- Build static pages using HTML and CSS
- Add interactivity using JavaScript:
- Validate inputs.
- Add books to Local Storage or JSON.
- Display books in a dynamically generated table.
- Enable editing and deleting books.
- Use modular JavaScript (ES6) for maintainability.

4. Testing Phase :

Objective: Validate the system against the requirements.

## Activities:
- Perform unit testing for JavaScript functions (e.g., validation, data manipulation).
- Test UI responsiveness and interactivity.
- Validate data persistence in Local Storage.

5. Deployment Phase :

Objective: Host the system for public access.

## Activities:
- Use GitHub Pages or similar platforms for deployment.
- Ensure all links and assets work correctly in the hosted environment.

6. Maintenance Phase :

Objective: Keep the system updated and functional post-deployment.

## Activities:
- Fix bugs reported by users.
- Add new features based on feedback (e.g., search or filter books).
- Enhance UI/UX as needed.

**************************************************************************************

# How to Clone a Repository to Your Local Computer

Follow these steps to clone this repository to your local system:

## Prerequisites:

- Ensure Git is installed on your computer.
- [Download Git](https://git-scm.com/downloads) if you don’t already have it.
- Have a terminal or command-line tool available (e.g., Command Prompt, Terminal, or Git Bash).

## Steps to Clone the Repository

1. Open the terminal or command-line tool.
2. Navigate to the directory where you want to clone the repository:
   - cd /path/to/your/directory

Copy the repository URL. It typically looks like this:
- https://github.com/Sourav-kashyap/Book-Management-System

## Run the git clone command followed by the URL:

- git clone https://github.com/username/repository-name.git
- After the cloning process is complete, navigate into the cloned repository directory:
- cd Book-Management-System
- Verify the Cloning

## Run the following command to list the contents of the repository:

- ls (You should see the files from the repository in your local directory.)

## Troubleshooting

- Error: "Permission denied (publickey)": Make sure your SSH key is added to your GitHub account if     you're using SSH instead of HTTPS.
- Error: "Repository not found": Double-check the repository URL for accuracy.

# Congratulations! You've successfully cloned the repository.