# LinkedIn Clone

A full-stack LinkedIn clone built with React, TypeScript, Node.js, and MongoDB.

## 🔗 Live Demo

- Frontend: [https://linkedinclone-frontend.vercel.app/](https://linkedinclone-frontend.vercel.app/)
- Backend: [https://linkedin-clone-backend.vercel.app/](https://linkedin-clone-backend.vercel.app/)

## ⚙️ Tech Stack

### Frontend

- React with TypeScript
- TailwindCSS for styling
- React Query for data fetching
- Axios for API calls
- React Router for routing
- Lucide React for icons

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image uploads
- CORS for cross-origin requests
- MailTrap for custom mails (Eg: User Welcome upon signup)

## 🚀 Features

### Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt

### Profile

- View/Edit profile
- Add/Edit experience
- Add/Edit education
- Profile picture upload
- Custom headline

### Posts

- Create text/image posts
- Like/Unlike posts
- Comment on posts
- Delete own posts
- Image upload support

### Connections

- Send connection requests
- Accept/Reject requests
- View connections
- Remove connections

### Notifications

- Real-time notifications
- Connection request notifications
- Post like notifications
- Comment notifications

## 🛠️ Installation & Setup

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account
- Git

### Frontend Setup

```bash
git clone https://github.com/yourusername/linkedin-clone
cd linkedin-clone/frontend
npm install
```

Create `.env` file:

```plaintext
VITE_API_URL=http://localhost:5000/api/v1
```

### Backend Setup

```bash
cd ../backend
npm install
```

Create `.env` file:

```plaintext
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
MAILTRAP_TOKEN=YOUR_TOKEN
EMAIL_FROM=FROM_EMAIL_ADDRESS
EMAIL_FROM_NAME=YOUR_NAME
```

### Running the App

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## 📁 Project Structure

### Frontend

```
frontend/
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities and configs
│   ├── types.ts      # TypeScript types
│   └── App.tsx       # Main app component
```

### Backend

```
backend/
├── controllers/     # Route controllers
├── models/          # MongoDB models
├── emails/          # Email Templates
├── routes/          # API routes
├── middleware/      # Custom middleware
├── lib/             # Utilities
└── server.ts        # Main server file
```

## 📝 API Documentation

### Auth Routes

- POST `/api/v1/auth/signup` - Register new user
- POST `/api/v1/auth/login` - Login user
- POST `/api/v1/auth/logout` - Logout user
- GET `/api/v1/auth/me` - Get current user

### Post Routes

- GET `/api/v1/posts` - Get all posts
- POST `/api/v1/posts` - Create post
- DELETE `/api/v1/posts/:id` - Delete post
- POST `/api/v1/posts/:id/like` - Like/Unlike post
- POST `/api/v1/posts/:id/comment` - Add comment

### Connection Routes

- GET `/api/v1/connections` - Get user connections
- POST `/api/v1/connections/:userId` - Send connection request
- PUT `/api/v1/connections/:userId` - Accept connection request
- DELETE `/api/v1/connections/:userId` - Remove connection

## 👥 Contributing

Feel free to fork this repository and submit pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Lucide Icons](https://lucide.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
