// eslint-disable-next-line max-lines-per-function
function createStudent(name, year) {
  return {
    name,
    year,
    courses: [],

    info() {
      console.log(`${this.name} is a ${this.year} year student`);
    },

    addCourse(course) {
      this.courses.push(course);
    },

    listCourses() {
      return this.courses;
    },

    addNote(code, note) {
      this.courses.forEach(course => {
        if (course.code === code) {
          if (course.note) {
            course.note += "; " + note;
          } else {
            course.note = note;
          }
        }
      });
    },

    updateNote(code, note) {
      this.courses.forEach(course => {
        if (course.code === code) {
          course.note = note;
        }
      });
    },

    viewNotes() {
      this.courses.forEach(course => {
        if (course.note) {
          console.log(`${course.name}: ${course.note}`);
        }
      });
    }
  };
}

// eslint-disable-next-line max-lines-per-function
function createSchool() {
  return {
    students: [],

    addStudent(name, year) {
      if (["1st", "2nd", "3rd", "4th", "5th"].includes(year)) {
        let student = createStudent(name, year);
        this.students.push(student);
        return student;
      } else {
        console.log("Invalid Year.");
      }
    },

    enrolStudent(student, courseName, courseCode) {
      student.addCourse({name: courseName, code: courseCode});
    },

    addGrade(student, courseName, grade) {
      student.listCourses().forEach(course => {
        if (course.name === courseName) {
          course.grade = grade;
        }
      });
    },

    getReportCard(student) {
      student.listCourses().forEach(course => {
        console.log(`${course.name}: ${course.grade ? course.grade : "In progress"}`);
      });
    },

// eslint-disable-next-line max-lines-per-function
    courseReport(courseName) {
      let gradeSum = 0;
      let studentCount = 0;

      console.log(`=${courseName} Grades=`);

      this.students.forEach(student => {
        student.listCourses().forEach(course => {
          if (course.name === courseName && course.grade) {
            console.log(`${student.name}: ${course.grade}`);
            gradeSum += course.grade;
            studentCount += 1;
          }
        });
      });

      if (studentCount > 0) {
        console.log("---");
        let courseAvg = gradeSum / studentCount;
        console.log(`Course Average: ${String(courseAvg)}`);
      } else {
        console.log("None yet.");
      }
    }
  };
}

const School = createSchool();

let foo = School.addStudent("foo", "3rd");

School.enrolStudent(foo, "Math", 101);
School.enrolStudent(foo, "Advanced Math", 102);
School.enrolStudent(foo, "Physics", 202);

School.addGrade(foo, "Math", 95);
School.addGrade(foo, "Advanced Math", 90);

let bar = School.addStudent("bar", "1st");

School.enrolStudent(bar, "Math", 101);

School.addGrade(bar, "Math", 91);

let qux = School.addStudent("qux", "2nd");

School.enrolStudent(qux, "Math", 101);
School.enrolStudent(qux, "Advanced Math", 102);

School.addGrade(qux, "Math", 93);
School.addGrade(qux, "Advanced Math", 90);

School.getReportCard(foo);

School.courseReport("Math");

School.courseReport("Advanced Math");

School.courseReport("Physics");