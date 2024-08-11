# EventConnect

EventConnect is a web application designed to streamline the planning and attending of birthday parties. This README provides an overview of the project structure, including the file and folder organization, and how to navigate through the codebase.

## Table of Contents
- [Project Overview](#project-overview)
- [File and Folder Structure](#file-and-folder-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Configuration Files](#configuration-files)
  - [Public Assets](#public-assets)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [License](#license)

## Project Overview
EventConnect allows users to create accounts, plan events, manage guest lists, and send invitations. Attendees can RSVP, search for travel and lodging options near the event venue, and receive notifications about the event. The application uses Node.js and Express for the backend, React for the frontend, and MongoDB as the database.

## File and Folder Structure

### Backend
The backend of EventConnect is responsible for handling the server-side logic, including API endpoints, authentication, and database interactions.

- **`/event-management-backend`**
  - **`/config`**: Contains configuration files for database connections and environment variables.
  - **`/controllers`**: Houses the controller files that handle incoming requests and business logic.
  - **`/models`**: Includes the Mongoose models that define the database schema for entities like users, events, and RSVPs.
  - **`/routes`**: Contains the Express route files that define the API endpoints.
  - **`/services`**: Includes service files that encapsulate business logic, such as sending emails or interacting with external APIs.
  - **`/middleware`**: Middleware functions for handling authentication, error handling, and request validation.

### Frontend
The frontend of EventConnect is built with React and is responsible for the user interface and client-side logic.

- **`/my-app/src`**
  - **`/components`**: Contains React components that make up the UI. This includes pages like the registration, login, event management, and RSVP pages.
    - **`/Organizer`**: Components related to organizer-specific functionalities, such as creating and managing events.
    - **`/Attendee`**: Components related to attendee-specific functionalities, such as viewing and RSVPing to events.
  - **`/utils`**: Utility functions and Axios instances for making API requests and managing application-wide state or configuration.
  - **`/contexts`**: Context files for managing global state using React's Context API, such as user authentication.
  - **`/assets`**: Static assets like images and logos used in the application.

### Configuration Files
These files are critical for configuring and running the application in different environments.

- **`.env`**: Environment variables for sensitive information such as API keys and database connections.
- **`package.json`**: Lists the dependencies, scripts, and metadata for both the frontend and backend of the application.
- **`webpack.config.js`**: Configuration file for webpack, if used, to bundle and manage assets for the frontend.

### Public Assets
This directory contains static files that are directly served by the server.

- **`/public`**: Static assets such as the index.html file, icons, and images that are served directly to the client.

## Installation and Setup

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB running locally or on a cloud service like MongoDB Atlas.

