require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Person = require("./models/person")

const app = express()

app.use(cors())
app.use(express.static("dist"))


app.get("/",(request,response) => {
    response.send("<h1>Hello World</h1>")
})

app.get("/api/persons",(request,response) => {
    
  Person.find({}).then(persons => {
      response.json(persons)
  })

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
  
  console.log(id)

  Person.findById(id).then(person => {

    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }

  })



})

app.delete("/api/persons/:id", (request, response) => {

  const id = request.params.id;

  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();

});



app.use(express.json())

app.post("/api/persons",(request,response) => {

  const person = request.body

  if(!person.name  || !person.number){
    response.statusMessage = "Person name or number is missing"
    response.status(400).end()
    return
  }


  const newPerson = new Person({
       name: person.name,
       phone: person.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
  
})


const PORT = process.env.PORT || 3001

app.listen(PORT,() => {
    console.log("Server running on PORT : ",PORT)
})


