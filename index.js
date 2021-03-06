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
var currSemID
fs.readFile(__dirname+'/currsem.txt', 'utf-8',function (err, data) {
    if (err) throw err;

currRunningSem=data
});
fs.readFile(__dirname+'/currsemid.txt', 'utf-8',function (err, data) {
    if (err) throw err;

currSemID=data
});


var student ={
   Name:"",
   Batch:0,
   ID:0,
   Address:"",
   Email:"",
   Instructor_Ins_ID:0,
   Allocated_Section:"",
   Pay:0,
   Ins_name:""
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
    
    
    var checked=req.body.checked
    for(var i=0;i<checked.length;i++)
    {
        db.insertCourseInStudent(checked[i],student.ID,'A',currSemID).then(user=>{
            console.log('successfulyy inserted course ')
        })
    }
    res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
})
app.post('/acceptassignedTA',function(req,res){
    console.log(req.body.checked.length)
    var checked=req.body.checked
    console.log("checked is " +checked)
    

    db.assignStudentAsTA(checked,instructor.Ins_ID,20000).then(user=>{
         
    })
    res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:instructor.Name,INS_ID:instructor.Ins_ID,ADDRESS:instructor.Address,START_DATE:instructor.Start_Date,EMAIL:instructor.Email})
    
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
app.get('/addInstructor',function(req,res){
    db.getTableData('Instructors').then(user=>{
        
        res.render('registerationforms',{tableTitle:"Instructors",RESULT:user})

    })
})
var tableChecker=false
app.get('/addintable',function(req,res){
    
        var Tables=['COURSES','DEPARTMENTS','INSTRUCTOR_TEACHES_COURSE','INSTRUCTORS','SECTIONS','SEMESTER','STUDENT',]
    res.render('addintable',{Tables:Tables,tableChecker:tableChecker})
      tableChecker=true
    
})
app.post('/addintable',function(req,res){
    if(tableChecker==true)
    {
        var table=req.body.tableSelector
        db.getTableData(table).then(user=>{
        
            res.render('registerationforms',{tableTitle:table,RESULT:user})
            tableChecker=false
    
        })

    }
})

app.post('/Semester',function(req,res){
    
})

app.post('/InsertIntoSEMESTER',function(req,res){
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
app.post('/InsertIntoCOURSES',function(req,res){
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
app.post('/InsertIntoDEPARTMENTS',function(req,res){
    var values={
         D_NAME:req.body.D_NAME,
         D_CODE:req.body.D_CODE,
        D_PHONE:req.body.D_PHONE,
         INSTRUCTORS_INS_ID:req.body.INSTRUCTORS_ID,
         START_DATE:req.body.START_DATE
    }
     db.insertTable(values,'DEPARTMENTS').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoINSTRUCTOR_TEACHES_COURSE',function(req,res){
    var values={
         INSTRUCTORS_INS_ID:req.body.INSTRUCTORS_INS_ID,
         COURSES_ID:req.body.COURSES_ID,
         SECTION_ID:req.body.SECTION_ID,
         SEMESTER_SEMESTER_ID:req.body.SEMESTER_SEMESTER_ID
    }
     db.insertTable(values,'INSTRUCTOR_TEACHES_COURSE').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoINSTRUCTORS',function(req,res){
    var values={
         NAME:req.body.NAME,
         INS_ID:req.body.INS_ID,
         START_DATE:req.body.START_DATE,
         SALARY:req.body.SALARY,
         ADDRESS:req.body.ADDRESS,
         EMAIL:req.body.EMAIL,
         DEPARTMENTS_D_CODE:req.body.DEPARTMENTS_D_CODE,
         DESIGNATION:req.body.DESIGNATION
    }
     db.insertTable(values,'INSTRUCTORS').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.get('/updatestudent',function(req,res){
    res.render('updatestudent.ejs')
})
app.post('/updatestudent',function(req,res){
    var email=req.body.email
    var address=req.body.Address
    student.Address=address
    student.Email=email
    console.log(email+address)
    db.updateStudent(student.ID,email,address).then(user=>{
        res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
    })
})
app.get('/updateteacher',function(req,res){
    res.render('updateteacher.ejs')
})
app.post('/updateteacher',function(req,res){
    var email=req.body.email
    var address=req.body.Address
    instructor.Address=address
    instructor.Email=email
    console.log(email+address)
    db.updateTeacher(student.ID,email,address).then(user=>{
        res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:instructor.Name,INS_ID:instructor.Ins_ID,ADDRESS:instructor.Address,START_DATE:instructor.Start_Date,EMAIL:instructor.Email})
    })
})
app.post('/InsertIntoSTUDENT',function(req,res){
    var values={
         NAME:req.body.NAME,
         BATCH:req.body.BATCH,
         ID:req.body.ID,
         ADDRESS:req.body.ADDRESS,
         EMAIL:req.body.EMAIL,
         INSTRUCTORS_INS_ID:req.body.INSTRUCTORS_INS_ID,
         PAY:req.body.PAY
    }
     db.insertTable(values,'STUDENT').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoSTUDENT_ALLOTTED_SECTIONS',function(req,res){
    var values={
         STUDENT_ID:req.body.STUDENT_ID,
         SECTIONS_ID:req.body.SECTIONS_ID,
         COURSES_ID:req.body.COURSES_ID,
         SEMESTER_SEMESTER_ID:req.body.SEMESTER_SEMESTER_ID
    }
     db.insertTable(values,'STUDENT_ALLOTTED_SECTIONS').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoSTUDENT_ENROLLED_IN_SEMESTER',function(req,res){
    var values={
         STUDENT_ID:req.body.STUDENT_ID,
         SEMESTER_SEMESTER_ID:req.body.SEMESTER_SEMESTER_ID,
         SGPA:req.body.SGPA,
         CRED_HRS:req.body.CRED_HRS
    }
     db.insertTable(values,'STUDENT_ENROLLED_IN_SEMESTER').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoSTUDENT_TAKES_COURSE',function(req,res){
    var values={
         STUDENT_ID:req.body.STUDENT_ID,
         COURSES_ID:req.body.COURSES_ID,
         GPA:req.body.GPA,
         MID1:req.body.MID1,
         MID2:req.body.MID2,
         FINAL:req.body.FINAL,
         ASS_QUIZZ:req.body.ASS_QUIZZ,
         SEMESTER_SEMESTER_ID:req.SEMESTER_SEMESTER_ID
    }
     db.insertTable(values,'STUDENT_TAKES_COURSE').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
app.post('/InsertIntoSECTIONS',function(req,res){
    var values={
         ID:req.body.ID,
         CR_NAME:req.body.CR_NAME,
    }
     db.insertTable(values,'SECTIONS').then(user=>{
    
         res.render('welcome',{isAdmin:true,isTeacher:false})

     })
})
var Checker=false
var sectionChecker=false
app.get('/addta',function(req,res){
  
    if(Checker==false)
    {
        db.getTeacherCourses(instructor.Ins_ID).then(user=>{
        
            
            res.render('addta',{Courses:user.CourseName,Checker:Checker,sectionChecker:sectionChecker})
            
            sectionChecker=true;
        })
    } 
})
app.get('/addmarks',function(req,res){
 
    if(Checker==false)
    {
        db.getTeacherCourses(instructor.Ins_ID).then(user=>{
        
            
            res.render('addgradeviewer',{Courses:user.CourseName,Checker:Checker,sectionChecker:sectionChecker})
            
            sectionChecker=true;
        })
    }   
})
var selectedCourse=""
var selectedSection=""
var userLength=0
app.post('/displaystudentlist',function(req,res){
    if(sectionChecker==true)
    {
        selectedCourse=req.body.courseSelector
        
        //console.log (selectedCourse)
            db.getCoursesWithSections(selectedCourse,instructor.Ins_ID).then(user=>{
                
                console.log(user)
                res.render('addta',{Courses:user.SECTION_ID,sectionChecker:sectionChecker,Checker:Checker})
                sectionChecker=false
                Checker=true
            })
    }
    else if(Checker==true){
        
        selectedSection=req.body.sectionSelector
        console.log(selectedCourse+' jello '+selectedSection)
        db.getNonTAStudents(selectedCourse,selectedSection).then(user=>{

            res.render('addta',{Courses:user,sectionChecker:sectionChecker,Checker:Checker})
            userLength=user.STUDENT_ID.length
            //res.render('b',{Courses:user})
            Checker=false
        })
         
    }
})
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
app.get('/viewtranscript',function(req,res){
    db.getStudentSemesters(student.ID).then(user=>{
        console.log('user is ')
        console.log(user)
        res.render('transcript',{Semester:user})
    })
})
app.post('/acceptinserttable',function(req,res){
   
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
            
            console.log(user)
            res.render('grades',{Semesters:user})
        })
    }
    else if(gradeChoiceChecker==2){
        var course=req.body.semesterSelector
        console.log(course)
       db.getStudentMarksinCourse(student.ID,course).then(user=>{
           console.log(user)
        res.render('viewgrades',{marks:user})
       })
        gradeChoiceChecker=0;
        
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
app.get('/welcomestudent',function(req,res){
    res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
})
app.get('/welcometeacher',function(req,res){
    res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:instructor.Name,INS_ID:instructor.Ins_ID,ADDRESS:instructor.Address,START_DATE:instructor.Start_Date,EMAIL:instructor.Email})
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
                console.log(student)
                var hamun=''
                var trig
                if(student.Instructor_Ins_ID==null)
                {

                }
                else
                {
                    db.getTeacher('yada',student.Instructor_Ins_ID).then(user=>{
                        console.log("fivvvvvver" +(user.rows[0].NAME))
                        student.Ins_name=user.rows[0].NAME
                        console.log('asuayfuasyf asuaysfua sifua ' +student.Ins_name)
                        hamun=user.rows[0].NAME
                        console.log("asdasudyaiusyda " +hamun)
                        //trig=user
                        console.log(trig)
                        student.Instructor_Ins_ID=toString(student.Instructor_Ins_ID)
                        student.Instructor_Ins_ID=user.rows[0].NAME
                        
                    })
                }
               
                console.log(typeof(student.Instructor_Ins_ID))
                var str=""
                str=student.Instructor_Ins_ID
                str=toString(str)
                hamun=toString(hamun)
                console.log(typeof(hamun))
                console.log(typeof(str))
               // console.log("hamun" + trig.rows[0].NAME)

                res.render('welcome',{isAdmin:false,isTeacher:isTeacher,NAME:student.Name,BATCH:student.Batch,EMAIL:student.Email,ADDRESS:student.Address,ID:student.ID,INSTRUCTORS_ID:student.Instructor_Ins_ID,ALLOCATEDSECTION:student.Allocated_Section,PAY:student.Pay})
            }
            else
            {      
               
            }
        })
    }
   // res.render('home',{Name:user.rows[0].FNAME,Phone:user.rows[0].PHONE,Email:user.rows[0].EMAIL})
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running at port 3000")
})
