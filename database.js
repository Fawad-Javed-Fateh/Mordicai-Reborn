
const oracledb = require('oracledb');

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
 
  getTeacherCourses(827)
//insertStudent('Spongebob','123')


module.exports={
    insertStudent,
    studentGetter,
    getTeacher,
    getTeacherCourses
}