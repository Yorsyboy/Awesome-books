// Declare books list
let books = [];

// Local Storage Functions
// Check if Storage is available
function storageAvailable(type) {
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
}

// Updates the Local Storage
function updateLocalStorage() {
  if (storageAvailable('localStorage')) {
    localStorage.setItem('books', JSON.stringify(books));
  }
}

const localBooksData = localStorage.getItem('books');

// Load initially stored data
if (localBooksData) {
  books = JSON.parse(localBooksData);
}

// Books Values & Functions
const booksList = document.getElementById('books-list');

// Check if a book exists
function bookExists(book) {
  for (let i = 0; i < books.length; i += 1) {
    if (books[i].title === book.title && books[i].author === book.author) {
      return true;
    }
  }
  return false;
}

// Remove a book from the list of lists
function removeBook(book) {
  for (let i = 0; i < books.length; i += 1) {
    if (books[i].title === book.title && books[i].author === book.author) {
      books.splice(i, 1);
      updateLocalStorage();
      return;
    }
  }
}

// Shows the added book in html
function displayNewElement(book) {
  const bookDiv = document.createElement('div');
  bookDiv.classList.add('book');

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-button');
  removeButton.textContent = 'Remove';

  bookDiv.innerHTML = `
    <h2 class="book-title">${book.title}</h2>
    <p class="book-author">${book.author}</p>
  `;
  bookDiv.appendChild(removeButton);
  bookDiv.appendChild(document.createElement('hr'));

  booksList.appendChild(bookDiv);

  removeButton.addEventListener('click', () => {
    removeBook(book);
    bookDiv.remove();
  });
}

// Add a new book to the list of books
function addBook(book) {
  if (!bookExists(book)) {
    books.push(book);
    displayNewElement(book);
    updateLocalStorage();
    return;
  }
  alert('The Book and Author exist');
}

// Display all books when the page is loaded
books.forEach((book) => {
  displayNewElement(book);
});

// Add Event Listener on Add Book button
const addBookForm = document.getElementById('add-book-form');

addBookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addBook({
    title: addBookForm.elements.title.value,
    author: addBookForm.elements.author.value,
  });
});
