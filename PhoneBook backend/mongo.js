const mongoose = require("mongoose")


if(process.argv < 3){
    console.log("Provide password");
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://warrior:${password}@dbpractice.po8g8.mongodb.net/Persons?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})

const Person = mongoose.model("Person",personSchema)

if (process.argv.length < 4) {

    Person.find({}).then(result => {
        console.log("phonebook: ");
        result.forEach(person => {
            console.log(`${person.name} ${person.phone}`);
        })
        mongoose.connection.close()
        
    })
    
 
} else {

    const name = process.argv[3];
    const phone = process.argv[4];
  
    const person = new Person({
      name: name,
      phone: phone,
    });
  
    person.save().then((result) => {
      console.log(`added ${name} number ${phone} to phonebook`);
      mongoose.connection.close();
    });  

}
