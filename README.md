🏫 Training Institute Management System
📖 Overview

This is a web-based platform for managing courses, trainers, students, and weekly schedules for a training institute.
It’s built using a microservices architecture with independent services communicating via REST APIs and secured using JWT authentication.


🎯 Purpose

The system allows:
Admins to manage trainers, students, courses, and schedules.
Students to view their personalized weekly timetable.
Scalable microservices to ensure easy maintenance and future expansion.

```
🧩 Architecture Overview

The system consists of five core microservices and an API Gateway:

| Service                | Description                                                         | Default Port |
| ---------------------- | ------------------------------------------------------------------- | ------------ |
| **API Gateway**        | Routes requests to the correct microservice, handles authentication | `4000`       |
| **Auth Service**       | Manages users, roles, login, registration, and JWTs                 | `4001`       |
| **Course Service**     | Handles course and module management                                | `4002`       |
| **Schedule Service**   | Manages weekly schedules and trainer-module allocations             | `4003`       |
| **Enrollment Service** | Handles student enrollments (single and bulk)                       | `4004`       |
| **Timetable Service**  | Aggregates data for student timetable view                          | `4005`       |
```



⚙️ Tech Stack

Backend Framework: Node.js + Express.js
Database: MongoDB (Mongoose ODM)
Authentication: JWT (JSON Web Token)
API Gateway: Express + http-proxy-middleware
Architecture: Microservices
Security: HTTPS, bcrypt password hashing


```
🔐 User Roles
| Role        | Permissions                                                   |
| ----------- | ------------------------------------------------------------- |
| **Admin**   | Manage courses, modules, trainers, schedules, and enrollments |
| **Trainer** | View assigned schedules and modules                           |
| **Student** | View personalized weekly timetable                            |
```


🚀 Features

👨‍💼 Admin
View trainers, students, and courses
Create blank weekly schedules
Allocate trainers and modules to time slots
Enroll students individually or in bulk
Upload bulk student data (CSV/Excel)

🎓 Student
View personalized weekly timetable based on enrollments

🧠 System
Role-based access control (RBAC)
Secure authentication using JWT
Modular and scalable architecture
Easy service-level isolation for deployment