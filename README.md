# EventEase

Simplify your events — whether you're attending or organizing.

Welcome to the EventEase repository! This is a web application designed to make life easier for both event organizers and attendees. It provides a simple place to create events, manage bookings, and share feedback without any hassle.

---

## Project Overview

EventEase is a full-stack application that connects people who want to host events with people who want to attend them.

- For Organizers: You get a dashboard to create events, keep track of who is coming, and see what people are saying about your events.
- For Attendees: You can easily browse upcoming events, book tickets, and leave ratings or comments after the event.

---

## Tech Stack

This project was built using reliable and modern tools to ensure it runs smoothly:

- Backend: Java (JDK 17 or higher) and Spring Boot (Spring Web, Spring Data JPA)
- Database: MySQL
- Frontend: HTML5, CSS3, and JavaScript
- Build Tool: Maven
- IDE: IntelliJ IDEA, Eclipse, or VS Code

---

## Key Features

- Secure Login: Safe and distinct login options for Attendees and Organizers.
- Custom Dashboards: Separate views tailored to what you need to do.
- Event Management: Organizers can easily add, update, or remove events.
- Booking System: Attendees can view details and book tickets instantly.
- Smart Checks: The system prevents you from accidentally booking the same ticket twice.
- Feedback System: Attendees can rate events, and organizers can see those stats in real-time.
- Live Stats: Organizers can see a quick count of their total events, attendees, and feedback.

---

## Things You Need Installed

Before you run the code, make sure you have these installed on your computer:

1. Java Development Kit (JDK): Version 17 or newer.
2. Maven: To manage the backend dependencies.
3. MySQL Server: To store all the data.
4. Git: To download the code.
5. A Web Browser: Chrome, Firefox, or Edge work great.

---

## How to Run It

Follow these steps to get EventEase running on your local machine.

### Step 1: Download the Code
Open your terminal or command prompt and run these commands:

```bash
git clone [https://github.com/RajasLokhande/EventEase.git](https://github.com/RajasLokhande/EventEase.git)
cd EventEase
```
<hr>
### Step 2: Set Up the Database 🗄️

1. Open **MySQL Workbench** or your command line.
2. Create a new database (e.g., named `eventease_db`).
3. Open the backend project in your IDE.
4. Navigate to `src/main/resources/application.properties`.
5. Update the settings to match your local MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/eventease_db
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
```
<hr>

### Step 3: Start the Backend 🚀

You can start the server using one of two methods:

* **Option A (Recommended):** Open `EventEaseApplication.java` in your IDE and click **Run**.
* **Option B (Terminal):** Navigate to the main backend folder and run:
    ```bash
    mvn spring-boot:run
    ```

### Step 4: Open the Frontend 🌐

1. Navigate to the `FrontEnd` folder in the project files.
2. Open `index.html` in your web browser.

> **Tip:** For the best experience and to ensure API connections work smoothly, we recommend using the **Live Server** extension in VS Code (runs on localhost).


