const express = require('express')
const PORT = process.env.PORT || 3001
const app = express()
const { animals } = require('./:data/animals.json')
const fs = require('fs')
const path = require('path')

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }))
//parse incoming JSON data
app.use(express.json())

//makes the public files accesible - middleware
app.use(express.static('public'))

//create query parameters
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = []
    let filteredResults = animalsArray

    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits]
        } else {
            personalityTraitsArray = query.personalityTraits
        }
        //loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            )
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet)
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    //returns the filtered results
    return filteredResults
}

//function to filter animal array to return a single aninmal based on id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result
}

function createNewAnimal(body, animalsArray) {
    console.log(body)
    const animal = body
    //add new animal to animalsArray
    animalsArray.push(animal)
    //write to animals.json
    fs.writeFileSync(
        path.join(__dirname, './:data/animals.json'),
        //make the data into JSON - null means don't edit exisiting data - 2 means to leave 2 blank spaces between data sets
        JSON.stringify({ animals: animalsArray }, null, 2)
    )

    //return finished code to post route for response
    return animal
}

//validate each key from req.body
function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false
    }
    return true
}

//get info from server
app.get('/api/animals', (req, res) => {
    let results = animals
    if (req.query) {
        results = filterByQuery(req.query, results)
    }
    res.json(results)
})

//param route must come after the other GET route above
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals)
    if (result) {
        res.json(result)
    } else {
        res.send(404)
    }
    
})

//POST to store data from client on server
app.post('/api/animals', (req,res) => {
    //req.body is where our incoming content will be
    console.log(req.body)
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString()

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        //relay a message to the client
        res.status(400).send('The animal is not properly formatted.')
    } else {
    //add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals)
    res.json(animal)}
})

//getting index.html to be served from express
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

//get animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'))
})

//get zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'))
})

//wildcard route to send users back to index.html - should ALWAYS be LAST
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

//stays at the end
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`)
})