
---

### ✅ Sections We'll Include:

1. 📦 Project Overview
2. 🚀 Features
3. 📁 Folder Structure
4. ⚙️ Installation & Running Locally
5. 🔐 Environment Variables (`.env`)
6. 🌐 API Endpoints
7. 🧪 Postman Testing
8. 🗃️ MongoDB Integration
9. 🛡️ Middleware and Route Protection
10. 📦 Deployment Notes (Vercel-ready if applicable)

---

### ✅ Let's Begin: Basic README.md Skeleton

Here’s the initial version with sections 1–5:

---

# 📝 Notes App – Backend (Express + MongoDB)


🔗 **Live Demo:** [Notes App](https://notes-app-frontend-l6mi.vercel.app/)

This is the **backend API** for the full-stack Notes Application. It provides secure, RESTful endpoints for user registration, login, and managing notes. It’s built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

* 🔐 JWT-based Authentication (stored in HTTP-only cookies)
* 👤 User Registration & Login
* 📝 CRUD operations for Notes
* 🔐 Protected Routes with Middleware
* 🌍 CORS-enabled for frontend communication
* ☁️ MongoDB database integration (local or Atlas)
* 🧪 Tested with Postman

---

## 📁 Folder Structure

```
backend/
├── Controllers/
│   ├── authController.js       # Login, Register
│   └── notesController.js      # Notes CRUD logic
├── Models/
│   ├── userModel.js
│   └── notesModel.js
├── Middlewares/
│   └── authHandler.js          # JWT auth middleware
├── Routes/
│   ├── authRoute.js
│   └── notesRoute.js
├── server.js                   # Main server entry point
├── vercel.json                 # Vercel deployment config (if applicable)
├── .env                        # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Getting Started – Local Setup

### 1. 📦 Install Dependencies

```bash
npm install
```

### 2. 🔐 Create a `.env` file

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notes-app  # or MongoDB Atlas URL
JWT_SECRET=yourSuperSecretKey
COOKIE_EXPIRE=5d
```

> ✅ Ensure MongoDB is running locally or you have a valid Atlas URI.

### 3. ▶️ Start the Server

```bash
npm start
```

Your server should now run at:
📍 `http://localhost:5000`

---

---

## 🌐 API Endpoints

The backend exposes the following **RESTful API routes**:

### 🔐 Auth Routes (`/users`)

| Method | Endpoint          | Description           | Auth Required |
| ------ | ----------------- | --------------------- | ------------- |
| POST   | `/users/register` | Register new user     | ❌ No          |
| POST   | `/users/login`    | Login user            | ❌ No          |
| GET    | `/users/logout`   | Logout user           | ✅ Yes         |
| GET    | `/users/profile`  | Get current user info | ✅ Yes         |

---

### 📝 Notes Routes (`/notes`)

All `/notes` routes require a valid login session via cookie-based JWT token.

| Method | Endpoint     | Description                    |
| ------ | ------------ | ------------------------------ |
| GET    | `/notes`     | Get all notes for current user |
| POST   | `/notes`     | Create a new note              |
| PATCH  | `/notes/:id` | Update a note                  |
| DELETE | `/notes/:id` | Delete a note                  |

---

## 🧪 Postman Testing

### ✅ Step-by-step Testing in Postman

1. **Base URL**: `http://localhost:5000`

---

### 🟢 1. Register a User

* **POST** `/users/register`
* **Body (JSON)**:

```json
{
  "username": "john123",
  "email": "john@example.com",
  "password": "yourPassword"
}
```

---

### 🟢 2. Login User

* **POST** `/users/login`
* **Body (JSON)**:

```json
{
  "email": "john@example.com",
  "password": "yourPassword"
}
```

> 🧠 This sets an `httpOnly` cookie automatically.

---

### 🔒 3. Access Protected Routes (after login)

* **GET** `/notes`
* Must include credentials (cookie automatically managed in Postman after login).

---

### 📝 4. Create a Note

* **POST** `/notes`
* **Body (JSON)**:

```json
{
  "title": "My First Note",
  "content": "This is the content of the note."
}
```

---

### ✏️ 5. Edit a Note

* **PATCH** `/notes/:id`
* **Body (JSON)**:

```json
{
  "title": "Updated Note",
  "content": "Updated content."
}
```

---

### ❌ 6. Delete a Note

* **DELETE** `/notes/:id`

---

## 🗃️ MongoDB Integration

This app uses **Mongoose** to connect and interact with MongoDB.

* You can connect to:

  * **Local MongoDB**: e.g. `mongodb://localhost:27017/notes-app`
  * **MongoDB Atlas** cloud DB: use connection string with credentials
* Connection code is in `server.js`:

```js
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
```

---

## 🛡️ Middleware

* `authHandler.js`: Validates JWT from cookies and attaches user to `req.user`
* Used on all protected routes (`/notes`, `/users/profile`, etc.)

---

## 🚀 Deployment (Vercel)

If you plan to deploy this backend on **Vercel**, you already have:

* `vercel.json` file to configure serverless route
* Setup `JWT_SECRET`, `MONGO_URI`, `COOKIE_EXPIRE` in Vercel's Environment Settings
* Make sure to set:

  * `Allow CORS` from your frontend URL
  * `Credentials: true` enabled in CORS config

---

