
const express=require('express')
const bodyParser=require('body-parser')
const db=require('./database.js')
const ejs=require('ejs')
const linkVarCatcher=('./buttonchanges.js')


const app=express()
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

var userName
var gradeChoiceChecker=0;

app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/html/login.html')
})
app.get('/register.html',function(req,res){
    res.sendFile(__dirname+'/public/html/register.html')
})

app.get('/grades',function(req,res)
{
    var semesters=['Fall 2021','Spring 2021','Summer 2021']
    res.render('grades',{Semesters:semesters})
})
app.get('/home',function(req,res)
{

})
app.get('/grades')
app.get('/attendence',function(req,res)
{
    var marks={
        mid1:7,
        mid2:8,
        finals:55
    }
    res.render('viewgrades',{marks:marks})
})
app.get('/contactteacher',function(req,res){
    res.render('contactteacher')
})

app.post("/grades",function(req,res){
    gradeChoiceChecker++;
    if(gradeChoiceChecker==1)
    {
        var semester=req.body.semesterSelector
        console.log(semester)
        console.log(semester)
        var semesters=['Fall 2021','Spring 2021','Summer 2021']
        var courses=['PF','AP','CAL']
        res.render('grades',{Semesters:courses})
    }
    else if(gradeChoiceChecker==2){
        var course=req.body.semesterSelector
        console.log(course)
        var marks={
            mid1:7,
            mid2:8,
            finals:55
        }
        gradeChoiceChecker=0;
        res.render('viewgrades',{marks:marks})
    }

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
    userName=req.body.userName
    var pWord=req.body.pWord
    console.log(userName+" "+pWord)
    console.log(typeof(pWord))
    db.getStudent(userName,pWord).then(user=>{
        
        if(user.rows.length != 0)
        {
            console.log(user)
            res.render('welcome',{NAME:user.rows[0].NAME,BATCH:user.rows[0].BATCH,EMAIL:user.rows[0].EMAIL,ADDRESS:user.rows[0].ADDRESS,ID:user.rows[0].ID,INSTRUCTORS_ID:user.rows[0].INSTRUCTORS_INS_ID,ALLOCATEDSECTION:user.rows[0].SECTIONS_ID,PAY:user.rows[0].PAY})
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
