//* Element Selection
const notesContainer = document.querySelector("#notes_container");
const noteInput = document.querySelector("#note_content");
const addNoteBtn = document.querySelector(".add_note");
const inputSreach = document.querySelector("#search_input");
const exportCSV = document.querySelector("#export_notes");

//* Functions
const showNotes = () => {
  cleanNotes();
  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);

    notesContainer.appendChild(noteElement);
  });
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

const addNote = () => {
  const notes = getNotes();

  const noteObject = {
    id: genId(),
    content: noteInput.value,
    fixed: false,
  };

  noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  message("created_note");

  saveNotes(notes);

  noteInput.value = "";
};

const createNote = (id, content, fixed) => {
  const element = document.createElement("article");
  element.classList.add("note");

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.placeholder = "Adicione algum texto";
  element.appendChild(textarea);

  const pinIcon = document.createElement("ion-icon");
  pinIcon.name = "pin-outline";
  pinIcon.classList.add("pin");
  element.append(pinIcon);

  const deleteIcon = document.createElement("ion-icon");
  deleteIcon.name = "trash";
  deleteIcon.classList.add("delete");
  element.append(deleteIcon);

  const duplicateIcon = document.createElement("ion-icon");
  duplicateIcon.name = "file-tray-stacked-outline";
  duplicateIcon.classList.add("duplicate");
  element.append(duplicateIcon);

  if (fixed) {
    element.classList.add("fixed");
  }
  // Element Events
  element.querySelector("textarea").addEventListener("keyup", (e) => {
    const noteContent = e.target.value;

    updateNote(id, noteContent);
  });

  element.querySelector(".pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  element.querySelector(".delete").addEventListener("click", () => {
    deleteNote(id, element);
  });
  element.querySelector(".duplicate").addEventListener("click", () => {
    copyNote(id);
  });

  return element;
};

const toggleFixNote = (id) => {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.fixed = !targetNote.fixed;

  if (targetNote.fixed === true) {
    message("fixed_note");
  }

  saveNotes(notes);

  showNotes();
};

const genId = () => {
  return Math.floor(Math.random() * 10000);
};

const deleteNote = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);

  message("deleted_note");

  saveNotes(notes);

  notesContainer.removeChild(element);
};

const copyNote = (id) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  const noteObject = {
    id: genId(),
    content: targetNote.content,
    fixed: false,
  };

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  );

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  message("copied_note");

  saveNotes(notes);
};

const updateNote = (id, content) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.content = content;

  saveNotes(notes);
};

const searchNote = (query) => {
  const searchResults = getNotes().filter((note) =>
    note.content.includes(query)
  );

  if (query !== "") {
    cleanNotes();

    searchResults.forEach((note) => {
      const noteElement = createNote(note.id, note.content, note.fixed);

      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();
  showNotes();
};

const exportData = () => {
  const notes = getNotes();

  //TODO: Separate with "," and a break line "/n"

  const csvString = [
    ["ID", "Conteúdo", "Fixado?"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  console.log(csvString);

  const element = document.createElement("a");

  element.href = "data:text/csv;charset-utf-8," + encodeURI(csvString);

  element.target = "_blank";

  element.download = "notes.csv";

  element.click();
};

//* LocalStorage Functions
const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

  return orderedNotes;
};

//* Messages & Warnings
const message = (elementId) => {
  const targetMessage = document.querySelector(`#${elementId}`);
  targetMessage.classList.toggle("hide");

  setTimeout(() => {
    targetMessage.classList.toggle("hide");
  }, 1200);
};

//* Events
addNoteBtn.addEventListener("click", () => {
  addNote();
});

inputSreach.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchNote(search);
});

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

exportCSV.addEventListener("click", () => {
  exportData();
});
//* Initialize
showNotes();
