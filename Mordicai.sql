/*BEGIN

FOR c IN (SELECT table_name FROM user_tables) LOOP
EXECUTE IMMEDIATE ('DROP TABLE "' || c.table_name || '" CASCADE CONSTRAINTS');
END LOOP;

FOR s IN (SELECT sequence_name FROM user_sequences) LOOP
EXECUTE IMMEDIATE ('DROP SEQUENCE ' || s.sequence_name);
END LOOP;

END;*/
--------------------------------------------------------
--  DDL for Table SECTIONS
--------------------------------------------------------

  CREATE TABLE "MOR"."SECTIONS" 
   (	"ID" VARCHAR2(1 CHAR), 
	"CR_NAME" VARCHAR2(30 CHAR)
   ); 

  ALTER TABLE "MOR"."SECTIONS" ADD PRIMARY KEY ("ID");
  
--------------------------------------------------------
--  DDL for Table SEMESTER
--------------------------------------------------------

  CREATE TABLE "MOR"."SEMESTER" 
   (	"DURATION" NUMBER(*,0), 
	"NAME" VARCHAR2(20 CHAR), 
	"START_DATE" DATE, 
	"SEMESTER_ID" NUMBER
   ); 

  ALTER TABLE "MOR"."SEMESTER" ADD CONSTRAINT "SEMESTER_PK" PRIMARY KEY ("SEMESTER_ID");
  ALTER TABLE "MOR"."SEMESTER" MODIFY ("START_DATE" NOT NULL ENABLE);
  ALTER TABLE "MOR"."SEMESTER" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "MOR"."SEMESTER" MODIFY ("DURATION" NOT NULL ENABLE);
     CREATE SEQUENCE  "MOR"."SEMESTER_SEMESTER_ID_SEQ"  MINVALUE 1 MAXVALUE 99999999 INCREMENT BY 1 START WITH 1 NOCACHE  ORDER  NOCYCLE ;
   CREATE SEQUENCE  "MOR"."SEMESTER_SEQUENCE"  MINVALUE 1 MAXVALUE 99 INCREMENT BY 1 START WITH 20 CACHE 20 NOORDER  NOCYCLE ;
   
     CREATE OR REPLACE TRIGGER "MOR"."SEMESTER_SEMESTER_ID_TRG" BEFORE
  INSERT ON Semester FOR EACH ROW  WHEN (NEW.Semester_ID IS NULL) BEGIN :NEW.Semester_ID := Semester_Semester_ID_SEQ.NEXTVAL;
END;

/
ALTER TRIGGER "MOR"."SEMESTER_SEMESTER_ID_TRG" ENABLE;

CREATE OR REPLACE TRIGGER "MOR"."SEMESTER_ID_TRIGGER" 
    before insert on semester
    for each row
begin
  :new.semester_id := semester_sequence.nextval;
  dbms_output.put_line('Evolution');
end;
/
ALTER TRIGGER "MOR"."SEMESTER_ID_TRIGGER" ENABLE;

  
--------------------------------------------------------
--  DDL for Table INSTRUCTORS
--------------------------------------------------------

  CREATE TABLE "MOR"."INSTRUCTORS" 
   (	"NAME" VARCHAR2(25 CHAR), 
	"INS_ID" NUMBER(*,0), 
	"START_DATE" DATE, 
	"SALARY" NUMBER(*,0), 
	"ADDRESS" VARCHAR2(200 CHAR), 
	"EMAIL" VARCHAR2(30 CHAR), 
	"DEPARTMENTS_D_CODE" VARCHAR2(2 CHAR), 
	"DESIGNATION" VARCHAR2(8 CHAR)
);
  ALTER TABLE "MOR"."INSTRUCTORS" ADD CONSTRAINT "INSTRUCTORS_PK" PRIMARY KEY ("INS_ID");
  ALTER TABLE "MOR"."INSTRUCTORS" ADD CHECK ( ( Departments_D_code IS NULL AND Designation IS NULL) OR ( Departments_D_code IS NOT NULL AND Designation IS NOT NULL) ) ENABLE;
  ALTER TABLE "MOR"."INSTRUCTORS" MODIFY ("EMAIL" NOT NULL ENABLE);
  ALTER TABLE "MOR"."INSTRUCTORS" MODIFY ("SALARY" NOT NULL ENABLE);
  ALTER TABLE "MOR"."INSTRUCTORS" MODIFY ("START_DATE" NOT NULL ENABLE);
  ALTER TABLE "MOR"."INSTRUCTORS" MODIFY ("INS_ID" NOT NULL ENABLE);
  ALTER TABLE "MOR"."INSTRUCTORS" MODIFY ("NAME" NOT NULL ENABLE);
CREATE SEQUENCE  "MOR"."INSTRUCTOR_SEQUENCE"  MINVALUE 1 MAXVALUE 999 INCREMENT BY 1 START WITH 120 CACHE 20 NOORDER  NOCYCLE ;
CREATE OR REPLACE TRIGGER "MOR"."INSTRUCTOR_ID_TRIGGER" 
    before insert on instructors
    for each row
begin
  :new.ins_id := instructor_sequence.nextval;
  dbms_output.put_line('Evolution');
end;
/
ALTER TRIGGER "MOR"."INSTRUCTOR_ID_TRIGGER" ENABLE;


--------------------------------------------------------
--  DDL for Table DEPARTMENTS
--------------------------------------------------------

  CREATE TABLE "MOR"."DEPARTMENTS" 
   (	"D_NAME" VARCHAR2(20 CHAR), 
	"D_CODE" VARCHAR2(2 CHAR), 
	"D_PHONE" NUMBER(*,0), 
	"INSTRUCTORS_INS_ID" NUMBER(*,0), 
	"START_DATE" DATE
   ); 

  ALTER TABLE  "MOR"."DEPARTMENTS" ADD CONSTRAINT "DEPARTMENTS_FK1" FOREIGN KEY ("INSTRUCTORS_INS_ID") REFERENCES "MOR"."INSTRUCTORS"("INS_ID") ;
  ALTER TABLE "MOR"."DEPARTMENTS" ADD CONSTRAINT "DEPARTMENTS_PK" PRIMARY KEY ("D_CODE");
  ALTER TABLE "MOR"."DEPARTMENTS" ADD CHECK ( ( Instructors_Ins_ID IS NULL AND Start_Date IS NULL) OR ( Instructors_Ins_ID IS NOT NULL AND Start_Date IS NOT NULL) ) ENABLE;
  ALTER TABLE "MOR"."DEPARTMENTS" MODIFY ("D_CODE" NOT NULL ENABLE);
  ALTER TABLE "MOR"."DEPARTMENTS" MODIFY ("D_NAME" NOT NULL ENABLE);
  ALTER TABLE  "MOR"."INSTRUCTORS" ADD CONSTRAINT "INSTRUCTORS_FK1" FOREIGN KEY ("DEPARTMENTS_D_CODE") REFERENCES "MOR"."DEPARTMENTS"("D_CODE") ON DELETE SET NULL;

--------------------------------------------------------
--  DDL for Table COURSES
--------------------------------------------------------

  CREATE TABLE "MOR"."COURSES" 
   (	"ID" NUMBER(*,0) NOT NULL, 
	"CREDIT_HOURS" NUMBER(*,0), 
	"NAME" VARCHAR2(30 CHAR), 
	"DEPARTMENTS_D_CODE" VARCHAR2(2 CHAR), 
	"SEMESTER_SEMESTER_ID" NUMBER
   ); 
ALTER TABLE  "MOR"."COURSES" ADD CONSTRAINT "COURSES_FK1" FOREIGN KEY ("SEMESTER_SEMESTER_ID") REFERENCES "MOR"."SEMESTER"("SEMESTER_ID")  ON DELETE CASCADE;
   ALTER TABLE  "MOR"."COURSES" ADD CONSTRAINT "COURSES_FK2" FOREIGN KEY ("DEPARTMENTS_D_CODE") REFERENCES "MOR"."DEPARTMENTS"("D_CODE")  ON DELETE CASCADE;
  ALTER TABLE "MOR"."COURSES" ADD CONSTRAINT "COURSES_PK" PRIMARY KEY ("ID","SEMESTER_SEMESTER_ID");
  ALTER TABLE "MOR"."COURSES" MODIFY ("NAME" NOT NULL ENABLE);
  ALTER TABLE "MOR"."COURSES" MODIFY ("CREDIT_HOURS" NOT NULL ENABLE);
  

CREATE SEQUENCE  "MOR"."COURSES_SEQUENCE"  MINVALUE 10020 MAXVALUE 99999 INCREMENT BY 10 START WITH 10020 CACHE 20 NOORDER  NOCYCLE ;
  
CREATE OR REPLACE TRIGGER "MOR"."COURSES_ID_TRIGGER" 
    before insert on courses
    for each row
begin
  :new.id := courses_sequence.nextval;
  dbms_output.put_line('Evolution');
end;
/
ALTER TRIGGER "MOR"."COURSES_ID_TRIGGER" ENABLE;

--------------------------------------------------------
--  DDL for Table STUDENT
--------------------------------------------------------

  CREATE TABLE "MOR"."STUDENT" 
   (	"NAME" VARCHAR2(30 CHAR), 
	"BATCH" NUMBER(*,0), 
	"ID" NUMBER(*,0), 
	"ADDRESS" VARCHAR2(200 CHAR), 
	"EMAIL" VARCHAR2(30 CHAR), 
	"INSTRUCTORS_INS_ID" NUMBER(*,0), 
	"PAY" NUMBER(*,0)
   ); 
ALTER TABLE  "MOR"."STUDENT" ADD CONSTRAINT "STUDENT_FK1" FOREIGN KEY ("INSTRUCTORS_INS_ID") REFERENCES "MOR"."INSTRUCTORS"("INS_ID")  ON DELETE SET NULL;
  ALTER TABLE "MOR"."STUDENT" ADD CONSTRAINT "STUDENT_PK" PRIMARY KEY ("ID");
  ALTER TABLE "MOR"."STUDENT" ADD CHECK ( ( Instructors_Ins_ID IS NULL AND Pay IS NULL) OR ( Instructors_Ins_ID IS NOT NULL AND Pay IS NOT NULL) ) ENABLE;
  ALTER TABLE "MOR"."STUDENT" MODIFY ("EMAIL" NOT NULL ENABLE);
  ALTER TABLE "MOR"."STUDENT" MODIFY ("BATCH" NOT NULL ENABLE);
  ALTER TABLE "MOR"."STUDENT" MODIFY ("NAME" NOT NULL ENABLE);
     CREATE SEQUENCE  "MOR"."STUDENT_SEQUENCE"  MINVALUE 1 MAXVALUE 9999 INCREMENT BY 1 START WITH 181 CACHE 20 NOORDER  NOCYCLE ;
     
     CREATE OR REPLACE TRIGGER "MOR"."STUDENT_ID_TRIGGER" 
    before insert on student
    for each row
begin
  :new.id := student_sequence.nextval;
  dbms_output.put_line('Evolution');
end;
/
ALTER TRIGGER "MOR"."STUDENT_ID_TRIGGER" ENABLE;

--------------------------------------------------------
--  DDL for Table STUDENT_ALLOTTED_SECTIONS
--------------------------------------------------------

CREATE TABLE "MOR"."STUDENT_ALLOTTED_SECTIONS" 
   (	"STUDENT_ID" NUMBER(*,0), 
	"SECTIONS_ID" VARCHAR2(1 CHAR), 
	"COURSES_ID" NUMBER(38,0),
    "SEMESTER_SEMESTER_ID" NUMBER
   );
   
   ALTER TABLE  "MOR"."STUDENT_ALLOTTED_SECTIONS" ADD CONSTRAINT "STUDENT_ALLOTTED_SECTIONS_FK1" FOREIGN KEY ("STUDENT_ID") REFERENCES "MOR"."STUDENT"("ID")  ON DELETE CASCADE;
   ALTER TABLE  "MOR"."STUDENT_ALLOTTED_SECTIONS" ADD CONSTRAINT "STUDENT_ALLOTTED_SECTIONS_FK2" FOREIGN KEY ("COURSES_ID","SEMESTER_SEMESTER_ID") REFERENCES "MOR"."COURSES"("ID","SEMESTER_SEMESTER_ID")  ON DELETE CASCADE;  
   ALTER TABLE "MOR"."STUDENT_ALLOTTED_SECTIONS" ADD CONSTRAINT "STUDENT_ALLOTTED_SECTIONS_PK" PRIMARY KEY ("STUDENT_ID", "COURSES_ID");
  ALTER TABLE "MOR"."STUDENT_ALLOTTED_SECTIONS" MODIFY ("SECTIONS_ID" NOT NULL ENABLE);
  




--------------------------------------------------------
--  DDL for Table STUDENT_ENROLLED_IN_SEMESTER
--------------------------------------------------------

  CREATE TABLE "MOR"."STUDENT_ENROLLED_IN_SEMESTER" 
   (	"STUDENT_ID" NUMBER(*,0), 
	"SEMESTER_SEMESTER_ID" NUMBER, 
	"SGPA" FLOAT(2), 
	"CRED_HRS" NUMBER(*,0)
   ); 
ALTER TABLE  "MOR"."STUDENT_ENROLLED_IN_SEMESTER" ADD CONSTRAINT "ENROLLED_FK1" FOREIGN KEY ("STUDENT_ID") REFERENCES "MOR"."STUDENT"("ID")  ON DELETE CASCADE;
  ALTER TABLE "MOR"."STUDENT_ENROLLED_IN_SEMESTER" ADD CONSTRAINT "ENROLLED_FK2" FOREIGN KEY ("SEMESTER_SEMESTER_ID") REFERENCES "MOR"."SEMESTER"("SEMESTER_ID")  ON DELETE CASCADE;
  ALTER TABLE "MOR"."STUDENT_ENROLLED_IN_SEMESTER" ADD CONSTRAINT "ENROLLED_IN_PK" PRIMARY KEY ("STUDENT_ID", "SEMESTER_SEMESTER_ID");


--------------------------------------------------------
--  DDL for Table STUDENT_TAKES_COURSE
--------------------------------------------------------

  CREATE TABLE "MOR"."STUDENT_TAKES_COURSE" 
   (	"STUDENT_ID" NUMBER(*,0), 
	"COURSES_ID" NUMBER(*,0), 
	"GPA" FLOAT(2), 
	"MID1" FLOAT(2), 
	"MID2" FLOAT(2), 
	"FINAL" FLOAT(2), 
	"ASS_QUIZZ" FLOAT(2),
    "SEMESTER_SEMESTER_ID" NUMBER
   ); 
ALTER TABLE  "MOR"."STUDENT_TAKES_COURSE" ADD CONSTRAINT "TAKES_FK1" FOREIGN KEY ("STUDENT_ID") REFERENCES "MOR"."STUDENT"("ID")  ON DELETE CASCADE;
ALTER TABLE  "MOR"."STUDENT_TAKES_COURSE" ADD CONSTRAINT "TAKES_FK2" FOREIGN KEY ("COURSES_ID","SEMESTER_SEMESTER_ID") REFERENCES "MOR"."COURSES"("ID","SEMESTER_SEMESTER_ID")  ;
  ALTER TABLE "MOR"."STUDENT_TAKES_COURSE" ADD PRIMARY KEY ("STUDENT_ID",  "COURSES_ID");



--------------------------------------------------------
--  DDL for Table INSTRUCTOR_TEACHES_COURSE
--------------------------------------------------------

  CREATE TABLE "MOR"."INSTRUCTOR_TEACHES_COURSE" 
   (	"INSTRUCTORS_INS_ID" NUMBER(*,0), 
	"COURSES_ID" NUMBER(*,0), 
	"SECTION_ID" VARCHAR2(1 BYTE),
    "SEMESTER_SEMESTER_ID" NUMBER
   ); 
ALTER TABLE  "MOR"."INSTRUCTOR_TEACHES_COURSE" ADD CONSTRAINT "TEACHES_FK1" FOREIGN KEY ("INSTRUCTORS_INS_ID") REFERENCES "MOR"."INSTRUCTORS"("INS_ID")  ON DELETE SET NULL;
ALTER TABLE  "MOR"."INSTRUCTOR_TEACHES_COURSE" ADD CONSTRAINT "TEACHES_FK2" FOREIGN KEY ("COURSES_ID","SEMESTER_SEMESTER_ID") REFERENCES "MOR"."COURSES"("ID","SEMESTER_SEMESTER_ID")  ON DELETE CASCADE;
ALTER TABLE  "MOR"."INSTRUCTOR_TEACHES_COURSE" ADD CONSTRAINT "TEACHES_FK3" FOREIGN KEY ("SECTION_ID") REFERENCES "MOR"."SECTIONS"("ID")  ON DELETE CASCADE;
ALTER TABLE "MOR"."INSTRUCTOR_TEACHES_COURSE" ADD PRIMARY KEY ("INSTRUCTORS_INS_ID", "COURSES_ID");

   
     CREATE OR REPLACE PUBLIC SYNONYM "DBMS_OUTPUT" FOR "SYS"."DBMS_OUTPUT";
     
CREATE OR REPLACE VIEW STUDENTS_OF_SECTIONS AS
SELECT * from STUDENT_TAKES_COURSE natural join STUDENT_ALLOTTED_SECTIONS ;


create or replace trigger UPADTE_SEM_TAKESCOURSE
before insert on STUDENT_TAKES_COURSE
for each row
declare
var number;
begin
select semester_id into var from semester where start_date = (select max(start_date) from semester);
:new.semester_semester_id := var;
end;
/
create or replace trigger UPADTE_SEM_ALLOTSECTIONS
before insert on STUDENT_ALLOTTED_SECTIONS
for each row
declare
var number;
begin
select semester_id into var from semester where start_date = (select max(start_date) from semester);
:new.semester_semester_id := var;
end;
/
create or replace trigger Enroll_student
after insert on Student
for each row
declare 
var number;
begin
select semester_id into var from semester where start_date = (select max(start_date) from semester);
insert into STUDENT_ENROLLED_IN_SEMESTER values(:new.id,var,0,0);
end;
/
create or replace trigger update_credithours
after insert on STUDENT_TAKES_COURSE
for each row
declare 
var number;
var2 number;
begin
update STUDENT_ENROLLED_IN_SEMESTER set cred_hrs = cred_hrs + (select credit_hours from courses where id = :new.COURSES_ID) where student_id = :new.student_id and SEMESTER_SEMESTER_ID=:new.SEMESTER_SEMESTER_ID;
end;
/
create or replace trigger update_sgpa
after update on STUDENT_TAKES_COURSE
for each row
declare 
var number:=0;
var2 number:=0;
num number:=0;
sg float:=0;
begin
for i in (select GPA , courses_id from STUDENT_TAKES_COURSE where student_id = :new.student_id)
loop
select credit_hours into var from courses where id = i.COURSES_ID;
num := num + i.GPA*var;
var2 := var2+var;
end loop;
sg:=num/var2;
update STUDENT_ENROLLED_IN_SEMESTER set sgpa = sg where student_id = :new.student_id and SEMESTER_SEMESTER_ID = :new.SEMESTER_SEMESTER_ID;
end;
/