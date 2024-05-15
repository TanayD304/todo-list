const express = require("express");
const bodyParser = require("body-parser");
const { title } = require("process");

const app = express();

app.use(bodyParser.json());

// TODO: Save the data in file type like a database
// TODO: Can add priority wise sorting
// TODO: can add date as well
let todos = []

const found = (id, arr) => {
    for(let i=0;i<arr.length;i++) {
        if(arr[i]["id"]==id) return i;
    }
    return -1;
}

const idGeneration = (arr) => {
    let id = Math.floor(Math.random()*1000000)

    if(found(id, arr)==-1) return id;
    else idGeneration(arr)
}

app.get('/todos', (req, res) => {
    res.status(200).json({todos})
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id
    let todo = {}
    for(let i=0;i<todos.length;i++) {
        if(todos[i]['id']==id) {
            todo = todos[i];
            break
        }
    }

    if(Object.keys(todo).length==0) {
        res.status(404).json({
            msg:"Todo not found"
        })
    } else {
        res.status(200).json({todo})
    }
})

app.post('/todos', (req, res) => {
    let idTodo = idGeneration(todos)
    let newTodo = {
        id:idTodo,
        title:req.body.title,
        completed:req.body.completed,
        description:req.body.description
    }

    todos.push(newTodo)
    res.status(201).json({
        id:idTodo
    })
})

app.put('/todos/:id', (req, res) => {
    let id = req.params.id
    let isFound = found(id, todos)
    if(isFound==-1) {
        res.status(404).json({
            msg: "Todo not found",
        });
    } else {
        todos[isFound]["title"] = req.body.title
        todos[isFound]["completed"] = req.body.completed
        todos[isFound]['description'] = req.body.description

        res.status(200).json({
            msg:"done"
        })
    }
})

app.delete("/todos/:id", (req, res) => {
    let id = req.params.id;
    let isFound = found(id, todos);
    if (isFound == -1) {
        res.status(404).json({
            msg: "Todo not found",
        });
    } else {
        todos.splice(isFound, 1)
        res.status(200).json({
            msg: "done",
        });
    }
})

app.listen(3000)