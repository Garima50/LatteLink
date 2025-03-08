// import moduless
const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to handle errors (response)
function handleError(res, errorCode, message) {
    res.statusCode = errorCode;
    res.write(message);
    res.end();
}

// Create the server
const server = http.createServer((req, res) => {
    const ext = path.extname(req.url);
    // set MIME types
    const contentTypeMap = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    // Handle static files (CSS, JS, images)
    if (contentTypeMap[ext]) {
        let staticFilePath = path.join(__dirname, 'public', req.url);

        // Check if the request is for the css or img folder and update the path
        if (req.url.startsWith('/css/')) {
            staticFilePath = path.join(__dirname, 'public', 'css', path.basename(req.url));
        } else if (req.url.startsWith('/img/')) {
            staticFilePath = path.join(__dirname, 'public', 'img', path.basename(req.url));
        }

        fs.readFile(staticFilePath, (err, data) => {
            if (err) {
                handleError(res, 404, 'Static file not found');
            } else {
                res.setHeader('Content-Type', contentTypeMap[ext] || 'application/octet-stream');
                res.statusCode = 200;
                res.write(data);
                res.end();
            }
        });
        return;
    }

    // Handle routes
    if (req.method === 'GET') {
        const routes = {
            '/': 'index.html',
            '/contact': 'contact.html',
            '/about': 'about.html',
            '/gallery': 'gallery.html',
            '/blog': 'blog.html',
            '/blog1': 'blog1.html',
            '/menu': 'menu.html',
            '/terms': 'terms.html',
            '/cart': 'cart.html',
            '/login': 'login.html',
            '/register': 'register.html'
        };

        if (routes[req.url]) {
            const pagePath = path.join(__dirname, 'public', routes[req.url]);
            fs.readFile(pagePath, 'utf8', (err, data) => {
                if (err) {
                    handleError(res, 500, `Error loading ${req.url} page`);
                } else {
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 200;
                    res.write(data);
                    res.end();
                }
            });
        } else {
            handleError(res, 404, 'Page not found');
        }
    } else if (req.method === 'POST') {
        if (req.url === '/register') { // for register page
            let body = '';

            // Collect request body data
            req.on('data', chunk => {
                body += chunk.toString(); // Collect the request body
            });

            req.on('end', () => {
                try {
                    // Parse the JSON data
                    const userData = JSON.parse(body);

                    // Validate the user data
                    if (!userData.username || !userData.email || !userData.password) {
                        handleError(res, 400, 'Missing required fields');
                        return;
                    }

                    // Check if user already exists
                    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
                        let users = [];
                        if (data) {
                            try {
                                users = JSON.parse(data);
                            } catch (err) {
                                handleError(res, 500, 'Error parsing users file');
                                return;
                            }
                        }

                        // Check for existing user
                        const userExists = users.some(user => user.username === userData.username || user.email === userData.email);
                        if (userExists) {
                            handleError(res, 400, 'Username or email already exists!');
                            return;
                        }

                        // Add the new user
                        users.push(userData);

                        // Save the updated user data to the file
                        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (err) => {
                            if (err) {
                                handleError(res, 500, 'Error saving user data');
                                return;
                            }

                            res.statusCode = 200;
                            res.write('Registration successful!');
                            res.end();
                        });
                    });
                } catch (err) {
                    handleError(res, 400, 'Invalid JSON data');
                }
            });
        } else if (req.url === '/login') {
            let body = '';

            // Collect request body data
            req.on('data', chunk => {
                body += chunk.toString(); // Collect the request body
            });

            req.on('end', () => {
                try {
                    // Parse the JSON data
                    const loginData = JSON.parse(body);

                    // Validate the login data
                    if (!loginData.username || !loginData.password) {
                        handleError(res, 400, 'Missing username or password');
                        return;
                    }


                    // Check if user exists and validate password
                    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
                        if (err) {
                            handleError(res, 500, 'Error reading users file');
                            return;
                        }

                        let users = [];
                        if (data) {
                            try {
                                users = JSON.parse(data);
                            } catch (err) {
                                handleError(res, 500, 'Error parsing users file');
                                return;
                            }
                        }

                        // Find user by username or email
                        const user = users.find(u => u.username === loginData.username || u.email === loginData.username);

                        if (!user) {
                            handleError(res, 400, 'User not found');
                            return;
                        }

                        // Validate password
                        if (user.password !== loginData.password) {
                            handleError(res, 400, 'Incorrect password');
                            return;
                        }

                        // Successful login
                        res.statusCode = 200;
                        res.write('Login successful!');
                        res.end();
                    });
                } catch (err) {
                    handleError(res, 400, 'Invalid JSON data');
                }
            });
        } else {
            handleError(res, 404, 'Route not found');
        }
    } else {
        handleError(res, 405, 'Method Not Allowed');
    }
});

// Start the server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
