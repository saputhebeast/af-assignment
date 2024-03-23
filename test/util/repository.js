import { addUser } from "../../src/service/user.service";
import { addFaculty } from "../../src/service/faculty.service";
import { addCourse } from "../../src/service/course.service";

export const createUser = async (name, email, role) => {
  const user = {
    name: name,
    email: email,
    password: "test@123",
    role: role,
    is_verified: true,
    verification_code: "908890",
    mobile_no: "0879098765"
  };
  const response = await addUser(user);
  return response;
};

export const createFaculty = async (name, user) => {
  const faculty = {
    name: name
  };
  const response = await addFaculty(faculty, user);
  return response;
};

export const createCourse = async (code, name, user) => {
  const course = {
    code: code,
    name: name,
    description: "Sample course",
    credits: 4
  };
  const response = await addCourse(course, user);
  return response;
};
