
const express=require('express')
const bodyParser=require('body-parser')
const db=require('./database.js')
const ejs=require('ejs')


const app=express()
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/html/login.html')
})
app.get('/register.html',function(req,res){
    res.sendFile(__dirname+'/public/html/register.html')
})


app.post("/register.html",function(req,res){
    var userName=req.body.userName
    var email=req.body.emailAddress
    var pWord=req.body.pWord
    var phoneNo=req.body.phoneNo
    var confirmpWord=req.body.confirmpWord

    if(pWord==confirmpWord)
    {
        console.log(userName)
        console.log(email)
        console.log(pWord)
        console.log(phoneNo)
        db.insertStudent(userName,pWord,email,phoneNo)
        res.redirect('/')
    }

})

app.post("/",function(req,res){
    var userName=req.body.userName
    var pWord=req.body.pWord
    console.log(userName+" "+pWord)
    db.getStudent(userName,pWord).then(user=>{
        
        if(user.rows.length != 0)
        {
            console.log(user)
            res.render('welcome',{Name:user.rows[0].FNAME,Phone:user.rows[0].PHONE,Email:user.rows[0].EMAIL})
        }
        else
        {      
            console.log("kesa hai ye alam")
        }
     

    })
    
   // res.render('home',{Name:user.rows[0].FNAME,Phone:user.rows[0].PHONE,Email:user.rows[0].EMAIL})
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at port 3000")
})
