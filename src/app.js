const express = require ('express');


const app = express();

//This will only handle GET call to /user
app.get("/user", (req, res) => {
    res.send({firstName: "Likhith", lastName: "Palasala"});
});


app.post("/user", (req, res) => {
    //console.log("Save data to the database");
    res.send("Data successfully saved to the database");
});

app.delete("/user", (req, res) => {
    res.send("User info deleted successfully!");
});


//This will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
    res.send("Hello from the server!");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777..");

});

