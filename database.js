
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
      const result = await connection.execute(
        `select id from courses where name like  :1 `  
       ,[name],
       {autoCommit:true}  // bind value for :id
      );
      var temp=result.rows[0].ID
      const res = await connection.execute(
        `select section_id from teaches where courses_id=:1 and instructors_ins_id =:2 `  
       ,[temp,ins_id],
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
      const result = await connection.execute(
        `select id from courses where name like  :1 `  
       ,[name],
       {autoCommit:true}  // bind value for :id
      );
      var temp=result.rows[0].ID
      const res = await connection.execute(
        `select student_id,ASS_QUIZZ,mid1,mid2,final,gpa from takes where courses_id=:1 and sections_id =:2 `  
       ,[temp,section_id],
       {autoCommit:true}  // bind value for :id
      );
      console.log(res)
      for(var i=0;i<res.rows.length;i++)
      {
        queryResult.STUDENT_ID.push(res.rows[i].STUDENT_ID)
        queryResult.ASS_QUIZZ.push(res.rows[i].ASS_QUIZZ)
        queryResult.MID_1.push(res.rows[i].MID_1)
        queryResult.MID_2.push(res.rows[i].MID_2)
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
  //getTeacherCourses(827)
  //getTableData('Semester')
sectionsStudentRetreival('Programming 101','A')
  //getCoursesWithSections('Programming 101',827)
//insertTable(values,'Courses')



//insertStudent('Spongebob','123')


module.exports={
    insertStudent,
    studentGetter,
    getTeacher,
    getTeacherCourses,
    getCoursesWithSections,
    getTableData,
    insertTable,
    sectionsStudentRetreival
}