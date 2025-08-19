# 🛍️ Temtem Backend Technical Test

A simple **Node.js + Express + MongoDB** backend for a product store with **role-based authentication** and **image upload support**.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/temtem-backend.git
cd temtem-backend-technical-test
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the project root with:

```env
BASE_URL=http://localhost:4000
DB_URL=mongodb://127.0.0.1:27017/temtem-technical-test-db
PORT=4000
NODE_ENV=development
JWT_SECRET=you_jwt_secret
CLIENT_URL=http://localhost:3000
EMAIL_USER=your_email_adress_to_send_email
EMAIL_PASSWORD=app_password
HASH_IDS_SALT=any_key
```

### 4️⃣ Run the Server

```bash
npm run dev
```

---

## 👤 – Register a User

- Open **Postman**
- Create request:

```
Method: POST
URL: http://localhost:4000/api/auth//signup
```

- Body → `raw → JSON`

```json
{
  "email": "guset@gamil.com",
  "password": "Sliamne13*"
}
```

## After registration, the user receives an email with a link to verify their address. This link carries a unique validation token to confirm their email.

## – Validate User Email

```
Method: POST
URL: http://localhost:4000/api/auth/email-validation/confirm
```

- Body → `raw → JSON`

```json
{
  "token"
}
```

- Copy the **token** from the response (you can need it for next steps)

---

## – Login to Get Token

```
Method: POST
URL: http://localhost:4000/api/auth/login
```

- Body → `raw → JSON`

```json
{
  "email": "owner@example.com",
  "password": "ps^pkp*33EE"
}
```

- Copy the **token** from the response (you can need it for next steps)

---

## – Create a Product (with Image)

```
Method: POST
URL: http://localhost:4000/api/products
```

Only store owner can add product

- Headers → `Authorization: Bearer YOUR_TOKEN_HERE`
- Body → `form-data`

| Key         | Value         | Type |
| ----------- | ------------- | ---- |
| name        | Test Product  | Text |
| description | Some text     | Text |
| price       | 19.99         | Text |
| category    | shoes         | Text |
| image       | (choose file) | File |

Response:

```json
{
  "_id": "...",
  "name": "Test Product",
  "imageUrl": "product-172891782.jpg",
  ...
}
```

---

## - Get All Products (Public)

```
Method: GET
URL : http://localhost:4000/api/products
```

Both store owner and guest users can fetch products

- Headers → `Authorization: Bearer YOUR_TOKEN_HERE`
- Body → `form-data`

Optional filters and sort:

- `?category=shoes`
- `?order_by=price&order=desc`

Examples:

```
GET /api/products
GET /api/products?category=shoes
GET /api/products?category=shoes&order_by=price&order=desc
```

---

## – Update a Product

```
Method: PUT
URL: http://localhost:4000/api/products/:productId
```

Only store owner can update product

- Headers → `Authorization: Bearer YOUR_TOKEN_HERE`
- Body → `form-data`
- Send only the fields you want to update
- You can upload a **new image** → old one will be deleted

---

## – Delete a Product

```
Method: DELETE
URL: http://localhost:3000/api/products/:productId
```

Only store owner can add product

- Headers → `Authorization: Bearer YOUR_TOKEN_HERE`

Deletes product and its image.

---

## – View Product Image (Public)

Images are served via a route, not direct file access

```
Method: GET
URL: http://localhost:3000/api/products/images/fileName

```

Copy the filename from `imageUrl` when creating/fetching a product.

---

## 🔐 ACCESS CONTROL

| Route                    | Guest | Store Owner |
| ------------------------ | :---: | :---------: |
| Register / Login         |  ✅   |     ❌      |
| Get All Products         |  ✅   |     ✅      |
| Create / Update / Delete |  ❌   |     ✅      |
| Access Image URLs        |  ✅   |     ✅      |

---

## ✅ Features / User Stories

- User registration & login
- Role-based access control
- Create product with image upload
- List all products (with filters & sorting)
- Update product (replace image too)
- Delete product + image
- Public product images

---

---

## 👨‍💻 Author

- **Name:** Benchikh Hichem Abderrahmene
- **GitHub:** [https://github.com/hichemhichem14](https://github.com/hichemhichem14)
