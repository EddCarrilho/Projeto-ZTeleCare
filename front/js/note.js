let addButton = document.getElementById("addbox");
let row = document.getElementById("row");
addButton.addEventListener("click", createNote);

function createNote() {
  let notes = localStorage.getItem("notes");
  let noteHeading = "Titulo";
  let noteText = "Texto da anotação";
  if (notes == null || notes == "" || notes.length === 0) {
    notesObj = [];
    let htmlCode = `<div class="col-4 col-sm-12 col-md-4">
    <div class="notebox">
      <div class="notedatecontainer"><h6>6 June</h6></div>
      <textarea class="form-control noteheading" maxlength="25">
${noteHeading}</textarea
      >
      <div class="notecontainer">
        <textarea class="notedata form-control" style="height: 190px">
${noteText}</textarea
        >
      </div>
      <div class="noteaction">
        <i class="fa fa-floppy-o savebutton" id="savebtn"></i
        ><i class="fa fa-trash deletebutton" id="deletebtn"></i>
      </div>
    </div>
  </div>`;
    row.innerHTML += htmlCode;
  } else {
    notesObj = JSON.parse(notes);
  }
  let myObj = JSON.parse(localStorage.getItem("notes"));
  myObj = {
    title: noteHeading,
    text: noteText,
  };
  notesObj.push(myObj);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

function showNotes() {
  let notes = localStorage.getItem("notes");
  if (notes == null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }
  let html = "";
  let d = new Date();
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  //   <p class="notecount">${index + 1}</p>
  notesObj.forEach(function (element, index) {
    html += `<div class="col-12 col-sm-12 col-md-6 col-lg-4">
    <div class="notebox">
      <div class="notedatecontainer"><h6>${
        d.getDate() + " " + months[d.getMonth()]
      }</h6></div>
     
      <textarea class="form-control noteheading" id="noteheading${
        index + 1
      }" onchange="saveNote(${index + 1})" maxlength="25">
${element.title}</textarea>
      <div class="notecontainer">
        <textarea class="notedata form-control" style="height: 190px" id="notedata${
          index + 1
        }" onchange="saveNote(${index + 1})">
${element.text}</textarea>
      </div>
      <div class="noteaction">
        <i class="fa fa-floppy-o savebutton" id="${
          index + 1
        }" onclick="saveNote(this.id)"></i>
        <i class="fa fa-trash deletebutton" id="${
          index + 1
        }" onclick="deleteNote(this.id)""></i>
      </div>
    </div>
  </div>`;
  });
  if (notesObj.length != 0) {
    row.innerHTML = html;
  } else {
    row.innerHTML = `<h4>Sem anotações por agora. Faça uma anotação !<img src="../images/arrow.png" width="50"/></h4>`;
  }
}

function deleteNote(index) {
  //   let confirmDel = confirm("Delete this note?");
  //   if (confirmDel == true) {
  //     let notes = localStorage.getItem("notes");
  //     if (notes == null) {
  //       notesObj = [];
  //     } else {
  //       notesObj = JSON.parse(notes);
  //     }

  //     notesObj.splice(index - 1, 1);
  //     localStorage.setItem("notes", JSON.stringify(notesObj));
  //     showNotes();
  //   }

  notesObj.splice(index - 1, 1);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

function saveNote(index) {
  let notes = localStorage.getItem("notes");

  if (notes === null) {
    notesObj = [];
  } else {
    notesObj = JSON.parse(notes);
  }
  let noteTitle = document.getElementById(`noteheading${index}`);
  let noteData = document.getElementById(`notedata${index}`);

  notesObj[index - 1] = {
    ...notesObj[index - 1],
    title: noteTitle.value,
    text: noteData.value,
  };
  console.log(notesObj);
  localStorage.setItem("notes", JSON.stringify(notesObj));
  showNotes();
}

showNotes();