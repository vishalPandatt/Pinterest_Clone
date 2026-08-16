# Pinterest Clone Application

A full-stack Pinterest clone web application built with Node.js, Express, MongoDB, and EJS templating. This application allows users to create accounts, upload images, organize them into categories, save favorites, and interact with other users' posts.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [Routes & Endpoints](#routes--endpoints)
- [Authentication](#authentication)
- [File Upload Configuration](#file-upload-configuration)
- [Running the Application](#running-the-application)
- [Dependencies](#dependencies)
- [Configuration](#configuration)

---

## Features

### User Authentication
- **User Registration**: Create new user accounts with username, email, password, and full name
- **User Login**: Secure login using Passport.js with local strategy
- **Session Management**: Express session management with flash messages for feedback
- **User Logout**: Secure logout functionality
- **Profile Management**: View user profiles with profile pictures (display pictures)

### Post Management
- **Create Posts**: Upload images with titles, descriptions, and categories
- **View Feed**: Browse all posts from all users in reverse chronological order (newest first)
- **Category Filtering**: Filter posts by category
- **Pin/Save Posts**: Save posts to personal saved collection for later viewing
- **Like System**: Like/unlike posts and see like counts

### Image Upload
- **Multer Integration**: File upload handling with Multer middleware
- **Image Storage**: Store uploaded images in `public/images/uploads/` directory
- **File Validation**: Only image files allowed (jpeg, jpg, png, gif, webp, svg)
- **File Size Limit**: Maximum file size of 15MB per upload
- **Secure Naming**: Random filename generation using crypto for security

### User Profile Features
- **My Posts**: View all posts created by the logged-in user
- **Saved Posts**: Access saved/pinned posts collection
- **Profile Customization**: Display picture for profile customization
- **User Information**: Display full name, username, email on profile

### Additional Features
- **Flash Messages**: Real-time feedback for user actions (success/error messages)
- **Error Handling**: Comprehensive error handling with custom error pages
- **Responsive Design**: EJS templating with CSS styling for responsive UI
- **Timestamps**: Automatic creation and modification timestamps for posts and users

---

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js ~4.16.1
- **Database**: MongoDB (Local instance: `mongodb://127.0.0.1:27017/pinterest`)
- **ODM**: Mongoose ~9.8.1

### Frontend
- **Templating Engine**: EJS ~2.6.1
- **Styling**: CSS (custom stylesheets in `public/stylesheets/`)
- **Static Files**: Express static middleware for serving images and stylesheets

### Authentication & Security
- **Authentication**: Passport.js ~0.7.0
- **Local Strategy**: passport-local ~1.0.0
- **Password Hashing**: passport-local-mongoose ~9.1.0
- **Session Management**: express-session ~1.19.0
- **Flash Messages**: connect-flash ~0.1.1
- **Cookie Parser**: cookie-parser ~1.4.4

### File Upload
- **Multer**: ~2.2.0 (for handling file uploads)

### Development
- **Logging**: Morgan ~1.9.1
- **Error Handling**: http-errors ~1.6.3
- **Debugging**: debug ~2.6.9
- **Development Tool**: Nodemon ~3.1.4 (auto-reload on file changes)

---

## Project Structure

```
pinterest-clone/
│
├── app.js                          # Express application setup and configuration
├── package.json                    # Dependencies and scripts
├── readme.md                       # Project documentation
│
├── bin/
│   └── www                         # Application entry point (server startup)
│
├── routes/
│   ├── index.js                    # Main route handlers (auth, feed, posts)
│   ├── users.js                    # User MongoDB schema and model
│   ├── posts.js                    # Post MongoDB schema and model
│   └── multer.js                   # File upload configuration
│
├── views/
│   ├── index.ejs                   # Login/Registration page
│   ├── feed.ejs                    # Main feed page
│   ├── add.ejs                     # Create new post page
│   ├── pin.ejs                     # Single pin/post detail view
│   ├── profile.ejs                 # User profile page
│   ├── error.ejs                   # Error page
│   └── partials/
│       ├── header.ejs              # Navigation header (included in all pages)
│       └── footer.ejs              # Footer section (included in all pages)
│
├── public/
│   ├── images/
│   │   └── uploads/                # User-uploaded images stored here
│   ├── javascripts/                # Client-side JavaScript files
│   └── stylesheets/
│       └── style.css               # Main CSS styling
```

---

## Installation & Setup

### Prerequisites
- **Node.js**: Version 14 or higher
- **MongoDB**: Local MongoDB instance running on `127.0.0.1:27017`
- **npm**: Node Package Manager

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Pintrest
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Required Directories
```bash
mkdir -p public/images/uploads
```

### Step 4: Ensure MongoDB is Running
```bash
# On Windows
# Start MongoDB service via Services or run mongod directly
mongod

# On Mac (if installed via Homebrew)
brew services start mongodb-community
```

### Step 5: Start the Application

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The application will be available at `http://localhost:3000`

---

## Database Schema

### User Schema

```javascript
{
  username: String (required, unique, trimmed),
  fullname: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  dp: String (display picture, default: 'default-avatar.png'),
  posts: [ObjectId] (references to Post model),
  savedPosts: [ObjectId] (references to saved Post model),
  createdAt: Timestamp (auto-generated),
  updatedAt: Timestamp (auto-generated),
  hash: String (password hash - added by passport-local-mongoose),
  salt: String (password salt - added by passport-local-mongoose)
}
```

**Collections**: Users

---

### Post Schema

```javascript
{
  title: String (required, trimmed),
  description: String (optional, trimmed, default: empty),
  image: String (required, filename of uploaded image),
  user: ObjectId (reference to User model),
  category: String (default: 'General'),
  likes: [ObjectId] (array of user IDs who liked the post),
  createdAt: Timestamp (auto-generated),
  updatedAt: Timestamp (auto-generated)
}
```

**Collections**: Posts

---

## Routes & Endpoints

### Authentication Routes
| Method | Route | Description | Middleware |
|--------|-------|-------------|-----------|
| GET | `/` | Landing page / Login-Register page | None |
| POST | `/register` | Register new user | None |
| POST | `/login` | Login existing user | None |
| GET | `/logout` | Logout user | isLoggedIn |

### Feed & Post Routes
| Method | Route | Description | Middleware |
|--------|-------|-------------|-----------|
| GET | `/feed` | View main feed with all posts | isLoggedIn |
| GET | `/feed?category=CategoryName` | View feed filtered by category | isLoggedIn |
| GET | `/add` | Show post creation form | isLoggedIn |
| POST | `/upload` | Create new post with image | isLoggedIn, upload middleware |
| GET | `/pin/:id` | View specific post details | isLoggedIn |

### User Routes
| Method | Route | Description | Middleware |
|--------|-------|-------------|-----------|
| GET | `/users/profile` | View current user's profile | isLoggedIn |
| GET | `/users/profile/:id` | View another user's profile | isLoggedIn |
| POST | `/users/save/:id` | Save a post to saved collection | isLoggedIn |
| POST | `/users/like/:id` | Like a post | isLoggedIn |

### Middleware
- **isLoggedIn**: Checks if user is authenticated. Redirects to login if not.

---

## Authentication

### Authentication Strategy
- **Type**: Local Strategy (username/password)
- **Library**: Passport.js with passport-local
- **Password Management**: passport-local-mongoose (handles hashing and salting)

### Session Configuration
```javascript
{
  resave: false,           // Don't save if unmodified
  saveUninitialized: false,// Don't create session until modified
  secret: "pinterest_secret_key_12345" // Session encryption key
}
```

### Flash Messages
- **Error Messages**: Displayed when login fails or validation errors occur
- **Success Messages**: Displayed for successful actions (registration, login)
- Accessible in views via `res.locals.error` and `res.locals.success`

### Current User
- User information available in views via `res.locals.currentUser`
- Contains authenticated user's complete profile information

---

## File Upload Configuration

### Multer Configuration
- **Storage Type**: Disk storage
- **Upload Directory**: `./public/images/uploads/`
- **File Naming**: Random hex string + original extension (for security)
- **File Size Limit**: 15MB maximum
- **Allowed File Types**: jpeg, jpg, png, gif, webp, svg
- **Validation**: Both MIME type and file extension validated

### Upload Process
1. User selects image via form
2. Multer validates file type and size
3. File stored with random filename in uploads directory
4. Filename stored in database Post model
5. Image accessible via URL: `/images/uploads/[filename]`

### Security Features
- Crypto-based random filename generation (prevents name collisions)
- File type validation (prevents malicious file uploads)
- File size limit (prevents server storage overflow)
- MIME type checking

---

## Running the Application

### Development Mode
```bash
npm run dev
```
- Uses Nodemon for automatic restart on file changes
- Helpful for development and debugging
- Runs on `http://localhost:3000`

### Production Mode
```bash
npm start
```
- Runs the application with standard Node.js
- Suitable for deployment
- Runs on `http://localhost:3000`

### Accessing the Application
1. Open browser and go to `http://localhost:3000`
2. Create new account or login with existing credentials
3. Browse the feed or create new posts
4. Click on posts to view details and interact

---

## Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ~4.16.1 | Web framework |
| mongoose | ^9.8.1 | MongoDB ODM |
| ejs | ~2.6.1 | Templating engine |
| passport | ^0.7.0 | Authentication middleware |
| passport-local | ^1.0.0 | Local strategy for Passport |
| passport-local-mongoose | ^9.1.0 | Password hashing and serialization |
| express-session | ^1.19.0 | Session management |
| connect-flash | ^0.1.1 | Flash message middleware |
| multer | ^2.2.0 | File upload handling |
| morgan | ~1.9.1 | HTTP request logging |
| cookie-parser | ~1.4.4 | Cookie parsing middleware |
| http-errors | ~1.6.3 | HTTP error handling |
| debug | ~2.6.9 | Debugging utility |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.4 | Auto-restart on file changes |

---

## Configuration

### MongoDB Connection
```javascript
mongoose.connect("mongodb://127.0.0.1:27017/pinterest")
```
- **Host**: 127.0.0.1 (localhost)
- **Port**: 27017 (default MongoDB port)
- **Database**: pinterest

**To change**: Edit `app.js` line with `mongoose.connect()` call

### Session Secret
```javascript
secret: "pinterest_secret_key_12345"
```
- Used for encrypting session data
- **Change in production** for security
- Located in `app.js` session configuration

### View Engine
- **Engine**: EJS (Embedded JavaScript)
- **Views Directory**: `/views`
- Template files use `.ejs` extension

### Static Files
- **Public Directory**: `/public`
- Serves images, CSS, and client-side JavaScript
- Images uploaded to `/public/images/uploads/`

### Port Configuration
- Default port: **3000**
- Configured in `/bin/www` file
- Can be modified via environment variable `PORT`

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `app.js`
- Verify MongoDB is listening on `127.0.0.1:27017`

### File Upload Not Working
- Verify `/public/images/uploads/` directory exists
- Check write permissions on the uploads directory
- Ensure file size is under 15MB
- Verify file is an image format (jpeg, jpg, png, gif, webp, svg)

### Port Already in Use
- Change port in `/bin/www` or use: `PORT=3001 npm start`

### Session/Login Issues
- Clear browser cookies
- Restart the application
- Check MongoDB connection

---

## Future Enhancements

- Email verification for registration
- Password reset functionality
- Social sharing features
- Comment system on posts
- User follow/follower system
- Search functionality
- Image compression
- Rate limiting
- Admin panel
- API documentation (Swagger)
- Unit and integration tests
- Deployment to cloud (Azure, Heroku, AWS)

---

## License

This project is a portfolio/educational project. Feel free to use it as a reference or starting point for your own projects.

---

## Author

**Vishal Pandatt**

For questions or contributions, please reach out or submit pull requests.

---

**Last Updated**: 2026-08-16
**Version**: 1.0.0