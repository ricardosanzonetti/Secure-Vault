# Secure Vault

Secure Vault is a MERN stack application focused on secure note management with JWT authentication and encrypted data handling.

---

# Features

- User registration and login
- JWT authentication
- Protected routes
- Create secure notes
- Edit secure notes
- Delete secure notes
- MongoDB integration
- AES encrypted notes
- Responsive cyberpunk-inspired UI

---

# Tech Stack

## Frontend

- React
- Vite
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- crypto-js

---

# Screenshots

## Register Page

![Register](./screenshots/register.png)

---

## Create Secure Note

![Create Note](./screenshots/create-note.png)

---

## Edit Secure Note

![Edit Note](./screenshots/edit-note.png)

---

## MongoDB Database

![MongoDB](./screenshots/mongodb.png)

---

## Encrypted Notes in MongoDB

![Encrypted Notes](./screenshots/encrypted-db.png)

---

## API Testing with Postman

![Postman](./screenshots/postman.png)

---

## Backend Authentication Controller

![Backend Code](./screenshots/backend-code.png)

---

# Installation

## Clone repository

```bash
git clone https://github.com/ricardosanzonetti/Secure-Vault.git
## Install frontend dependencies

```bash
cd client
npm install
npm run dev
```

## Install backend dependencies

```bash
cd server
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside `/server`

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
AES_SECRET=your_secret
```

## Security

- Password hashing using bcryptjs
- JWT authentication
- AES encryption for notes
- Protected API routes

## Future Improvements

- Search notes
- Categories and tags
- Docker support
- Cloud deployment
- Better mobile responsiveness
