# 📞 Contacts API

> A full-featured RESTful API for managing personal contacts with user authentication, photo uploads, password reset functionality, and OpenAPI documentation.

## 🔗 Live API

Your service is available at:  
➡️ https://nodejs-hw-mongodb-s2km.onrender.com  
(or your custom domain if configured)

## 🚀 Features

- ✅ User registration, login and protected routes
- ✅ JWT-based authentication
- ✅ Full CRUD for contacts
- ✅ File uploads to Cloudinary
- ✅ Pagination, sorting & filtering
- ✅ Password reset via email
- ✅ Swagger documentation at `/api-docs`
- ✅ MongoDB with Mongoose
- ✅ Input validation via Joi
- ✅ Error handling middleware
- ✅ Modern project structure with MVC
- ✅ Environment variable support via `.env`

---

## 📦 Tech Stack

- **Node.js**, **Express**
- **MongoDB** + **Mongoose**
- **Cloudinary** for image storage
- **Joi** for validation
- **bcrypt** for password hashing
- **JWT** for auth
- **Nodemailer** for email
- **Swagger + Redoc** for docs

---


---

## 🔐 .env Variables

See `.env.example` for required environment variables:

```env
PORT=
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL= # used in reset password email
```
---


---

## 🧪 Available Scripts
# Run in development
npm run dev

# Run in production
npm start

# Generate OpenAPI docs (Redoc)
npm run docs

---


---

🧰 API Endpoints (Examples)

🔐 Auth
POST /auth/register
POST /auth/login
POST /auth/send-reset-email
POST /auth/reset-pwd

👤 Contacts 
GET /contacts
GET /contacts/:contactId
POST /contacts (supports file upload)
PATCH /contacts/:contactId
DELETE /contacts/:contactId

Supports:

?page=1&perPage=10
?sortBy=name&sortOrder=asc
?isFavourite=true&type=personal

---


---

📸 Photo Upload

You can upload a contact photo in POST /contacts
Images are stored on Cloudinary
Response includes photo URL

---


---
📑 API Documentation

Visit: [https://contacts-api-b5n1.onrender.com/api-docs/]
Swagger UI powered by swagger-ui-express
---


---
🧪 Testing (Postman etc.)

All endpoints tested and documented.
Feel free to import the Swagger JSON or use /api-docs for testing.

