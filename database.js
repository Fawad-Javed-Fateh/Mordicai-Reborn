
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;



async function getStudent(userName,pWord) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "PROJECTDB",
      password      : 'fast123',
      connectString : "localhost:1521/xe"
    });

    const result = await connection.execute(
      `select * from students where fname = :1 and password = :2  `
       ,[userName,pWord],  // bind value for :id
    );
   // console.log(result);
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
        user          : "PROJECTDB",
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
//insertStudent('Spongebob','123')
//getStudent('Spongebob','123');

module.exports={
    insertStudent,
    getStudent
}