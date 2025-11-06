# 🛍️ Nexora - AI-Powered E-Commerce Platform (Frontend)

<div align="center">

![Nexora Logo](https://img.shields.io/badge/Nexora-E--Commerce-blue?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://frontend-six-delta-72.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Frontend-181717?style=for-the-badge&logo=github)](https://github.com/r1cksync/nexora-frontend)
[![Backend](https://img.shields.io/badge/GitHub-Backend-181717?style=for-the-badge&logo=github)](https://github.com/r1cksync/nexora-backend)

**A modern, AI-powered e-commerce platform with intelligent product recommendations, semantic search, and interactive chatbot assistance.**

[Live Demo](https://frontend-six-delta-72.vercel.app) • [Backend Repo](https://github.com/r1cksync/nexora-backend) • [Report Bug](https://github.com/r1cksync/nexora-frontend/issues) • [Request Feature](https://github.com/r1cksync/nexora-frontend/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Key Features Breakdown](#key-features-breakdown)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

---

## 🌟 Overview

Nexora is a next-generation e-commerce platform that leverages **AI technology** (powered by Groq) to provide intelligent shopping experiences. The platform features semantic product search, personalized recommendations, and an AI chatbot that understands your shopping needs.


Video Demonstration : https://drive.google.com/file/d/1CKWui76ctZkkfF-FFeE-NraLUEuq3Fqx/view?usp=sharing


### 🎯 Key Highlights

- 🤖 **AI-Powered**: Groq LLaMA 3.3 70B for intelligent recommendations
- 🎨 **Modern UI**: Beautiful animations with Framer Motion
- 📱 **Responsive**: Fully mobile-optimized design
- 🔐 **Secure**: JWT-based authentication
- 🛒 **Complete**: Full e-commerce functionality
- ⚡ **Fast**: Built with Next.js 14 and optimized for performance

---

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog**: Browse 30+ products across multiple categories
- **Smart Search**: AI-powered semantic search understands natural language
- **Quick View**: Preview products without leaving the page
- **Product Details**: Comprehensive product pages with reviews and ratings
- **Category Filters**: Filter by category, price range, and sort options

### 🤖 AI Features
- **AI Chatbot**: Interactive assistant with full product and order knowledge
  - Answer product queries
  - Show order history
  - Compare products
  - Provide recommendations
  - Check stock availability
- **Smart Recommendations**: Personalized product suggestions
- **Semantic Search**: Natural language product search

### 🛒 E-Commerce Functionality
- **Shopping Cart**: Add, remove, update quantities
- **Wishlist**: Save favorite products
- **Checkout**: Streamlined checkout process
- **Order Tracking**: View order history and status
- **User Authentication**: Secure signup/login with JWT

### 🎨 User Experience
- **Animated Landing Page**: Engaging hero section with moving blobs
- **Smooth Transitions**: Framer Motion animations throughout
- **Scroll Effects**: Dynamic navbar with scroll-based styling
- **Mobile Menu**: Fully responsive navigation
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Elegant loading indicators

---

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & Animations
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

### State Management & API
- **[Axios](https://axios-http.com/)** - HTTP client
- **React Context API** - Global state management

### Icons
- **[React Icons](https://react-icons.github.io/react-icons/)** - Icon library

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see [backend repo](https://github.com/r1cksync/nexora-backend))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/r1cksync/nexora-frontend.git
   cd nexora-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   
   For production, use your deployed backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001` or `https://your-backend.vercel.app` |

> **Note**: The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser.

---

## 📁 Project Structure

```
nexora-frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page
│   ├── shop/                # Product listing page
│   ├── product/[id]/        # Product detail page
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout page
│   ├── orders/              # Order history
│   ├── wishlist/            # Wishlist page
│   ├── search/              # AI search page
│   ├── chat/                # AI chatbot page
│   └── auth/                # Login/Signup pages
├── components/              # Reusable components
│   ├── Header.tsx          # Navigation header
│   ├── ProductCard.tsx     # Product card component
│   └── Toast.tsx           # Toast notification system
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   └── ToastContext.tsx   # Toast notification context
├── lib/                    # Utilities and helpers
│   └── api.ts             # API client with Axios
├── types/                  # TypeScript type definitions
│   └── index.ts           # Shared types
├── public/                 # Static assets
└── styles/                # Global styles
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

---

## 🎯 Key Features Breakdown

### 1. **Landing Page** (`/`)
- Animated hero section with gradient blobs
- Feature highlights
- Product categories showcase
- Call-to-action buttons

### 2. **Shop Page** (`/shop`)
- Product grid with pagination
- Category and price filters
- Sort options (name, price, rating)
- AI-powered recommendations
- Quick view modal

### 3. **Product Detail** (`/product/[id]`)
- Large product images
- Stock availability badges
- Quantity selector
- Add to cart/wishlist
- Customer reviews and ratings
- Related products

### 4. **Shopping Cart** (`/cart`)
- View all cart items
- Update quantities
- Remove items
- Price summary
- Proceed to checkout

### 5. **Checkout** (`/checkout`)
- Shipping information form
- Order summary
- Payment details
- Order confirmation

### 6. **AI Chatbot** (`/chat`)
- Natural language conversation
- Product information queries
- Order history access
- Stock checking
- Product comparisons
- Smart prompt suggestions

### 7. **AI Search** (`/search`)
- Semantic search engine
- Natural language queries
- Intelligent product matching
- Filter results

### 8. **Order History** (`/orders`)
- View all past orders
- Order status tracking
- Order details
- Reorder functionality

### 9. **Wishlist** (`/wishlist`)
- Save favorite products
- Quick add to cart
- Remove items
- Share wishlist

---

## 🔌 API Integration

The frontend communicates with the backend API through the `lib/api.ts` file. All API calls include:

- **Authentication**: JWT token in Authorization header
- **Error Handling**: Graceful error messages
- **Response Typing**: TypeScript interfaces for type safety

### Key API Endpoints Used

```typescript
// Authentication
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me

// Products
GET  /api/products
GET  /api/products/:id
POST /api/products/:id/reviews

// Cart
GET    /api/cart
POST   /api/cart
DELETE /api/cart/:id
DELETE /api/cart/clear

// Orders
GET  /api/orders
POST /api/checkout

// Wishlist
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:id

// AI Features
POST /api/ai/search
POST /api/ai/recommendations
POST /api/ai/chat
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL production
   ```
   Enter your backend URL when prompted.

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**: Add build command `npm run build`
- **AWS Amplify**: Connect GitHub repo
- **Railway**: Deploy from GitHub
- **Render**: Add as web service

---

## 📸 Screenshots

### Landing Page
Beautiful animated hero section with gradient blobs and feature highlights.

### Shop Page
Product grid with filters, sorting, and AI recommendations.

### Product Detail
Comprehensive product information with reviews and ratings.

### AI Chatbot
Interactive assistant that understands natural language queries.

### Shopping Cart
Clean cart interface with quantity controls and price summary.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🌐 **Live Demo** | [https://frontend-six-delta-72.vercel.app](https://frontend-six-delta-72.vercel.app) |
| 💻 **Frontend Repository** | [https://github.com/r1cksync/nexora-frontend](https://github.com/r1cksync/nexora-frontend) |
| 🔧 **Backend Repository** | [https://github.com/r1cksync/nexora-backend](https://github.com/r1cksync/nexora-backend) |
| 📚 **Documentation** | [Backend API Docs](https://github.com/r1cksync/nexora-backend#api-documentation) |

---

## 🙏 Acknowledgments

- **Groq** - For the powerful LLaMA 3.3 70B AI model
- **Vercel** - For seamless deployment
- **Next.js Team** - For the amazing framework
- **Framer Motion** - For beautiful animations

---

<div align="center">

**Made with ❤️ by [r1cksync](https://github.com/r1cksync)**

⭐ Star this repo if you found it helpful!

</div>
