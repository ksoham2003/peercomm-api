# PeerComm E-Commerce API

PeerComm is a Node.js, Express, and MongoDB REST API for a small peer-to-peer e-commerce backend. It supports user registration/login, cookie-based JWT authentication, product creation with ImageKit image uploads, product listing, product lookup, updates, and deletion.

## Tech Stack

- Node.js with ES modules
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Cookie parser
- Express Validator
- Multer memory uploads
- ImageKit image hosting
- Bcrypt password hashing

## Project Structure

```text
server.js
src/
  app.js
  config/
    db.js
    env.js
    imageKit.js
  controllers/
    auth.controller.js
    product.controller.js
  middlewares/
    auth.middleware.js
    upload.middleware.js
    validate.middleware.js
  models/
    product.model.js
    user.model.js
  routes/
    auth.routes.js
    product.routes.js
  utils/
    appError.js
    asyncHandler.js
    jwt.js
  validators/
    auth.validator.js
    product.validator.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud - MongoDB Atlas recommended)
- ImageKit account (for image uploads)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/peercomm-api.git
   cd peercomm-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file** with your values:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/peercomm
   JWT_SECRET=your-secret-key-here
   IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
   IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-namespace
   ```

5. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

6. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

7. **Test the API:**
   ```bash
   curl http://localhost:3000
   # Expected response: {"message":"peerComm api is running..."}
   ```

---

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "confirmPassword": "secure123"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "active": true,
    "createdAt": "2026-06-18T10:30:00Z"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "active": true
  }
}
```

### Product Endpoints

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Product Name
description=Product Description
price=9999
category=Electronics
images=<file1>, <file2>, ... (max 5 files)
```

**Response (201):**
```json
{
  "message": "Product added successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Product Name",
    "description": "Product Description",
    "price": 9999,
    "category": "Electronics",
    "images": ["https://ik.imagekit.io/..."],
    "seller": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    },
    "createdAt": "2026-06-18T10:30:00Z"
  }
}
```

#### Get All Products
```http
GET /api/products?category=Electronics&page=1&limit=10
```

**Query Parameters:**
- `category` (optional): Filter by product category
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10, max: 50): Items per page

**Response (200):**
```json
{
  "message": "products fetched successfully",
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "products": [...]
}
```

#### Get My Products
```http
GET /api/products/my
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "products fetched successfully",
  "count": 5,
  "products": [...]
}
```

#### Get Single Product
```http
GET /api/products/507f1f77bcf86cd799439012
```

**Response (200):**
```json
{
  "message": "Product found successfully",
  "product": {...}
}
```

#### Update Product
```http
PUT /api/products/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: multipart/form-data

name=Updated Name
description=Updated Description
price=8999
category=Fashion
images=<file1>, <file2> (optional)
```

**Response (200):**
```json
{
  "message": "product updated successfully",
  "product": {...}
}
```

#### Delete Product
```http
DELETE /api/products/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "product deleted successfully"
}
```

### ImageKit Endpoints

#### Get Upload Token
```http
GET /api/imagekit/auth
```

**Response (200):**
```json
{
  "token": "token_string",
  "expire": 1234567890,
  "publicKey": "your_public_key",
  "signature": "signature_string"
}
```

---

## Product Categories

Supported categories:
- Electronics
- Fashion
- Home
- Health
- Beauty
- Sports
- Toys
- Groceries
- Automotive
- Books
- Others

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in httpOnly cookies after login/registration.

**Secure Cookie Flags:**
- `httpOnly`: Prevents XSS attacks by making cookie inaccessible to JavaScript
- `Secure`: Only sent over HTTPS in production
- `sameSite: Strict`: Prevents CSRF attacks
- `maxAge`: 7 days (604,800,000 ms)

**Protected Routes:**
All routes requiring authentication must include the JWT cookie (automatically sent by browser).

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description here"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `404`: Not Found
- `500`: Internal Server Error

### Example Error Responses

**Invalid Email:**
```json
{
  "success": false,
  "message": "Invalid Email"
}
```

**Email Already Exists:**
```json
{
  "success": false,
  "message": "Email already Exists!"
}
```

**Unauthorized Access:**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

**Product Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Troubleshooting

### Server Won't Start
- Check if MongoDB is running: `mongod`
- Verify PORT is not already in use
- Check .env file has all required variables
- Check logs for error messages

### Authentication Issues
- Ensure cookie is being sent with requests
- Check JWT_SECRET is same across all instances
- Clear cookies if getting "Unauthorized" unexpectedly
- Verify user exists in database

### Image Upload Issues
- Check ImageKit credentials in .env
- Verify file size is within limits
- Check multer upload middleware configuration
- Ensure IMAGEKIT_URL_ENDPOINT is correct

### Database Connection Errors
- Check MongoDB connection string in MONGODB_URI
- Verify MongoDB service is running
- Check network connectivity for cloud MongoDB (Atlas)
- Verify credentials in connection string

---

## Security Best Practices

1. **Never commit .env file** - Use .env.example as template
2. **Use strong JWT_SECRET** - Generate with crypto module (minimum 32 characters)
3. **Enable HTTPS in production** - Required for secure cookies
4. **Validate all user inputs** - Already implemented with express-validator
5. **Use environment variables** - Never hardcode secrets
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Implement rate limiting** - Prevent brute force attacks (recommended future enhancement)
8. **Use strong passwords** - Minimum 6 characters enforced

---

## Performance Considerations

1. **Pagination** - Use page and limit parameters for large datasets
2. **Indexes** - MongoDB indexes are created on unique/frequently queried fields
3. **Password Hashing** - Bcrypt with salt rounds = 10 (secure, slightly slower)
4. **Query Optimization** - Only required fields are selected in queries
5. **Image Compression** - ImageKit handles automatic image optimization

---

## Future Enhancements

- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request logging (Morgan)
- [ ] Implement Redis caching
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Unit tests with Jest
- [ ] Integration tests
- [ ] CI/CD with GitHub Actions
- [ ] Docker containerization
- [ ] Logout endpoint with token revocation
- [ ] Product reviews and ratings

---

## Contributing

This is a peer-review assignment. For improvements and bug fixes, please:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with meaningful commits
3. Submit a pull request with detailed description
4. Ensure all tests pass before submitting

---

## License

This project is part of the Kodex Program at Sheryians Coding School.

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
```

### 3. Run The Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Default base URL:

```text
http://localhost:3000
```

## Authentication

Authentication uses a JWT stored in a cookie named `token`.

After successful register or login, the server sets:

```http
Set-Cookie: token=<jwt>
```

Protected routes read this cookie through `authMiddleware`. When calling protected APIs from Postman, Thunder Client, Axios, or a browser, make sure cookies are enabled and sent with the request.

## Common Response Shapes

### Success

Most success responses include a `message` and the requested data:

```json
{
  "message": "Login successfully",
  "user": {}
}
```

### Error

The global error handler returns:

```json
{
  "success": false,
  "message": "Error message"
}
```

Unknown routes return:

```json
{
  "success": false,
  "message": "Route not Found!"
}
```

## API Summary

| Method | Endpoint | Protected | Description |
| --- | --- | --- | --- |
| GET | `/` | No | API health check |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login user and set token cookie |
| POST | `/api/products` | Yes | Create a product |
| GET | `/api/products` | No | Get all products, optionally filtered by category |
| GET | `/api/products/my` | Yes | Get products created by logged-in user |
| GET | `/api/products/:id` | No | Get one product by id |
| PUT | `/api/products/:id` | Yes | Update a product for the logged-in user |
| DELETE | `/api/products/:id` | Yes | Delete a product for the logged-in user |

## Root API

### GET `/`

Checks whether the API is running.

Protected: No

Request body: None

Success response: `200 OK`

```json
{
  "message": "peerComm api is running..."
}
```

## Auth APIs

### POST `/api/auth/register`

Registers a new user, hashes the password using the user model pre-save hook, generates a JWT, and stores it in the `token` cookie.

Protected: No

Content-Type:

```http
application/json
```

Request body:

```json
{
  "name": "Ankur Kumar",
  "email": "ankur@example.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

Validation rules:

| Field | Required | Rules |
| --- | --- | --- |
| `name` | Yes | Minimum 3 characters |
| `email` | Yes | Must be valid email and unique |
| `password` | Yes | Minimum 6 characters |
| `confirmPassword` | Yes | Must match `password` |

Success response: `200 OK`

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "665f1234567890abcdef1234",
    "name": "Ankur Kumar",
    "email": "ankur@example.com",
    "password": "$2b$10$hashedPassword",
    "active": true,
    "createdAt": "2026-05-30T10:00:00.000Z",
    "updatedAt": "2026-05-30T10:00:00.000Z",
    "__v": 0
  }
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Invalid input |
| 400 | Email already exists |
| 400 | Passwords do not match |

### POST `/api/auth/login`

Logs in a user, compares the password with the stored bcrypt hash, generates a JWT, and stores it in the `token` cookie.

Protected: No

Content-Type:

```http
application/json
```

Request body:

```json
{
  "email": "ankur@example.com",
  "password": "secret123"
}
```

Validation rules:

| Field | Required | Rules |
| --- | --- | --- |
| `email` | Yes | Must be valid email |
| `password` | Yes | Cannot be empty |

Success response: `200 OK`

```json
{
  "message": "Login successfully",
  "user": {
    "_id": "665f1234567890abcdef1234",
    "name": "Ankur Kumar",
    "email": "ankur@example.com",
    "password": "$2b$10$hashedPassword",
    "active": true,
    "createdAt": "2026-05-30T10:00:00.000Z",
    "updatedAt": "2026-05-30T10:00:00.000Z",
    "__v": 0
  }
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Validation failed |
| 401 | Invalid email or password |
| 404 | Invalid email or password |

## Product APIs

### Product Category Values

Allowed category values:

```text
Electronics
Fashion
Home
Health
Beauty
Sports
Toys
Groceries
Automotive
Books
Others
```

### Product Object

Example product response:

```json
{
  "_id": "665f9876543210abcdef5678",
  "name": "Samsung Galaxy S24 FE",
  "description": "A powerful Android smartphone",
  "price": 45000,
  "category": "Electronics",
  "images": [
    "https://ik.imagekit.io/example/product-userid-time"
  ],
  "seller": {
    "_id": "665f1234567890abcdef1234",
    "name": "Ankur Kumar",
    "email": "ankur@example.com"
  },
  "createdAt": "2026-05-30T10:10:00.000Z",
  "updatedAt": "2026-05-30T10:10:00.000Z",
  "__v": 0
}
```

### POST `/api/products`

Creates a product for the logged-in user. Images are uploaded to ImageKit and the returned URLs are saved in MongoDB.

Protected: Yes

Auth required:

```http
Cookie: token=<jwt>
```

Content-Type:

```http
multipart/form-data
```

Form data:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | Text | Yes | Minimum 3 characters |
| `description` | Text | No | If provided, minimum 10 characters |
| `price` | Number | Yes | Numeric |
| `category` | Text | No | Must be one of the allowed categories |
| `images` | File[] | No | Up to 5 files, max 5 MB each |

Example form-data:

```text
name: Samsung Galaxy S24 FE
description: A powerful Android smartphone
price: 45000
category: Electronics
images: phone-front.jpg
images: phone-back.jpg
```

Success response: `201 Created`

```json
{
  "message": "Product added successfully",
  "product": {
    "_id": "665f9876543210abcdef5678",
    "name": "Samsung Galaxy S24 FE",
    "description": "A powerful Android smartphone",
    "price": 45000,
    "category": "Electronics",
    "images": [
      "https://ik.imagekit.io/example/product-665f1234567890abcdef1234-1780000000000"
    ],
    "seller": {
      "_id": "665f1234567890abcdef1234",
      "name": "Ankur Kumar",
      "email": "ankur@example.com"
    },
    "createdAt": "2026-05-30T10:10:00.000Z",
    "updatedAt": "2026-05-30T10:10:00.000Z",
    "__v": 0
  }
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Validation failed |
| 401 | Missing or invalid token |
| 404 | Logged-in user not found |
| 500 | ImageKit upload or database error |

### GET `/api/products`

Returns all products. You can optionally filter by category using a query parameter.

Protected: No

Query parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `category` | No | Case-insensitive category search |

Example:

```http
GET /api/products?category=electronics
```

Success response: `200 OK`

```json
{
  "message": "products fetched successfully",
  "count": 1,
  "products": [
    {
      "_id": "665f9876543210abcdef5678",
      "name": "Samsung Galaxy S24 FE",
      "description": "A powerful Android smartphone",
      "price": 45000,
      "category": "Electronics",
      "images": [
        "https://ik.imagekit.io/example/product-url"
      ],
      "seller": {
        "_id": "665f1234567890abcdef1234",
        "name": "Ankur Kumar"
      },
      "createdAt": "2026-05-30T10:10:00.000Z",
      "updatedAt": "2026-05-30T10:10:00.000Z",
      "__v": 0
    }
  ]
}
```

### GET `/api/products/my`

Returns products created by the logged-in user.

Protected: Yes

Auth required:

```http
Cookie: token=<jwt>
```

Request body: None

Success response: `200 OK`

```json
{
  "message": "prodcuts fetched successfully",
  "count": 1,
  "products": [
    {
      "_id": "665f9876543210abcdef5678",
      "name": "Samsung Galaxy S24 FE",
      "description": "A powerful Android smartphone",
      "price": 45000,
      "category": "Electronics",
      "images": [
        "https://ik.imagekit.io/example/product-url"
      ],
      "seller": {
        "_id": "665f1234567890abcdef1234",
        "name": "Ankur Kumar",
        "email": "ankur@example.com"
      },
      "createdAt": "2026-05-30T10:10:00.000Z",
      "updatedAt": "2026-05-30T10:10:00.000Z",
      "__v": 0
    }
  ]
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 401 | Missing or invalid token |
| 404 | Logged-in user not found |

### GET `/api/products/:id`

Returns one product by MongoDB product id.

Protected: No

Path parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `id` | Yes | Product MongoDB ObjectId |

Example:

```http
GET /api/products/665f9876543210abcdef5678
```

Success response: `200 OK`

```json
{
  "message": "Product found successfully",
  "product": {
    "_id": "665f9876543210abcdef5678",
    "name": "Samsung Galaxy S24 FE",
    "description": "A powerful Android smartphone",
    "price": 45000,
    "category": "Electronics",
    "images": [
      "https://ik.imagekit.io/example/product-url"
    ],
    "seller": {
      "_id": "665f1234567890abcdef1234",
      "name": "Ankur Kumar"
    },
    "createdAt": "2026-05-30T10:10:00.000Z",
    "updatedAt": "2026-05-30T10:10:00.000Z",
    "__v": 0
  }
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Invalid product id |
| 404 | Product not found |

### PUT `/api/products/:id`

Updates a product by id for the logged-in user. If new images are provided, they replace the existing image list.

Protected: Yes

Auth required:

```http
Cookie: token=<jwt>
```

Content-Type:

```http
multipart/form-data
```

Path parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `id` | Yes | Product MongoDB ObjectId |

Form data:

| Field | Type | Required | Rules |
| --- | --- | --- | --- |
| `name` | Text | Yes | Minimum 3 characters |
| `description` | Text | No | If provided, minimum 10 characters |
| `price` | Number | Yes | Numeric |
| `category` | Text | No | Must be one of the allowed categories |
| `images` | File[] | No | Up to 5 files, max 5 MB each |

Success response: `200 OK`

```json
{
  "message": "product updated successfully",
  "product": {
    "_id": "665f9876543210abcdef5678",
    "name": "Samsung Galaxy S24 FE Updated",
    "description": "Updated product description",
    "price": 43000,
    "category": "Electronics",
    "images": [
      "https://ik.imagekit.io/example/new-product-url"
    ],
    "seller": "665f1234567890abcdef1234",
    "createdAt": "2026-05-30T10:10:00.000Z",
    "updatedAt": "2026-05-30T11:00:00.000Z",
    "__v": 0
  }
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Invalid product id |
| 400 | Validation failed |
| 401 | Missing or invalid token |
| 404 | Product not found for the logged-in user |
| 500 | ImageKit upload or database error |

### DELETE `/api/products/:id`

Deletes a product by id for the logged-in user.

Protected: Yes

Auth required:

```http
Cookie: token=<jwt>
```

Path parameters:

| Parameter | Required | Description |
| --- | --- | --- |
| `id` | Yes | Product MongoDB ObjectId |

Request body: None

Success response: `200 OK`

```json
{
  "message": "product deleted successfully"
}
```

Possible errors:

| Status | Reason |
| --- | --- |
| 400 | Invalid product id |
| 401 | Missing or invalid token |
| 404 | Product not found for the logged-in user |

## Data Models

### User

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | MongoDB user id |
| `name` | String | User name, minimum 3 characters |
| `email` | String | Unique email, stored lowercase |
| `password` | String | Bcrypt hashed password |
| `active` | Boolean | Account active flag, defaults to `true` |
| `createdAt` | Date | Created timestamp |
| `updatedAt` | Date | Updated timestamp |

### Product

| Field | Type | Description |
| --- | --- | --- |
| `_id` | ObjectId | MongoDB product id |
| `name` | String | Product name, required, max 100 characters |
| `description` | String | Optional product description |
| `price` | Number | Product price, required |
| `category` | String | Product category, defaults to `Others` |
| `images` | String[] | ImageKit image URLs |
| `seller` | ObjectId | Reference to the user who created the product |
| `createdAt` | Date | Created timestamp |
| `updatedAt` | Date | Updated timestamp |

## File Upload Rules

- Product image field name: `images`
- Upload middleware: `upload.array("images", 5)`
- Maximum files per request: 5
- Maximum file size: 5 MB per file
- Storage: memory storage
- Destination: ImageKit folder `/peerCommerce/products`

## Protected Routes

Protected routes require the `token` cookie:

```text
POST /api/products
GET /api/products/my
PUT /api/products/:id
DELETE /api/products/:id
```

Public routes:

```text
GET /
POST /api/auth/register
POST /api/auth/login
GET /api/products
GET /api/products/:id
```

## Status Codes Used

| Status | Meaning |
| --- | --- |
| 200 | Request succeeded |
| 201 | Product created |
| 400 | Bad request or validation error |
| 401 | Unauthorized |
| 404 | Resource or route not found |
| 500 | Internal server error |

## Example API Flow

1. Register a user using `POST /api/auth/register`.
2. The server sets the `token` cookie.
3. Create a product using `POST /api/products` with multipart form-data.
4. Fetch public products using `GET /api/products`.
5. Fetch your own products using `GET /api/products/my`.
6. Update one of your products using `PUT /api/products/:id`.
7. Delete one of your products using `DELETE /api/products/:id`.

## Notes For API Clients

- Send JSON for auth routes.
- Send multipart form-data for product create and update routes.
- Keep cookies enabled after login/register.
- Use the exact field name `images` for product image uploads.
- Product `seller` is populated differently depending on the endpoint:
  - Create product and my products include seller `name` and `email`.
  - Product list and single product include seller `name`.
- The current API returns the user object with the hashed password in auth responses.

## Known Implementation Notes

- The current controller intends to validate MongoDB ObjectIds, but the `isValid` calls should pass the `id` value.
- Update and delete now try to find the product using the route id and the logged-in user's email before changing data.
- The update product controller uses image replacement logic, but the image array reassignment and `user` reference need correction before image updates work reliably.
