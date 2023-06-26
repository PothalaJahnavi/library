// acquiring modules
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const ejs=require("ejs");
const prompt = require('prompt');
var readline = require('readline-sync');
const {check,validationResult}=require("express-validator");
const app=express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// connecting to database
const CONNECTION_URL="mongodb+srv://admin:admin@cluster0.kkcut4i.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(CONNECTION_URL , { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("database Connected")
  }).catch((err)=>{
    console.log(err)
  })
// creating a scheme for our database
const bookSchema={
   title:String,
   author:String,
   copies:Number,
   total:Number,
   matter:String,
   imgurl:String
};
const resourceSchema={
    refTitle:String,
    refVideo:String,
    refDoc:String
};

//schema for login details
const login={
    email:"admin@gmail.com",
    password:"12345"
}
// use schema as model
const Book=mongoose.model("Book",bookSchema);
const Resource=mongoose.model("Resource",resourceSchema);

//for dashboard
app.get("/",(req,res)=>{
    res.render("dashboard");
})
//for about section
app.get("/about",(req,res)=>{
    res.render("about");
});
//for admin login
app.get("/admin",(req,res)=>{
    res.render("admin");
});
app.get("/type",(req,res)=>{
    res.render("type");
})
app.post("/login",(req,res)=>{
    if(req.body.checkuser===login.email&&req.body.checkpassword===login.password)
    {
       res.redirect("/type");
    }
    else{
       res.send("error!please check ypur admin credentials");
    }
});
app.get("/booklist",(req,res)=>{
    Book.find({},(err,books)=>{
        res.render("booklist",{books:books});
    });
});
app.get("/compose",(req,res)=>{
    res.render("compose");
});
app.post("/compose",(req,res)=>{
    var book=new Book({
        title:req.body.postTitle,
        author:req.body.postAuthor,
        total:req.body.postCopies,
        copies:req.body.postCopies,
        matter:req.body.postMatter,
        imgurl:req.body.postUrl
    });
    book.save(function(err){
        if(!err)
        res.redirect("/booklist");
    });
});
app.get("/booklist/:id",(req,res)=>{
    const reqid=req.params.id;
    Book.findOne({_id:reqid},function(err,book){
        res.render("book",{
            mytitle:book.title,
            myauthor:book.author,
            mycopies:book.copies,
            mymatter:book.matter,
            myimgurl:book.imgurl
          });
    });
});
app.get("/references",(req,res)=>{
    Resource.find({},(err,resources)=>{
        res.render("references",{resources:resources});
    });
});
app.get("/composeref",(req,res)=>{
    res.render("composeref");
});
app.post("/composeref",(req,res)=>{
    var resource=new Resource({
        refTitle:req.body.resTitle,
        refVideo:req.body.resVideo,
        refDoc:req.body.resDoc
    });
    resource.save(function(err){
        if(!err)
        res.redirect("/references");
    });
});
// for Update booklist
app.get("/update",(req,res)=>{
    Book.find({},(err,books)=>{
        res.render("update",{books:books});
    });
});
app.get("/update/:id",(req,res)=>{
    var x=req.params.id;
    var flag=-1;
    Book.findOneAndUpdate({_id:x},{$inc:{copies:flag}},{new:true},(err,doc)=>{
        if(err)
        {
            console.log(err);
        }
    });
    res.redirect("/update");
});
app.get("/update1/:id",(req,res)=>{
    var x=req.params.id;
    var flag=1;
    Book.findOneAndUpdate({_id:x},{$inc:{copies:flag}},{new:true},(err,doc)=>{
        if(err)
        {
            console.log(err);
        }
    });
    res.redirect("/update");
})




const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`this app is running on port ${port}`);
});

//https://library-management-system-pro.herokuapp.com/