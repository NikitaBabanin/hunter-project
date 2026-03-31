# Hunter Industries: IoT Backend Assessment

## Project Overview
This project is a lightweight backend service built with **Node.js, TypeScript, and Express**. I chose this stack because it is fast to bootstrap and provides the type safety necessary for a reliable IoT synchronization system. 

While this is a minimalist implementation for a 1-hour assessment, the architecture is designed with **Separation of Concerns** in mind. My choice of architecture depends on the project's complexity:

* **For Light/CRUD Projects:** I prefer a **Service-Repository** pattern. It keeps the codebase flat and easy to navigate when the primary goal is simple data persistence.
* **For Complex Domain Logic:** I would transition to **Hexagonal Architecture (Ports and Adapters)**. This ensures the core business logic remains isolated from external dependencies like databases or third-party APIs.
* **Production Scale:** In a full-scale environment, I would likely use **NestJS** to take advantage of its modularity, dependency injection, and built-in support for microservices.

---

## How to run the project

### Prerequisites
- **Node.js:** v22.15.0 or higher (required for native ESM and watch mode support).
- **npm:** v10 or higher.

### Installation
1. Clone the repository.
2. Install the necessary dependencies:
   ```bash
   npm install
3. Run the server:
   ```bash
   npm run dev

---

## Project Structure

### `src/`
The root of the application logic. 

* ### `domain/`
    Contains all **Interfaces and Types**. Isolating our data contracts here ensures that the entire project has a single source of truth for our entities, preventing "leaky abstractions."
* ### `services/`
    This is the "Brain" of the application. It handles the **Business Logic**, specifically the state management and versioning for the devices. Keeping logic here makes the code easier to test and keeps the API layer thin.
* ### `api/`
    The entry point for our routes. These controllers handle request parsing and response delivery, delegating the actual state transitions to the service layer.
* ### `middleware/`
    Contains **Framework Infrastructure** like the global error handler. This isolates cross-cutting concerns—like centralized error logging or request validation—from our business logic, ensuring a cleaner and more resilient request-response pipeline.

---

## Key Scenario: Handling Offline Devices
The core challenge was ensuring that an offline device only executes the **latest** command upon reconnection, ignoring stale or duplicate instructions.

### The "Device Shadow" Strategy
I implemented a **State-Based Shadow** pattern (similar to AWS IoT Shadows). Instead of a simple message queue, we maintain a `desired` state and a `reported` state.

1.  **Atomic Overwrites:** When a user sends a command while a device is offline, the new command **completely overwrites** the current `desired` state in the service. 
2.  **Version Tracking:** Every time the `desired` state changes, a `version` number is incremented.
3.  **Synchronization on Check-in:** When the device eventually reconnects and sends its `telemetry` (heartbeat), the API response includes the latest `desired` state. 
4.  **Result:** If a device is offline and the user sends Command A followed by Command B, Command A is deleted from the cloud. The device only ever sees Command B when it wakes up.

---

## Future Improvements
With more than 60 minutes, I would implement the following:
* **Persistence:** Move from an in-memory `Map` to a persistent database like **PostgreSQL** or **DynamoDB** to ensure state survives server restarts.
* **Authentication:** Add JWT-based auth to ensure only authorized users can send commands to specific devices.
* **WebSockets/MQTT:** Implement a push-based mechanism so that online devices receive commands instantly without waiting for a telemetry heartbeat.
* **Validation:** Use a library like `Zod` to strictly validate incoming telemetry and command payloads at the API boundary.

---

## AI Assistance & Tools
 **Architectural Validation:** Brainstormed the "Device Shadow" pattern to ensure it accurately reflected industry standards for unreliable connectivity.
