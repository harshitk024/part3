import { useState,useEffect} from 'react'


import "./App.css"

import phoneService from "./services/phonebook"

const Filter = ({value,onChange}) => {


    console.log(value);
    
    return(
      <>
      <div>
         filter shown with <input value = {value} onChange={onChange}></input>
      </div>
      </>
    )
      
}

const Notification = ({message,errorMessage}) => {
   
   if(message == null){
     return null
   }

   return (
    <div className={ errorMessage ? 'error-message':'message'}>
        {message}
    </div>
   )
}

const Persons = ({persons, handleDelete}) => {
  
  return (
    <>
    {persons.map((person) => <p className = "note" key = {person.name}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></p>)}
    </>
  )
}

const PersonForm = ({handleSubmit,newName,newNumber,handleNameChange,handleNumberChange}) => {
  return(
    <div>
      <form onSubmit = {handleSubmit}>
        <div>
          <div>name: <input value = {newName} onChange={handleNameChange}/></div>
          <div>number: <input  value = {newNumber} onChange={handleNumberChange}/></div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])

  console.log(persons);
  
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [showAll,setshowAll] = useState(true)
  const [message,setMessage] = useState(null)
  const [errorMessage,setErrorMessage] = useState(false)

  const [filter,setfilter] = useState("")

  const show = showAll 
               ? persons 
               : persons.filter((p)=> p.name.toUpperCase().includes(filter.toUpperCase())) 

  const handleFilter = (event) => {
     setfilter(event.target.value)
     setshowAll(false)
     console.log(showAll)     
  }

  const handleNameChange  = (event) => {
       setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDelete = (id) => {

    if(window.confirm(`delete ${persons.find((p) => p.id == id).name}?`)){

    console.log("deleted");
    

     phoneService.remove(id)
                 .then((response) => {
                  const newPerson = persons.filter((p) => p.id !== id)
                  setPersons(newPerson)
                  
                 }).catch((error) => {
                  console.log(error);
                  
                 })
    }
  }



  useEffect((() => {
    
    phoneService.getAll()
         .then((response) => {
          setPersons(response)
         })
  }),[])

  const handleSubmit = (event) => {

      event.preventDefault()

      const find = persons.find((p) => p.name == newName)

      const newPerson = {
        name : newName,
        number : newNumber,
     }


      if(find !== undefined){
        
        if(window.confirm(`${find.name} is already added to Phonebook, replace the old number with the new one?`)){
           phoneService.update(find.id,newPerson)
                       .then(response => {
                         setPersons(persons.map((p) => p.id !== find.id ? p : response))
                       }).catch((error) => {
                          setMessage(`Information of ${newName} has already been removed from server`)
                          setErrorMessage(true)
                          setTimeout(()=> {
                            setMessage(null)
                          },3000)
                          setPersons(persons.filter((p) => p.id !== find.id))
                       })
        }

      } else {



      phoneService.create(newPerson)
           .then((response) => {
            setPersons(persons.concat(response))
            setNewName("")
            setNewNumber("")

            setMessage(
              `Added ${newName}`
            )

            setTimeout(()=> {
              setMessage(null)
            },5000)

            })

     }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} errorMessage={errorMessage}/>
      <Filter value = {filter} onChange = {handleFilter} />
      <h2>add a new </h2>
      <PersonForm handleSubmit={handleSubmit} handleNameChange = {handleNameChange} newName={newName} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons = {show} handleDelete={handleDelete} />
      </div>
  )
}


export default App