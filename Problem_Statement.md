# Fleet Maintenance Scheduling Platform

## 1. Title

**Fleet Maintenance Scheduling Platform**

---

## 2. Domain

**Fleet Management and Vehicle Maintenance**

---

## 3. User Types

The system will support the following primary user types:

1. **Fleet Manager**
   Responsible for managing fleet vehicles, monitoring maintenance requirements, scheduling maintenance activities, and tracking vehicle service history.

2. **Maintenance Staff**
   Responsible for carrying out assigned maintenance activities, updating maintenance status, and recording completed maintenance work.

3. **System Administrator**
   Responsible for managing users, roles, and system-level configuration.

---

## 4. Problem

Fleet operators often rely on spreadsheets, manual records, and disconnected communication to manage vehicle maintenance activities. This makes it difficult to track upcoming maintenance, monitor vehicle maintenance status, and maintain accurate service history. Missed or delayed maintenance can increase vehicle downtime, maintenance costs, and the risk of unexpected vehicle failures. Fleet managers also lack a centralized system to coordinate maintenance activities and monitor the overall maintenance status of their vehicles.

---

## 5. Proposed Solution

The **Fleet Maintenance Scheduling Platform** is a web-based application designed to centralize and streamline fleet vehicle maintenance operations.

The platform will allow fleet managers to register and manage vehicles, create and monitor maintenance schedules, assign maintenance activities, and track service history. Maintenance staff will be able to view assigned maintenance tasks, update their progress, and record completed maintenance activities.

The system will implement **role-based access control** so that users can access only the operations relevant to their responsibilities. A structured maintenance workflow will allow the system to track maintenance activities through different statuses such as **Scheduled, In Progress, Completed, and Cancelled**.

The platform will maintain vehicle maintenance history and upcoming maintenance schedules to help fleet managers identify vehicles requiring attention and reduce avoidable vehicle downtime.

The system will also provide scope for a future **predictive maintenance enhancement**, where historical vehicle and maintenance data can be used to identify vehicles that may require maintenance in advance.

The platform will have scope for integration with a **third-party notification service** to send maintenance reminders and alerts to relevant users.

---

## 6. Core Entities

The system will contain the following core entities:

1. **User**
   Stores user account, authentication, and role-related information.

2. **Vehicle**
   Stores vehicle details such as registration information, vehicle type, model, and operational status.

3. **Maintenance Schedule**
   Stores planned maintenance activities, scheduled dates, maintenance type, priority, and status.

4. **Maintenance Record**
   Stores details of completed maintenance activities, service information, dates, observations, and maintenance history.

5. **Service Provider**
   Stores information about workshops or service providers involved in vehicle maintenance.

These entities represent genuine components of the fleet maintenance workflow and will be related through appropriate primary-key and foreign-key relationships in the database.

---

## 7. User Roles

### 7.1 Fleet Manager

The Fleet Manager will have permissions to:

* Register and manage fleet vehicles.
* View vehicle information and maintenance status.
* Create and manage maintenance schedules.
* Assign maintenance activities to maintenance staff.
* View maintenance history.
* Monitor upcoming and overdue maintenance.
* View fleet-level maintenance information.

### 7.2 Maintenance Staff

Maintenance Staff will have permissions to:

* View assigned maintenance activities.
* View relevant vehicle information.
* Update maintenance status.
* Record maintenance work performed.
* Add completed maintenance details.
* View relevant maintenance history.

### 7.3 System Administrator

The System Administrator will have permissions to:

* Manage user accounts.
* Manage user roles.
* Manage system-level configuration.
* Monitor and maintain platform records.

---

## 8. Success Criteria

The project will be considered successful when:

* Users can securely register and log in to the platform.
* Authentication provides access according to the user's assigned role.
* Fleet Managers can create, view, update, and manage vehicle information.
* Maintenance schedules can be created and associated with specific vehicles.
* Maintenance activities can be assigned to appropriate maintenance staff.
* Maintenance Staff can view assigned activities and update their status.
* Completed maintenance activities are stored as maintenance records.
* Vehicle maintenance history can be retrieved and viewed.
* Maintenance status changes are correctly persisted in the database.
* Core workflows operate end-to-end from the React frontend through the FastAPI backend to the PostgreSQL database and back to the frontend.
* Server-side validation prevents invalid data from being stored.
* The system provides a consistent API response structure and appropriate HTTP status codes.
* The application can be run locally by following the instructions provided in the README.
* The architecture supports future integration with external notification services.
* The system provides a suitable foundation for a future predictive-maintenance enhancement.

---

## 9. Out of Scope

The following functionality is outside the initial scope of the project:

* Real-time GPS vehicle tracking.
* Driver payroll and salary management.
* Fuel management and fuel expense tracking.
* Vehicle purchasing and sales management.
* Insurance claim processing.
* Full accounting and financial management.
* Spare-parts inventory management.
* Development of a separate mobile application.
* Advanced AI-based predictive maintenance in the initial MVP.
* Real-time vehicle telematics and IoT sensor integration.

These features may be considered as future enhancements if required, but they will not be part of the initial Review-I MVP scope.

---

## 10. Chosen Track

**Python Track**

### Technology Stack

* **Frontend:** React
* **Backend:** FastAPI
* **Database:** PostgreSQL
* **ORM:** SQLAlchemy
* **Authentication:** JWT
* **Password Hashing:** bcrypt
* **Validation:** Pydantic
* **API Documentation:** FastAPI OpenAPI / Swagger
* **Version Control:** Git and GitHub

The project will follow a layered backend structure consisting of API/router, service, repository, model, and schema layers.
