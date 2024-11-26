
## Setup Instructions

Follow the steps below to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- MongoDB (for the database)

---

### Steps to Run the Project

1. **Clone the Repository**  
   Clone the project repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
Replace <repository-url> with the actual URL of the repository.

Set Up Environment Variables

Navigate to the frontend folder and create a .env file. Add the required environment variables specific to the frontend.
Navigate to the backend folder and create a .env file. Add the required environment variables specific to the backend.
Install Dependencies

Frontend
Navigate to the frontend folder and install the dependencies:

```bash
cd frontend
npm install
```
Backend
Navigate to the backend folder and install the dependencies:

```bash
cd backend
npm install
```
Start the Applications

Frontend
Start the React development server:

```bash
npm start
```
Backend
Start the backend server in development mode:

```bash
npm run dev
```
Access the Application

Frontend: Open http://localhost:3000 in your browser.
Backend: The backend will run on http://localhost:5000 or a port specified in your backend .env file.

### Ensure MongoDB is running locally or use a connection string in the backend .env file as MONGODB_URI to connect to a remote MongoDB instance.
### If you change the backend port, update the frontend .env file to point to the correct backend REACT_APP_API_URL.
