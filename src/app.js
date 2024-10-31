const express = require ('express');


const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth.js");

//Handle Auth Middleware for all requests GET, POST....
app.use("/admin", adminAuth);

app.get("/user", userAuth, (req,res) => {
    res.send("User data sent!");
});

app.get("/admin/getAllData", (req, res) => {
    //Logic to check if the request is authorizes
      res.send("All the Data was sent");
     
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Deleted the user data");
});


app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777..");

});

