const express = require ('express');


const app = express();

//This will only handle GET call to /user
app.use("/user", [
    (req, res, next) => {
    //Route Handler 1
    console.log("Handling the route user!");
    next();
},

(req, res)=> {
    //Route Handler 2
    console.log("Handling the route user 2!");
    res.send("2nd Response!")

},

(req, res)=> {
    //Route Handler 3
    console.log("Handling the route user 3!");
    res.send("3rd Response!")
},

(req, res)=> {
    //Route Handler 4
    console.log("Handling the route user 4!");
    res.send("4th Response!");
}
]);

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777..");

});

