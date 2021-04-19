// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4} = require("uuid");

// Sets up the Express application
const app = express();

// Sets the port that is listening for responce from the server
const PORT = process.env.PORT || 3030;

// Allows the Express application to handle data parsing
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Allows the use of the public folder by the express application
app.use(express.static("public"));


const notesDatabase = returnNotes();

// Retrieves the notes from the db.json database, Creates an object for the parsed notes, For loop that runs through the notes array and retruns the notes to the webpage in HTML format
function returnNotes(){
    let data = fs.readFileSync("./db/db.json", "utf8");

    let notes = JSON.parse(data);

    for(let i = 0; i < notes.length; i++) {
        notes[i].id = 1 + i;
    }

    return notes;
};



// Creates new notes and writes them to the database as JSON objects
const writeNotes = () => {
    fs.writeFileSync("./db/db.json", JSON.stringify(notesDatabase));
}

// Shows all of the notes in the database as JSON objects
app.get("/api/notes", function (req, res) {
    res.json(notesDatabase);
});

// Post request that allows the user to submit new notes to the database in JSON format and runs the writeNotes function
app.post("/api/notes", function (req, res) {
    let note = req.body;

    let newNote = {
        title: note.title,
        text: note.text,
        id: uuidv4()
    }

    notesDatabase.push(newNote);

    writeNotes();

    res.json({ok: true});
});

// Allows user to delete notes from the database and webpage
app.delete("/api/notes/:id", function (req, res) {
    const findId = req.params.id;

    let deletedNote = notesDatabase.filter(deletedNote => {
        return deletedNote.id === findId;
    })[0];

    const idIndex = notesDatabase.indexOf(deletedNote);

    notesDatabase.splice(idIndex, 1);

    fs.writeFileSync("./db/db.json", JSON.stringify(notesDatabase), "utf8");

    res.json("");
    console.log(`Your note with id: ${idIndex} has been deleted!`);
});

// Routes for index.html and notes.html the * route must come last so as not to overwite the other routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join (__dirname + "/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Sets the application to be ready to listen for the active PORT
app.listen(PORT, () => console.log(`Application listening on PORT ${PORT}`));






