const express = require('express'); // Express for routing and middleware management
const path = require('path'); // Path to handle file paths
const helmet = require('helmet'); // Import Helmet for security
const morgan = require('morgan'); // Import Morgan for logging
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
// const compression = require('compression'); // Import compression middleware
const cors = require('cors'); // Import CORS
// const cookieParser = require('cookie-parser'); // Import cookie-parser middleware


const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;


 app.use(cors());

// Import middlewares
const logger = require('./middlewares/logger'); // Import logger middleware
const errorHandler = require('./middlewares/errorHandler'); // Import error handler middleware
//const { NotFoundError, UnauthorizedError, BadRequestError } = require('./middlewares/customErrors');

// Use Helmet Middleware 3 for security best practices
app.use(helmet()); // Enables security headers

// Enable CORS middleware 4 (Allow requests from all origins)
app.get('/api/test-cors', (req, res) => {
  console.log("CORS test route hit!"); // Add this to debug
  res.json({ message: "CORS is working!" });
});

// // Use Morgan for logging HTTP requests
 app.use(morgan('dev')); // Logs HTTP requests in a concise format



// Rate limiting middleware - Limits each IP to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter); // Apply rate limiting globally

// Middleware to handle JSON and URL-encoded data in POST requests
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// Use logger middleware for all incoming requests
app.use(logger); // Log each request


// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes'); // Import the API routes for login and register functionality
app.use('/api', apiRoutes); // Mount the API routes on /api path

// Serve login.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')); // Serve the login page at root URL
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html')); // Serve the login page at root URL
});

// Serve dashboard.html when user is authenticated
app.get('/api/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // Serve the dashboard HTML file
});

app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); // Serve the dashboard HTML file
});

// Serve about.html when navigating to /api/about
app.get('/api/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html')); // Serve the about page
});

// Serve destinations.html when navigating to /api/destinations
app.get('/api/blog1', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'blog1.html')); // Serve the destinations page
});

// Serve register.html when user needs to register
app.get('/api/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html')); // Serve the register HTML file
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});


// Serve destinations.html when navigating to /api/destinations
app.get('/api/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'blog.html')); // Serve the destinations page
});

// Serve gallery.html when navigating to /api/gallery
app.get('/api/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'gallery.html')); // Serve the destinations page
});

app.get('/api/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html')); // Serve the destinations page
});

// Serve book.html when navigating to /api/book
app.get('/api/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'menu.html')); // Serve the Book Now page
});

// Serve cart.html when navigating to /api/book
app.get('/api/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cart.html')); // Serve the Book Now page
});

// Serve testimonials.html when navigating to /api/testimonials
app.get('/api/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'terms.html')); // Serve the Testimonials page
});

// Use error handler middleware for catching and handling errors
app.use(errorHandler); // Handle errors globally

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});