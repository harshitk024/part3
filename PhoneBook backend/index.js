require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/info", (request, response) => {
  Person.collection.countDocuments().then((result) => {
    response.send(
      `<p> Phonebook has info for ${result} people </p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  console.log(id);

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  console.log(body);

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("This is the error");
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(express.json());

app.post("/api/persons", (request, response,next) => {
  const person = request.body;

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  });

  console.log(newPerson);

  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

// Should be the last loaded middleware
app.use(errorHandler);
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Server running on PORT : ", PORT);
});
