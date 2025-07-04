# Driver Module

## Table of Contents
- [Module Overview](#module-overview)
- [Key Features](#key-features)
- [Table Design](#table-design)
    - [Driver Table](#driver-table)
- [Component Diagram](#component-diagram)
- [Layered Architecture of Driver Module](#layered-architecture-of-driver-module)
    - [Controller Layer](#controller-layer)
    - [Service Layer](#service-layer)
    - [Repository/Data Access Layer](#repositorydata-access-layer)
- [API Endpoints](#api-endpoints)
- [API Documentation of Driver Module](#api-documentation-of-driver-module)

---

## Module Overview

The **Driver Module** manages driver-related functionalities within the Cab Booking System. It includes operations such as driver registration, login, profile retrieval, and status updates. Secure authentication and authorization are implemented using JWT tokens, enabling seamless interaction between drivers and the system.

---

## Key Features
- **Driver Registration**: Enables new drivers to register with their details.
- **Driver Login**: Authenticates drivers and generates JWT tokens for secure access.
- **Profile Management**: Retrieves driver profile information using authentication tokens.
- **Status Update**: Allows drivers to update their availability status.

---

## Table Design

### Driver Table
| Column Name       | Data Type         | Constraints                  | Description                       |
|-------------------|-------------------|------------------------------|-----------------------------------|
| **driverId**      | BIGINT            | Primary Key, Auto Increment  | Unique identifier for the driver  |
| **name**          | VARCHAR(255)      | Not Null                     | Name of the driver                |
| **phone**         | VARCHAR(15)       | Unique, Not Null             | Phone number of the driver        |
| **licenseNumber** | VARCHAR(255)      | Unique                       | Driver's license number           |
| **vehicleDetails**| VARCHAR(255)      | Not Null                     | Details of the driver's vehicle   |
| **passwordHash**  | VARCHAR(255)      | Not Null                     | Hashed password for security      |
| **available**     | BOOLEAN           | Not Null                     | Availability status of the driver |
| **role**          | ENUM              | Not Null                     | Role of the driver (e.g., DRIVER) |

---

## Component Diagram

![Driver component diagram](./component/driver.png)

---

## Layered Architecture of Driver Module

The Driver Module follows a classic 3-layered architecture:

### Controller Layer
- **Purpose**: Handles HTTP requests and maps them to service methods.
- **Component**: `DriverController`
- **Endpoints**:
    - `POST /api/drivers/register`: Handles driver registration.
    - `POST /api/drivers/login`: Handles driver login and JWT generation.
    - `GET /api/drivers/available`: Retrieves available drivers.
    - `PUT /api/drivers/status`: Updates driver availability status.
    - `GET /api/drivers/profile`: Retrieves driver profile information.

### Service Layer
- **Purpose**: Contains the business logic for driver-related operations.
- **Components**:
    - `DriverServiceImpl`: Implements the business logic for driver registration, login, profile retrieval, and status updates.
    - `DriverService`: Interface defining the contract for driver-related services.

### Repository/Data Access Layer
- **Purpose**: Interacts with the database to perform CRUD operations on the Driver entity.
- **Component**: `DriverRepository`
- **Methods**:
    - `findByAvailableTrue()`: Retrieves all available drivers.
    - `findByPhone(String phone)`: Retrieves a driver by phone number.

---

## API Endpoints

| Method | Endpoint                   | Description                               |
|--------|----------------------------|-------------------------------------------|
| POST   | /api/drivers/register      | Register a new driver                     |
| POST   | /api/drivers/login         | Login for drivers, generates JWT token   |
| GET    | /api/drivers/available     | Retrieve all available drivers            |
| PUT    | /api/drivers/status        | Update driver availability status         |
| GET    | /api/drivers/profile       | Retrieve driver profile information       |


## API Documentation of Driver Module

 [Driver Endpoints](../API_documentation/Driver.md)
 