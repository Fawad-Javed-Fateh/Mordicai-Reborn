
const oracledb = require('oracledb');
const namer=require('./tableName.js')

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;



async function getStudent(userName,pWord) {
  console.log("chudmaa " + pWord)
  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "Mordicai",
      password      : 'fast123',
      connectString : "localhost:1521/xe"
    });

    const result = await connection.execute(
      `select * from student where  id = :1  `
       ,[pWord],  // bind value for :id
    );
   // console.log(result);
   console.log("chudmaa " + pWord)
   console.log('result is = '+ result.rows)
    return result
   

  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}
async function insertStudent(userName,pWord,email,phone) {

    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
  
      const result = await connection.execute(
        `INSERT INTO STUDENTS VALUES(:1,:2,:3,:4)  `
         ,[userName,pWord,phone,email],  // bind value for :id
            {autoCommit:true}
         );
      console.log("Successfully inserted into database");
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function getTeacher(userName,pWord) {

    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
  
      const result = await connection.execute(
        `Select * from instructors where  ins_id= :1  `
         ,[pWord],  // bind value for :id
            {autoCommit:true}
         );
         console.log('result is = '+ result.rows)
         return result
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function studentGetter(userName,pWord) {

    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
  
      const result = await connection.execute(
        `Select * from student where  ID = :1  `
         ,[pWord],  // bind value for :id
            {autoCommit:true}
         );
         console.log("Maa kee CHUUUUUU")
         console.log(result)
         
         return result
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function getTeacherCourses(instructorID) {
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
  
      const result = await connection.execute(
        `Select section_id,courses_id from teaches where  Instructors_Ins_ID = :1  `
         ,[instructorID],  // bind value for :id
            {autoCommit:true}
         );
         var queryReuslt={
           CourseName:[],
           Section:[],
           CourseID:[],
           Departments_D_CODE:[],
           CreditHours:[],
          
         }
         for(var i=0;i<result.rows.length;i++)
         {
              queryReuslt.CourseID.push(result.rows[i].COURSES_ID)
              queryReuslt.Section.push(result.rows[i].SECTION_ID)
         }
         for(var i=0;i<result.rows.length;i++)
         {
          course=queryReuslt.CourseID[i]
          const result3 = await connection.execute(
            `Select credit_hours,Name,DEPARTMENTS_D_CODE from courses where ID = :1  `
             ,[course],  // bind value for :id
                {autoCommit:true}
             );
             queryReuslt.CreditHours.push(result3.rows[0].CREDIT_HOURS)
             queryReuslt.CourseName.push(result3.rows[0].NAME)
             queryReuslt.Departments_D_CODE.push(result3.rows[0].DEPARTMENTS_D_CODE)
         }
         return queryReuslt
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function getTableData(tableName) {
    console.log("chudmaa " + tableName)
    tableName=namer.simpleSqlName(tableName)
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
  
      const result = await connection.execute(
        `select * from  `+ tableName
        ,  // bind value for :id
      );
     // console.log(result);
     var queryResult={names:[]};
     for(var i=0;i<result.metaData.length;i++)
     {
          queryResult.names.push((result.metaData[i].name))
     }
     console.log(queryResult.names.length)
     return queryResult
    
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function insertTable(values,tableName) {
    
    let connection;
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
    if(tableName=='Semester')
    {
      const result = await connection.execute(
        `insert into  Semester values (:1,:2,TO_DATE(:3),:4) `  
       ,[values.DURATION,values.NAME,values.START_DATE,values.SEMESTER_ID],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }
    if(tableName=='Courses')
    {
      const result = await connection.execute(
        `insert into  courses values (:1,:2,:3,:4,:5) `  
       ,[values.ID,values.CREDIT_HOURS,values.NAME,values.DEPARTMENTS_D_CODE,values.SEMESTER_SEMESTER_ID],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }    
    if(tableName=='Instructors')
    {
      const result = await connection.execute(
        `insert into  instructors values (:1,:2,:3,:4,:5,:6,:7,:8) `  
       ,[values.NAME,values.INS_ID,values.START_DATE,values.SALARY,values.ADDRESS,values.EMAIL,values.DEPARTMENTS_D_CODE,values.DESIGNATION],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     return result
    }    
    if(tableName=='SECTIONS')
    {
      const result = await connection.execute(
        `insert into  sections values (:1,:2,:3) `  
       ,[values.ID,values.CR_NAME,values.COURSES_ID],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }   
    if(tableName=='STUDENT')
    {
      const result = await connection.execute(
        `insert into  student values (:1,:2,:3,:4,:5,:6,:7) `  
       ,[values.NAME,values.BATCH,values.ID,values.ADDRESS,values.EMAIL,values.INSTRUCTOS_INS_ID,values.PAY],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }     
    if(tableName=='TAKES')
    {
      const result = await connection.execute(
        `insert into  TAKES values (:1,:2,:3,:4,:5,:6,:7,:8) `  
       ,[values.STUDENT_ID,values.COURSES_ID,values.GPA,values.MID1,values.MID2,values.FINAL,values.ASS_QUIZZ,values.SECTIONS_ID],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }    
    if(tableName=='TEACHES')
    {
      const result = await connection.execute(
        `insert into  TEACHES values (:1,:2,:3,:4,:5) `  
       ,[values.INSTRUCTOS_INS_ID,values.COURSES_ID,values.SECTION_ID],
       {autoCommit:true}  // bind value for :id
      );
     // console.log(result);
     
     return result
    }    

    
     
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  async function getCoursesWithSections(name,ins_id) {
    
    let connection;
    var queryResult={
      SECTION_ID:[]
    }
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      // const result = await connection.execute(
      //   `select id from courses where name like  :1 `  
      //  ,[name],
      //  {autoCommit:true}  // bind value for :id
      // );
     // var temp=result.rows[0].ID
      const res = await connection.execute(
        `select t.section_id from teaches t,courses c where c.id=t.courses_id and c.name=:1 and t.instructors_ins_id =:2 `  
       ,[name,ins_id],
       {autoCommit:true}  // bind value for :id
      );
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.SECTION_ID.push(res.rows[i].SECTION_ID)
      }
      
      console.log(queryResult)
     
     return queryResult
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
 

  async function sectionsStudentRetreival(name,section_id) {
    
    let connection;
    var queryResult={
      STUDENT_ID:[],
      ASS_QUIZZ:[],
      MID_1:[],
      MID_2:[],
      FINAL:[],
      GPA:[]
    }
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      // const result = await connection.execute(
      //   `select id from courses where name like  :1 `  
      //  ,[name],
      //  {autoCommit:true}  // bind value for :id
      // );
      // var temp=result.rows[0].ID
      const res = await connection.execute(
        `select t.student_id,t.ASS_QUIZZ,t.mid1,t.mid2,t.final,t.gpa from takes t,courses c where c.id=t.courses_id and c.name LIKE :1 and t.sections_id LIKE :2 `  
       ,[name,section_id],
       {autoCommit:true}  // bind value for :id
      );
      console.log(res)
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.STUDENT_ID.push(res.rows[i].STUDENT_ID)
        queryResult.ASS_QUIZZ.push(res.rows[i].ASS_QUIZZ)
        queryResult.MID_1.push(res.rows[i].MID1)
        queryResult.MID_2.push(res.rows[i].MID2)
        queryResult.FINAL.push(res.rows[i].FINAL)
        queryResult.GPA.push(res.rows[i].GPA)
      }
      
      console.log(queryResult)
     
     return queryResult
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function insertGradesInTable(enteries,selectedCourse,selectedSection) {
    console.log('wimppppp')
  enteries=typeConverter(enteries)
  console.log(enteries.MID_1[0])
    console.log(enteries)
    console.log(selectedCourse)
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      var res=await connection.execute(
        'select id from courses where name like :1'
        ,{1:selectedCourse},
      )
      console.log('asdas' + res.rows[0].ID)
      var course_ID=res.rows[0].ID
      
       for(var i=0;i<enteries.STUDENT_ID.length;i++)
       {
        var mid1=enteries.MID_1[i]
        var mid2=enteries.MID_2[i]
        var studentId=enteries.STUDENT_ID[i]
        var final=enteries.FINAL[i]
        var ass_quizz=enteries.ASS_QUIZZ[i]
        var gpa=enteries.SGPA[i]
         var result = await connection.execute(
          //  `update takes set MID1=:2,MID2=:3,ASS_QUIZZ=:4,FINAL=:5,GPA=:6 where STUDENT_ID=:7 and COURSES_ID=:8 and SECTIONS_ID=:9 `  
          // ,{2:enteries.MID_1[i],3:enteries.MID_2[i],4:enteries.ASS_QUIZZ[i],5:enteries.FINAL[i],6:enteries.GPA[i],7:enteries.STUDENT_ID[i],8:course_ID,9:selectedSection },
          // {autoCommit:true}  // bind value for :id
           
          'update  takes set MID1=:1,MID2=:2,final=:4,gpa=:5,ass_quizz=:6  where student_id=:3 and courses_id=:7 and sections_id=:8'
          ,[mid1,mid2,final,gpa,ass_quizz,studentId,course_ID,selectedSection],{autoCommit:true}
         );
       } 
      
      console.log(result)
     return 
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function getStudentEnrolledCourses(std_id) {
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      var res=await connection.execute(
        'select c.name from courses c,takes t where t.courses_id=c.id and t.student_id =:1'
        ,{1:std_id},
      )
      var queryResult=[]
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.push(res.rows[0].NAME)
      }
      console.log(queryResult)
      return queryResult
     return 
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function coursesInGivenSem(sem_name,studentID) {
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      var res=await connection.execute(
        'select * from courses c,departments d,semester s  where  c.semester_semester_id=s.semester_id and d.d_code=c.departments_d_code and s.name =:1 and c.id not in  (select courses_id from takes where student_id=:2)'
        ,{1:sem_name,2:studentID},
      )
      var queryResult={
        C_NAME:[],
        C_ID:[],
        D_NAME:[],
        CREDIT_HOURS:[]
      }
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.C_NAME.push(res.rows[i].NAME)
        queryResult.C_ID.push(res.rows[i].ID)
        queryResult.D_NAME.push(res.rows[i].D_NAME)
        queryResult.CREDIT_HOURS.push(res.rows[i].CREDIT_HOURS)
        
      }
      console.log(queryResult)
      return queryResult
     return 
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function insertCourseInStudent(courseID,studentID,section) {
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      var temp=0
      var res=await connection.execute(
        'insert into takes values(:1,:2,:3,:4,:5,:6,:7,:8)'
        ,{1:studentID,2:courseID,3:temp,4:temp,5:temp,6:temp,7:temp,8:section},{autoCommit:true}
      )
      
      return res
     return 
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  function typeConverter(enteries)
  {
    for(var i=0;i<enteries.STUDENT_ID.length;i++)
    {
      enteries.STUDENT_ID[i]=parseInt(enteries.STUDENT_ID[i])
      enteries.ASS_QUIZZ[i]=parseFloat(enteries.ASS_QUIZZ[i])
      enteries.MID_1[i]=parseFloat(enteries.MID_1[i])
      enteries.MID_2[i]=parseFloat(enteries.MID_2[i])
      enteries.FINAL[i]=parseFloat(enteries.FINAL[i])
      enteries.SGPA[i]=parseFloat(enteries.SGPA[i])
    }
    return enteries
  }
  async function getNonTAStudents(courseName,section_id) {
    
    let connection;
    var queryResult={
      STUDENT_ID:[],
      NAME:[],
      EMAIL:[]
    }
  
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      // const result = await connection.execute(
      //   `select id from courses where name like  :1 `  
      //  ,[name],
      //  {autoCommit:true}  // bind value for :id
      // );
      // var temp=result.rows[0].ID
      const res = await connection.execute(
        'select DISTINCT s.NAME,s.ID,s.email from student s,takes t,courses c  where s.ID=t.student_ID and t.courses_id=c.id and c.name <>:1  and s.instructors_ins_id is null'
       ,[courseName],
       {autoCommit:true}  // bind value for :id
      );
      console.log(res)
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.STUDENT_ID.push(res.rows[i].ID)
        queryResult.EMAIL.push(res.rows[i].EMAIL)
        queryResult.NAME.push(res.rows[i].NAME)

      }
      
      console.log(queryResult)
     
     return queryResult
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  async function assignStudentAsTA(studentID,instructorID,pay) {
    
    let connection;
    try {
      connection = await oracledb.getConnection( {
        user          : "Mordicai",
        password      : 'fast123',
        connectString : "localhost:1521/xe"
      });
      // const result = await connection.execute(
      //   `select id from courses where name like  :1 `  
      //  ,[name],
      //  {autoCommit:true}  // bind value for :id
      // );
      // var temp=result.rows[0].ID
      const res = await connection.execute(
        'update student set instructor_ins_id=:1 and pay=:2 where id=:3'
       ,[instructorID,pay,studentID],
       {autoCommit:true}  // bind value for :id
      );
      console.log(res)
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.STUDENT_ID.push(res.rows[i].ID)
        queryResult.EMAIL.push(res.rows[i].EMAIL)
        queryResult.NAME.push(res.rows[i].NAME)

      }
      
      console.log(queryResult)
     
     return queryResult
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
  //enteries=typeConverter(enteries)
  
 //insertGradesInTable(enteries,'Programming 101','A')
  //getTeacherCourses(827)
  //getTableData('Semester')
//sectionsStudentRetreival("Programming 101",'A')
  //getCoursesWithSections('Programming 101',827)
//insertTable(values,'Courses')
//getStudentEnrolledCourses(8972)
//coursesInGivenSem('Fall 2019',8972)
getNonTAStudents('Programming 101','A')


//insertStudent('Spongebob','123')


module.exports={
    insertStudent,
    studentGetter,
    getTeacher,
    getTeacherCourses,
    getCoursesWithSections,
    getTableData,
    insertTable,
    sectionsStudentRetreival,
    insertGradesInTable,
    getStudentEnrolledCourses,
    coursesInGivenSem,
    insertCourseInStudent,
    getNonTAStudents,
    assignStudentAsTA
}