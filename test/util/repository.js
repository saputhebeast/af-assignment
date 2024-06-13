import { addUser } from "../../src/service/user.service";
import { addFaculty } from "../../src/service/faculty.service";
import { addCourse } from "../../src/service/course.service";
import { addResource } from "../../src/service/resource.service";
import { addClassroom } from "../../src/service/classroom.service";

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

export const createResource = async (name, description, quantity, user) => {
  const resource = {
    name: name,
    description: description,
    quantity: quantity,
    created_by: user._id
  };
  const response = await addResource(resource, user);
  return response;
};

export const createClassroom = async (roomNumber, building, floor, capacity, resources, user) => {
  const classroomData = {
    room_number: roomNumber,
    building: building,
    floor: floor,
    capacity: capacity,
    resources: resources,
    created_by: user._id
  };

  const response = await addClassroom(classroomData, user);
  return response;
};
