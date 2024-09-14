# **Integrated Energy Management System - Full Stack Project** 

This project involves creating an integrated system by connecting four distributed microservices and three MySQL databases. The main purpose of this project is to read random values from a very large file to simulate reading sensors (_produce_) and monitoring them (_consume_). The reading is continuous, and all values are sent asynchronously via RabbitMQ from the producer (_devices microservice_) to the consumer (_monitoring microservice_).

## Microservices Overview
* **Devices (MS + DB)**: Stores sensor information and sends read values to the consumer (_producer microservice_).
* **Monitoring (MS + DB)**: Responsible for capturing sensor values sent by the producer (_consumer microservice_).
* **Users (MS + DB)**: Manages data for employees and administrators.
* **Chat (MS)**: Facilitates communication between the administrator and employees.

## Technical Stack
* **Back End**: Spring REST
* **Front End**: React JS and CSS
* **Chat Feature**: Well-designed chat interface
* **Inter-service Communication**: RabbitMQ
* **Security**: JWT
* **Notifications**: Managed via WebSocket on both the Front End and Back End
* **Virtualization**: Docker
