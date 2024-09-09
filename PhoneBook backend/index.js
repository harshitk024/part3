const express = require("express")

const app = express()


let persons = [

    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/",(request,response) => {
    response.send("<h1>Hello World</h1>")
})

app.get("/api/persons",(request,response) => {
    response.json(persons)
})

app.get("/api/info", (request, response) => {
  
  response.send(
    `<p> Phonebook has info for ${
      persons.length
    } people </p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id",(request,response) => {

  const id = request.params.id

  const person = persons.find((p) => p.id === id)

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }

})

app.delete("/api/persons/:id", (request, response) => {

  const id = request.params.id;

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();

});

const maxInt = (max) => {
    
  return Math.floor(Math.random() * max)
}

app.use(express.json())

app.post("/api/persons",(request,response) => {

  const person = request.body

  if(!person.name  || !person.number){
    response.statusMessage = "Person name or number is missing"
    response.status(400).end()
    return
  }

  const sameName = persons.find((p) => p.name ===  person.name)

  if(sameName){
    response.statusMessage = "Person name must be unique"
    response.status(400).end()
    return
  }

  person.id = String(maxInt(10000000))

  persons = persons.concat(person)

  response.json(person)
  
})


const PORT = 3001

app.listen(PORT,() => {
    console.log("Server running on PORT : ",PORT)
})