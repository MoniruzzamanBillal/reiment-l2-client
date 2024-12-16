# Raiment - E-Commerce Application

<p align="center">
  <img src="https://i.postimg.cc/kgFFvbm4/Vite-React-TS.png" alt="Home page">
</p>

Raiment is a dynamic full-stack e-commerce platform designed for users, vendors, and administrators to offer a seamless online shopping experience. It allows users to browse and purchase products, vendors to manage their shops and inventories, and administrators to oversee the platform operations.

## Features

### User Features

1. **Home Page**:

   - Displays all available products from various vendors.
   - Prioritizes products from followed shops for logged-in users.
   - Advanced filtering
   - Display list of categories for easy navigation.
   - Flash sale section with a link to view all flash sale products.

2. **User Registration & Authentication:**:

   - Sign up as a user or vendor.
   - Secure login using JWT.
   - Password management (change password and reset via email).

3. **Product Browsing & Cart:**:

   - Browse products across all vendor shops with advanced search and filter options.
   - Add products to the cart (can only be from one vendor at a time).
   - Receive warnings when trying to add products from different vendors.
   - Apply coupon codes during checkout for discounts.

4. **Product Comparison:**:

   - Compare up to three products from the same category based on their attributes (price, ratings, etc.).

5. **Order History:**:

   - View the list of past purchases with product and order details.

6. **Vendor Features:**:
   - Manage shop details (name, logo, etc.).
   - Add, edit, or delete products with attributes like price, inventory, images, etc.
   - View and respond to customer reviews.
   - View order history specific to their shop.

##

### Admin Features

1. **Admin Dashboar**:

   - Full control over the platform, including managing users (vendors and customers).
   - Ability to suspend or delete accounts and blacklist vendor shops.
   - Monitor transactions and review platform activities.
   - Manage product categories (add, edit, delete).

   ##

### Known Issues

I dploy my database in superbase . As a result my project is working slow . So if i add more than 1 cart item , during the checkout , I get this error 'Transaction API error: Transaction already closed: A commit cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 4979 ms passed since the start of the transaction. Consider increasing the interactive transaction timeout or doing less work in the transaction.' . If i add 1 cart item at that time , checkout process works fine .

##

### Technologies Used

- **Frontend**: React.js, Redux, TypeScript
- **Backend**: Node.js, Express, JWT-based Authentication
- **Database**: PostgreSQL with Prisma
- **State Management**: React Context
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Integration**: Aamarpay for payment processing
- **Deployment**: Vercel (API)

## Installation

1.  Clone the repository:

```bash
git clone https://github.com/MoniruzzamanBillal/reiment-l2-client
```

##

### Credentials :

- **Admin Email**: admin@gmail.com
- **password**: 123456

- **Vendor Email**: vendor1@gmail.com
- **password**: 123456

- **user Email**: user1@gmail.com
- **password**: 123456

- **Coupon Code**: welcome100

##

### live llink : https://reiment-l2-client.vercel.app
