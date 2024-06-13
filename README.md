# How the Timetable Management System Works: An Overview

The Timetable Management System is designed to streamline the scheduling processes in an educational institution, supporting a seamless collaboration between administrators, faculty members, and students. With a focus on maximizing resource utilization and preventing scheduling conflicts, the system revolves around several key functionalities:

- **Role-Based Access Control**: Different roles (Admin, Faculty, Students) with specific permissions ensure a structured and efficient management approach.
- **Booking Management**: Faculty and students can request bookings for events or classes, which are initially in a pending state awaiting admin approval.
- **Timetable Creation**: Upon admin approval, bookings are transformed into timetable events, with checks in place to prevent overlaps and ensure availability.
- **Flexible Scheduling**: The system allows for full-day or part-day events (up to 4 hours for part-day) and supports both one-time and recurrent scheduling to accommodate various needs.
- **Comprehensive Management Features**: Beyond scheduling, the system facilitates the management of courses, classrooms, faculties, enrollments, and notifications.

This system aims to provide a comprehensive solution to the challenges of managing academic schedules, ensuring that all events are organized efficiently and effectively without conflicts.

# System Overview

For a visual representation of the system architecture and interactions between the components, refer to the System Overview diagram.

![System Overview Diagram](https://github.com/sliitcsse/assignment-01-saputhebeast/assets/72787452/4e3b0cc6-e5d8-461a-8c92-70c00e02978b)

# Database Design

To understand the database schema and relationships between collections, view the Database Design diagram.

![Database Design Diagram](https://github.com/sliitcsse/assignment-01-saputhebeast/assets/72787452/0d714f99-f5f1-4b73-a7db-c82c6c7b035c)

# Setting Up and Running the Application

Follow these steps to set up and run the application in your local development environment:

1. **Install Dependencies:**
   - Use your preferred package manager to install the dependencies. For example, with pnpm, you would use:
     ```sh
     pnpm install
     ```

2. **Run the Application:**
   - Start the application in development mode with live reloading:
     ```sh
     pnpm run dev
     ```
   - This command will start the server, and you should see logs in the terminal indicating that the server is running and listening on a specific port (sample request `http://localhost:8085`).

3. **API Testing with Postman:**
   - Download the provided Postman collection for a comprehensive set of requests to test the API endpoints.
   - Import the collection into Postman to start testing the API interactions easily.

# API Documentation

For detailed information on API endpoints, request formats, and expected responses, refer to the API documentation:

[View API Documentation](https://documenter.getpostman.com/view/17332222/2sA2xh2swm)

This documentation includes examples, possible status codes, and descriptions of each endpoint to help you understand how to interact with the API effectively.

# Technology Stack
Node.js, Express, Mongoose, MongoDB

# Author
- Name : Sapumal Wijekoon
- IT Number: IT21160202
- Email: it21160202@my.sliit.lk
