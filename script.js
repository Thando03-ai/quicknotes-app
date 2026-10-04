const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
let notes = JSON.parse(localStorage.getItem("notes")) || [];
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "No notes available.";
  } else if (count === 1) {
    noteCount.textContent = "1 note available.";
  } else {
    noteCount.textContent = `${count} notes available.`;
  }
}
function render(searchTerm = "") {
  notesList.innerHTML = "";
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (filteredNotes.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No notes match your search.";
    notesList.appendChild(li);
    updateCount(0);
    return;
  }
  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note-card");
    li.classList.add(`category-${note.category.toLowerCase()}`);
    const text = document.createElement("p");
    text.textContent = note.text;
    const category = document.createElement("small");
    category.textContent = `Category: ${note.category}`;
    const date = document.createElement("small");
    date.textContent = ` | ${new Date(note.createdAt).toLocaleString()}`;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      notes = notes.filter((n) => n.id !== note.id);
      saveNotes();
      render(searchInput.value);
    });
    li.appendChild(text);
    li.appendChild(category);
    li.appendChild(date);
    li.appendChild(document.createElement("br"));
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
  updateCount(filteredNotes.length);
}
noteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = noteInput.value.trim();
  if (text.length === 0) {
    errorMessage.textContent = "Note cannot be empty.";
    return;
  }
  if (text.length > 200) {
    errorMessage.textContent = "Note cannot exceed 200 characters.";
    return;
  }
  errorMessage.textContent = "";
  const newNote = {
    id: Date.now(),
    text: text,
    category: noteCategory.value,
    createdAt: new Date().toISOString(),
  };
  notes.push(newNote);
  saveNotes();
  render(searchInput.value);
  noteInput.value = "";
});
searchInput.addEventListener("input", () => {
  render(searchInput.value);
});
render();
