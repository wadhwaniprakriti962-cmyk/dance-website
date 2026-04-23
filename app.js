const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyparser=require('body-parser')
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/contact');
const port = 8000;

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    address:String,
    desc:String,
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);


app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded({extended:true}))

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')) // Set the views directory
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const params={}
    res.status(200).render("home.pug",params);
})
app.get('/contact', (req, res)=>{
    const params={}
    res.status(200).render("contact.pug",params);
})
app.post('/contact', (req, res)=>{
    var myData=new Contact(req.body);
    if (!req.body.name || !req.body.email || !req.body.phone || !req.body.address || !req.body.desc) {
    return res.render('contact.pug', { message: "All fields are required" });
}
    myData.save()
    .then(()=>{
        res.render('contact.pug', { message: "Thank you! We will contact you soon." })
    })
    .catch(()=>{
            res.status(400).send("Items not saved to the database")
        })
    }
    )
//    res.status(200).render("contact.pug");



// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});