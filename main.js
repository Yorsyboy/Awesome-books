// Checking if storge is availiable
// eslint-disable-next-line max-classes-per-file
const storageAvailable = (type) => {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
      e.code === 22
          || e.code === 1014
          || e.name === 'QuotaExceededError'
          || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
        && (storage && storage.length !== 0);
  }
};

class Book {
     title;

     author;

     constructor(title, author) {
       this.title = title;
       this.author = author;
     }
}

// consist list of books
class Library {
    books = [];

    constructor() {
      this.books = [];
    }

    // check if a book exists
    bookExists(book) {
      for (let i = 0; i < this.books.length; i += 1) {
        if (this.books[i].title === book.title && this.books[i].author === book.author) {
          return true;
        }
      }
      return false;
    }

    // add a new book
    addBook(book) {
      if (!this.bookExists(book)) {
        // eslint-disable-next-line no-use-before-define
        displayNewElement(book);
        this.books.push(book);
        this.updateLocalStorage();
        return;
      }
      alert('The Book and Author exist');
    }

    // Remove a book from the list of lists
    removeBook(book) {
      for (let i = 0; i < this.books.length; i += 1) {
        if (this.books[i].title === book.title && this.books[i].author === book.author) {
          this.books.splice(i, 1);
          this.updateLocalStorage();
          return;
        }
      }
    }

    // update locastorage
    updateLocalStorage() {
      if (storageAvailable('localStorage')) {
        localStorage.setItem('books', JSON.stringify(this.books));
      }
    }
}

// Initializing Library
const library = new Library();

// Load intial book stored
const localBooksData = localStorage.getItem('books');
if (localBooksData) {
  library.books = JSON.parse(localBooksData);
}

// Dynamic Html display for add books
const booksList = document.getElementById('books-list');
const displayNewElement = (book) => {
  // Shows the added book in html
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.textContent = 'Remove Book';

  bookDiv.innerHTML = `
  <div class="book-store">
    <h2 class="book-title">"${book.title}"</h2>
    <p class="book-author">by ${book.author}</p>
  </div>
  `;
  bookDiv.appendChild(removeButton);

  if (library.books.length === 0) {
    booksList.innerHTML = '';
  }

  booksList.appendChild(bookDiv);

  removeButton.addEventListener('click', () => {
    library.removeBook(book);
    bookDiv.remove();

    if (library.books.length === 0) {
      booksList.innerHTML = `
        <p class="empty-library">No Books in the Library.</p>
      `;
    }
  });
};

// Display all books when the page is loaded
if (library.books.length === 0) {
  booksList.innerHTML = `
          <p class="empty-library">No Books in the Library.</p>
        `;
} else {
  library.books.forEach((book) => {
    displayNewElement(book);
  });
}

// Display Sections Dynamically
const inputFormSection = document.getElementById('input-form');
const awesomeBooksSection = document.getElementById('awesome-books');
const showListButton = document.getElementById('show-list-button');
const addNewButton = document.getElementById('add-new-button');
const contactInfoSection = document.getElementById('contact-info');
const contactInfoButton = document.getElementById('contact-info-button'); const switchMode = (node) => {
  if (showListButton !== node && showListButton.classList.contains('active')) {
    showListButton.classList.remove('active');
  } else if (addNewButton !== node && addNewButton.classList.contains('active')) {
    addNewButton.classList.remove('active');
  } else if (contactInfoButton !== node && contactInfoButton.classList.contains('active')) {
    contactInfoButton.classList.remove('active');
  }
  node.classList.add('active');
}; const showBooksList = () => {
  switchMode(showListButton);
  awesomeBooksSection.style.display = 'flex'; contactInfoSection.style.display = 'none';
  inputFormSection.style.display = 'none';
}; showListButton.addEventListener('click', (event) => {
  event.preventDefault();
  showBooksList();
}); addNewButton.addEventListener('click', (event) => {
  event.preventDefault();
  switchMode(addNewButton);
  inputFormSection.style.display = 'flex';
  awesomeBooksSection.style.display = 'none';
  contactInfoSection.style.display = 'none';
}); contactInfoButton.addEventListener('click', (event) => {
  event.preventDefault();
  switchMode(contactInfoButton);
  contactInfoSection.style.display = 'flex';
  awesomeBooksSection.style.display = 'none';
  inputFormSection.style.display = 'none';
});
// Event Listenser for Add book button
const addBook = document.getElementById('add-book-form');
addBook.addEventListener('submit', (event) => {
  event.preventDefault();
  library.addBook(new Book(addBook.elements.title.value, addBook.elements.author.value));
  addBook.elements.title.value = '';
  addBook.elements.author.value = '';
  showBooksList();
}); document.getElementById('current-date').innerHTML = new Date().toLocaleString();
document.getElementById('year').innerHTML = new Date().getFullYear();
