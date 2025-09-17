# 🚀 ForgeLab - Freelancer Marketplace

A modern, full-stack ForgeLab marketplace built with Node.js, Express, MongoDB, and React. Featuring a beautiful, responsive design with advanced functionality for both ForgeLab and clients.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with modern UI
- Role-based access (ForgeLab/Client)
- JWT token authentication
- Profile management with enhanced forms
- Secure password handling

### 💼 ForgeLab Features
- Create and manage gigs with step-by-step forms
- Set pricing and delivery times
- Track gig performance with detailed analytics
- Manage orders with modern table interface
- View gig statistics (views, ratings, orders)
- Edit gigs with enhanced form validation

### 🛒 Client Features
- Browse available gigs with advanced filtering
- Search and filter gigs by category, price, rating
- Place orders with secure payments
- Add gigs to wishlist with dynamic status
- Track order progress with detailed views
- Rate and review completed gigs
- View gig details with comprehensive information

### ⭐ Rating & Review System
- 5-star rating system for gigs
- Client reviews and comments
- Average rating calculations
- Rating statistics for ForgeLab
- User-specific rating management

### 💳 Payment & Orders
- Stripe payment integration
- Secure order processing
- Order status tracking (pending, in_progress, delivered, cancelled)
- Webhook handling for payment confirmations
- Order history with detailed information

### 🎨 Modern UI/UX
- **Glass morphism design** with backdrop blur effects
- **Gradient backgrounds** and modern color schemes
- **Responsive design** with Tailwind CSS
- **Smooth animations** and micro-interactions
- **Mobile-first approach** with touch-friendly interfaces
- **Enhanced typography** with better font weights
- **Interactive elements** with hover effects and transitions
- **Clean scrollbars** (hidden for modern look)
- **Step-by-step forms** with visual progress indicators

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Passport.js** - OAuth strategies
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling with custom components
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Context API** - State management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ForgeLab
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` files in both `backend/` and `frontend/` directories:
   
   **Backend (.env)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/freelink
   JWT_SECRET=your_jwt_secret_here
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```
   
   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
ForgeLab/
├── backend/
│   ├── config/
│   │   └── passport.js          # OAuth configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Gig.js               # Gig model with views and ratings
│   │   ├── Order.js             # Order model
│   │   ├── Review.js            # Review model
│   │   └── GigRating.js         # Gig rating model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── gigs.js              # Gig management routes
│   │   ├── orders.js            # Order processing routes
│   │   ├── profile.js           # Profile management routes
│   │   ├── reviews.js           # Review system routes
│   │   ├── gigRatings.js        # Gig rating routes
│   │   ├── webhook.js           # Stripe webhook handling
│   │   └── wishlist.js          # Wishlist management routes
│   └── server.js                # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx    # Modern login page
│   │   │   │   └── Signup.jsx   # Modern registration page
│   │   │   ├── freelancer/
│   │   │   │   ├── Dashboard.jsx # Freelancer dashboard with analytics
│   │   │   │   ├── Gigs.jsx     # Gig management with modern UI
│   │   │   │   ├── CreateGig.jsx # Step-by-step gig creation
│   │   │   │   ├── EditGig.jsx  # Enhanced gig editing
│   │   │   │   └── Orders.jsx   # Order management with table view
│   │   │   ├── client/
│   │   │   │   ├── Dashboard.jsx # Client dashboard (3 recent items)
│   │   │   │   ├── BrowseGigs.jsx # Enhanced gig browsing
│   │   │   │   ├── GigDetail.jsx # Comprehensive gig details
│   │   │   │   ├── Orders.jsx   # Client order management
│   │   │   │   └── Wishlist.jsx # Wishlist management
│   │   │   ├── Home.jsx         # Modern landing page
│   │   │   └── Profile.jsx      # User profile page
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # App entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth

### Gigs
- `GET /api/gigs` - Get all gigs
- `GET /api/gigs/:id` - Get specific gig
- `POST /api/gigs` - Create new gig
- `PUT /api/gigs/:id` - Update gig
- `DELETE /api/gigs/:id` - Delete gig
- `GET /api/gigs/freelancer` - Get freelancer's gigs
- `POST /api/gigs/:id/view` - Track gig view

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders (sorted by latest)
- `GET /api/orders/:id` - Get specific order
- `PUT /api/orders/:id` - Update order status

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/:gigId` - Add to wishlist
- `DELETE /api/wishlist/:gigId` - Remove from wishlist

### Gig Ratings
- `POST /api/gig-ratings/:gigId` - Add rating to gig
- `GET /api/gig-ratings/:gigId` - Get all ratings for gig
- `GET /api/gig-ratings/:gigId/user-rating` - Get user's rating
- `PUT /api/gig-ratings/:gigId` - Update user's rating

## 🎯 Key Features Implementation

### 🔐 Authentication Flow
1. User registers with email/password with modern forms
2. JWT token generated and stored
3. Protected routes check token validity
4. Role-based access control for different features

### ⭐ Rating System
1. Clients can rate gigs after completion
2. 5-star rating system with comments
3. Average ratings calculated and displayed
4. Freelancers can view rating statistics

### 👁️ View Tracking
1. Gig views tracked when clients visit gig details
2. Session-based tracking prevents duplicate counts
3. View statistics displayed on freelancer dashboard
4. Analytics help freelancers understand gig performance

### 💳 Payment Integration
1. Client selects gig and places order
2. Stripe PaymentIntent created
3. Order saved with pending status
4. Webhook updates order status on payment success

### 📱 Modern UI/UX Design
- **Glass morphism** with backdrop blur effects
- **Gradient backgrounds** and modern color schemes
- **Step-by-step forms** with visual progress indicators
- **Interactive elements** with hover effects and animations
- **Responsive design** optimized for all screen sizes
- **Clean typography** with enhanced readability

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Set up Stripe webhooks
4. Deploy to your preferred hosting service

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Recent Updates & Improvements

### ✨ UI/UX Enhancements
- **Modern Design System**: Implemented glass morphism, gradients, and modern styling
- **Enhanced Forms**: Step-by-step gig creation and editing with visual progress
- **Improved Navigation**: Modern navbar with better spacing and interactions
- **Responsive Tables**: Scrollable order tables with sticky headers
- **Clean Scrollbars**: Hidden scrollbars for modern appearance
- **Better Typography**: Enhanced font weights and spacing throughout

### 🚀 New Features
- **Gig Rating System**: 5-star rating system with comments and statistics
- **View Tracking**: Session-based gig view tracking with analytics
- **Enhanced Wishlist**: Dynamic wishlist status with proper data fetching
- **Order Management**: Modern table interface for both clients and freelancers
- **Dashboard Analytics**: Comprehensive statistics for freelancers

### 🔧 Technical Improvements
- **Better Data Flow**: Improved API endpoints and data population
- **Enhanced Validation**: Better form validation with user feedback
- **Optimized Performance**: Efficient data fetching and state management
- **Clean Code**: Removed unused chat functionality and improved code structure

## 🔮 Future Enhancements

- Advanced search and filtering with AI
- File upload service for portfolios
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Real-time notifications
- Advanced payment options
- Video call integration

---

**Built with ❤️ for the freelancer community**
