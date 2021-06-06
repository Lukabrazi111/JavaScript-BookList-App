// Class Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// Class UI
class UI {
  static displayBook() {
    const books = Store.getBook();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const bookList = document.getElementById("book__list");
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="btn btn-danger">X</a></td>
    `;

    bookList.appendChild(row);
  }

  static deleteBookFromList(book) {
    if (book.classList.contains("btn-danger")) {
      book.parentElement.parentElement.remove();
      UI.showAlert("Book Removed!", "success");
    }
  }

  static clearFields() {
    document.getElementById("input__title").value = "";
    document.getElementById("input__author").value = "";
    document.getElementById("input__isbn").value = "";
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.textContent = message;
    const header = document.querySelector(".header");
    const form = document.getElementById("book__form");
    header.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

// Class Store
class Store {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBook();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: DOM content loaded
document.addEventListener("DOMContentLoaded", UI.displayBook);

// Event: form submit
document.getElementById("book__form").addEventListener("submit", (e) => {
  e.preventDefault();

  const inputTitle = document.getElementById("input__title").value;
  const inputAuthor = document.getElementById("input__author").value;
  const inputIsbn = document.getElementById("input__isbn").value;

  // Check if fields are filled
  if (inputTitle === "" || inputAuthor === "" || inputIsbn === "") {
    UI.showAlert("Please fill all fields!", "danger");
    return;
  }

  const book = new Book(inputTitle, inputAuthor, inputIsbn);

  // Add book to list from inputs
  UI.addBookToList(book);

  // Clear fields after submit
  UI.clearFields();

  // Add book in storage
  Store.addBook(book);

  // Success alert
  UI.showAlert("Book Added!", "success");
});

// Event: remove book
document.getElementById("book__list").addEventListener("click", (e) => {
  UI.deleteBookFromList(e.target);

  const isbnIndex = e.target.parentElement.previousElementSibling.innerText;

  Store.removeBook(isbnIndex);
});
