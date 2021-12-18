select * from instructor_teaches_course;
select * from instructors;
select * from courses;
select * from sections;
select * from semester;
select * from INSTRUCTOR_TEACHES_COURSE;
select * from student;
select * from student_enrolled_in_semester;
select * from STUDENT_ALLOTTED_SECTIONS;
insert into semester values(6,'Spring 2020',TO_DATE('2/JANUARY/2020'),5665);
insert into instructor_teaches_course values(120,10060,'A',20);
insert into instructor_teaches_course values(120,10070,'A',20);
insert into STUDENT_ALLOTTED_SECTIONS values(183,'A',10110,21);
insert into STUDENT_ALLOTTED_SECTIONS values(184,'A',10060,20);
insert into STUDENT_ALLOTTED_SECTIONS values(185,'A',10060,20);
insert into STUDENT_ALLOTTED_SECTIONS values(186,'A',10060,20);
insert into STUDENT_ALLOTTED_SECTIONS values(187,'A',10060,20);

insert into STUDENT_ALLOTTED_SECTIONS values(183,'A',10070,20);
insert into STUDENT_ALLOTTED_SECTIONS values(184,'A',10070,20);
insert into STUDENT_ALLOTTED_SECTIONS values(185,'A',10070,20);
insert into STUDENT_ALLOTTED_SECTIONS values(186,'A',10070,20);

insert into STUDENT_TAKES_COURSE values(183,10060,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(184,10060,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(185,10060,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(186,10060,0,0,0,0,0,20);

insert into STUDENT_TAKES_COURSE values(183,10070,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(184,10070,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(185,10070,0,0,0,0,0,20);
insert into STUDENT_TAKES_COURSE values(186,10070,0,0,0,0,0,20);


select * from student_enrolled_in_semester;
insert into student_enrolled_in_semester values(183,21,0,0);
insert into courses values (1,3,'Divinition','MT',21);
insert into courses values (1,3,'Stress 101','CS',21);
commit;

drop trigger update_sgpa;
select * from students_of_sections;
update  STUDENT_TAKES_COURSE set MID1=10,MID2=0,final=0,gpa=0,ass_quizz=0  where student_id=183 and courses_id=10060  and SEMESTER_SEMESTER_ID=(select SEMESTER_SEMESTER_ID from STUDENT_ALLOTTED_SECTIONS where  student_id=183 and courses_id=10060 and sections_id='A');
select * from STUDENT_TAKES_COURSE;
insert into STUDENT_TAKES_COURSE values(183,10110,0,0,0,0,0,21);

select  sem.name, s.cred_hrs,s.semester_semester_id,s.sgpa,cor.credit_hours,c.gpa,c.courses_id,cor.name,sas.sections_id from STUDENT_ALLOTTED_SECTIONS sas,STUDENT_ENROLLED_IN_SEMESTER s,student_takes_course c,semester sem,courses cor  where   sas.student_id=c.student_id and sas.SEMESTER_SEMESTER_ID=s.SEMESTER_SEMESTER_ID and sas.COURSES_ID=c.COURSES_ID and s.student_id=c.student_id and c.COURSES_ID=cor.ID and s.semester_semester_id=sem.SEMESTER_ID and  s.semester_semester_id=c.semester_semester_id and s.student_id=183;


