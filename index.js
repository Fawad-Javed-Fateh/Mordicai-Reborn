const fs=require('fs')
const express=require('express')
const bodyParser=require('body-parser')
const db=require('./database.js')
const ejs=require('ejs')
const res = require('express/lib/response')
const linkVarCatcher=('./buttonchanges.js')


const app=express()
app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

var userName
var gradeChoiceChecker=0;
var isTeacher;
var currRunningSem=''
fs.readFile(__dirname+'/currsem.txt', 'utf-8',function (err, data) {
    if (err) throw err;

currRunningSem=data
});
console.log(currRunningSem)

var student ={
   Name:"",
   Batch:0,
   ID:0,
   Address:"",
   Email:"",
   Instructor_Ins_ID:0,
   Allocated_Section:"",
   Pay:0
}
var instructor={
    Name:"",
    Ins_ID:0,
    Start_Date:"",
    Salary:0,
    Address:"",
    Email:"",
    Departments_D_Code:0,
    Designation:""
}

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
app.get('/ChooseCourses',function(req,res){
    db.coursesInGivenSem(currRunningSem,student.ID).then(user=>{
        res.render('studentchoosecourse',{currSem:currRunningSem,Courses:user})    
    })
    
})
app.post('/acceptinsertstudentcourse',function(req,res){
    
    console.log(req.body.checked.length)
    var checked=req.body.checked
    for(var i=0;i<checked.length;i++)
    {
        db.insertCourseInStudent(checked[i],student.ID,'A').then(user=>{
            console.log('successfulyy inserted course ')
        })
    }
    res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
})

app.get('/viewcourses',function(req,res){
    db.getTeacherCourses(instructor.Ins_ID).then(user=>{
        console.log(user)
        res.render('viewcourses',{RESULT:user})            
    })
    
})
app.get('/addSemester',function(req,res){

    db.getTableData('Semester').then(user=>{
        
        res.render('registerationforms',{tableTitle:"Semester",RESULT:user})

    })
    
})
app.get('/addCourse',function(req,res){
    db.getTableData('courses').then(user=>{
        
        res.render('registerationforms',{tableTitle:"Courses",RESULT:user})

    })
})

app.post('/Semester',function(req,res){
    console.log('machu')
})

app.post('/InsertIntoSemester',function(req,res){
        var values={
             DURATION:req.body.DURATION,
             NAME:req.body.NAME,
             START_DATE:req.body.START_DATE,
             SEMESTER_ID:req.body.SEMESTER_ID
        }
        db.insertTable(values,'Semester').then(user=>{
        
            res.render('welcome',{isAdmin:true,isTeacher:false})
    
        })
})
app.post('/InsertIntoCourses',function(req,res){
    var values={
         ID:req.body.ID,
         CREDIT_HOURS:req.body.CREDIT_HOURS,
         NAME:req.body.NAME,
         DEPARTMENTS_D_CODE:req.body.DEPARTMENTS_D_CODE,
         SEMESTER_SEMESTER_ID:req.body.SEMESTER_SEMESTER_ID
    }
     db.insertTable(values,'Courses').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
var Checker=false
var sectionChecker=false
app.get('/addmarks',function(req,res){
 
    if(Checker==false)
    {
        db.getTeacherCourses(instructor.Ins_ID).then(user=>{
        
            console.log('sdsadas')
            console.log(user)
            res.render('addgradeviewer',{Courses:user.CourseName,Checker:Checker,sectionChecker:sectionChecker})
            
            sectionChecker=true;
        })
    }   
})
var selectedCourse=""
var selectedSection=""
var userLength=0
app.post('/displaygradingtable',function(req,res){

    if(sectionChecker==true)
    {
        selectedCourse=req.body.courseSelector
        console.log('yoloolo')
        //console.log (selectedCourse)
            db.getCoursesWithSections(selectedCourse,instructor.Ins_ID).then(user=>{
                
                console.log(user)
                res.render('addgradeviewer',{Courses:user.SECTION_ID,sectionChecker:sectionChecker,Checker:Checker})
                sectionChecker=false
                Checker=true
            })
    }
    else if(Checker==true){
        
        selectedSection=req.body.sectionSelector
        console.log(selectedCourse+' jello '+selectedSection)
        db.sectionsStudentRetreival(selectedCourse,selectedSection).then(user=>{

            res.render('addgradeviewer',{Courses:user,sectionChecker:sectionChecker,Checker:Checker})
            userLength=user.STUDENT_ID.length
            //res.render('b',{Courses:user})
            Checker=false
        })
        // db.getTeacherCourses(instructor.Ins_ID).then(user=>{
        
        //     selectedSection=req.body.courseSelector
        //     console.log('sdsadas')
        //     console.log(user)
        //     res.render('addgradeviewer',{Courses:user.CourseName,sectionChecker:sectionChecker,Checker:Checker})
        //     Checker=false
        // })
    }
  
})
app.post('/acceptinserttable',function(req,res){
    console.log('maa keesdsdsd')
    db.insertGradesInTable(req.body,selectedCourse,selectedSection).then(user=>{
        console.log('prehaps this worked')
        res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:instructor.Name,INS_ID:instructor.Ins_ID,ADDRESS:instructor.Address,START_DATE:instructor.Start_Date,EMAIL:instructor.Email})
        
    })
})
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
        db.getStudentEnrolledCourses(student.ID).then(user=>{
            res.render('grades',{Semesters:user})
        })
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
     isTeacher=req.body.teacherCheckBox
    console.log(userName+" "+pWord)
    console.log(typeof(pWord))

    if(userName=='Admin' && pWord==666)
    {
        res.render('welcome',{isAdmin:true,isTeacher:false})
    }
    if(isTeacher)
    {
            
        db.getTeacher(isTeacher,pWord).then(user=>{
        
            if(user.rows.length != 0)
            {
                console.log(user)
                instructor.Ins_ID=user.rows[0].INS_ID
                instructor.Address=user.rows[0].ADDRESS
                instructor.Departments_D_Code=user.rows[0].DEPARTMENTS_D_CODE
                instructor.Designation=user.rows[0].DESIGNATION
                instructor.Email=user.rows[0].EMAIL
                instructor.Salary=user.rows[0].SALARY
                instructor.Name=user.rows[0].NAME
                instructor.Start_Date=user.rows[0].START_DATE
                res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:instructor.Name,INS_ID:instructor.Ins_ID,ADDRESS:instructor.Address,START_DATE:instructor.Start_Date,EMAIL:instructor.Email})
                //res.render('welcome',{isTeacher:isTeacher,NAME:user.rows[0].NAME,BATCH:user.rows[0].BATCH,EMAIL:user.rows[0].EMAIL,ADDRESS:user.rows[0].ADDRESS,ID:user.rows[0].ID,INSTRUCTORS_ID:user.rows[0].INSTRUCTORS_INS_ID,ALLOCATEDSECTION:user.rows[0].SECTIONS_ID,PAY:user.rows[0].PAY})
            }
            else
            {      
                console.log("kesa hai ye alam")
            }
         
    
        })
    }
    else{
        console.log("Not a teacher")
        db.studentGetter(userName,pWord).then(user=>{
            if(user.rows.length != 0)
            {
                console.log(user)
                student.Name=user.rows[0].NAME
                student.Batch=user.rows[0].BATCH
                student.Email=user.rows[0].EMAIL
                student.ID=user.rows[0].ID
                student.Allocated_Section=user.rows[0].SECTIONS_ID
                student.Instructor_Ins_ID=user.rows[0].INSTRUCTORS_INS_ID
                student.Pay=user.rows[0].PAY
                student.Address=user.rows[0].ADDRESS

                res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
            }
            else
            {      
                console.log("kesa hai ye alam")
            }
        })
    }
   // res.render('home',{Name:user.rows[0].FNAME,Phone:user.rows[0].PHONE,Email:user.rows[0].EMAIL})
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at port 3000")
})
