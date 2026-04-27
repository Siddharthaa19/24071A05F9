import { useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

const products = [
  {
    id: 1,
    name: 'Blue T-Shirt',
    price: 499,
    description: 'Soft cotton t-shirt for daily wear.',
    image:
      'https://images.pexels.com/photos/18256104/pexels-photo-18256104.jpeg?cs=srgb&dl=pexels-mallonymedia-18256104.jpg&fm=jpg',
  },
  {
    id: 2,
    name: 'White Sneakers',
    price: 1499,
    description: 'Simple sneakers with a clean look.',
    image:
      'https://images.pexels.com/photos/7193625/pexels-photo-7193625.jpeg?cs=srgb&dl=pexels-karola-g-7193625.jpg&fm=jpg',
  },
  {
    id: 3,
    name: 'Travel Backpack',
    price: 999,
    description: 'Compact bag with enough space for essentials.',
    image:
      'https://images.pexels.com/photos/3731256/pexels-photo-3731256.jpeg?cs=srgb&dl=pexels-jibarofoto-3731256.jpg&fm=jpg',
  },
  {
    id: 4,
    name: 'Classic Watch',
    price: 1799,
    description: 'Minimal watch with a blue strap.',
    image: 'https://unsplash.com/photos/83DnGfaWV24/download?force=true',
  },
]

const navItems = [
  { to: '/', label: 'Register' },
  { to: '/login', label: 'Login' },
  { to: '/catalogue', label: 'Catalogue' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/contact', label: 'Contact' },
  { to: '/about', label: 'About' },
]

const initialRegister = {
  name: '',
  email: '',
  password: '',
}

const initialLogin = {
  email: '',
  password: '',
}

const initialContact = {
  name: '',
  email: '',
  message: '',
}

function App() {
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [contactForm, setContactForm] = useState(initialContact)
  const [registeredUser, setRegisteredUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [cart, setCart] = useState([])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateForm = (setter) => (event) => {
    const { name, value } = event.target
    setter((current) => ({ ...current, [name]: value }))
  }

  const handleRegister = (event) => {
    event.preventDefault()

    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setAuthMessage('Please fill all registration fields.')
      return
    }

    setRegisteredUser(registerForm)
    setRegisterForm(initialRegister)
    setAuthMessage('Registration complete. You can log in now.')
  }
  const handleLogin = (event) => {
    event.preventDefault()

    if (!registeredUser) {
      setAuthMessage('Please register first.')
      return
    }

    const validEmail = loginForm.email === registeredUser.email
    const validPassword = loginForm.password === registeredUser.password

    if (!validEmail || !validPassword) {
      setAuthMessage('Email or password is incorrect.')
      return
    }
    setIsLoggedIn(true)
    setLoginForm(initialLogin)
    setAuthMessage(`Welcome back, ${registeredUser.name}.`)
  }
  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id)

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...current, { ...product, quantity: 1 }]
    })
  }
  const changeQuantity = (id, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const handleContact = (event) => {
    event.preventDefault()

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactMessage('Please fill all contact fields.')
      return
    }

    setContactForm(initialContact)
    setContactMessage('Your message has been sent.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-tag">Shopping App</p>
          <h1>shopping app</h1>
        </div>
        <div className="status-box">
          <span>{isLoggedIn ? 'Logged in' : 'Guest user'}</span>
          <span>{cart.length} items in cart</span>
        </div>
      </header>

      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              isActive ? 'nav-button active' : 'nav-button'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {authMessage ? <p className="notice">{authMessage}</p> : null}

      <main className="content-grid">
        <Routes>
          <Route
            path="/"
            element={
              <RegisterPage
                registerForm={registerForm}
                onChange={updateForm(setRegisterForm)}
                onSubmit={handleRegister}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                loginForm={loginForm}
                onChange={updateForm(setLoginForm)}
                onSubmit={handleLogin}
              />
            }
          />
          <Route
            path="/catalogue"
            element={<CataloguePage products={products} onAddToCart={addToCart} />}
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage cart={cart} total={total} onChangeQuantity={changeQuantity} />
            }
          />
          <Route
            path="/contact"
            element={
              <ContactPage
                contactForm={contactForm}
                contactMessage={contactMessage}
                onChange={updateForm(setContactForm)}
                onSubmit={handleContact}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>24071A05F9 copyrights reserved</p>
      </footer>
    </div>
  )
}

function RegisterPage({ registerForm, onChange, onSubmit }) {
  return (
    <section className="panel">
      <h2>Registration</h2>
      <p className="section-text">Create a basic account to start shopping.</p>
      <form className="simple-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={registerForm.name}
          onChange={onChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={registerForm.email}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={registerForm.password}
          onChange={onChange}
        />
        <button type="submit" className="primary-button">
          Register
        </button>
      </form>
    </section>
  )
}

function LoginPage({ loginForm, onChange, onSubmit }) {
  return (
    <section className="panel">
      <h2>Login</h2>
      <p className="section-text">Use your registration details to enter the app.</p>
      <form className="simple-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={loginForm.email}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginForm.password}
          onChange={onChange}
        />
        <button type="submit" className="primary-button">
          Login
        </button>
      </form>
    </section>
  )
}

function CataloguePage({ products, onAddToCart }) {
  return (
    <section className="panel">
      <h2>Catalogue</h2>
      <p className="section-text">A small list of products with a very simple layout.</p>
      <div className="product-grid">
        {products.map((product) => (
          <article key={product.id} className="product-card">
            <img className="product-image" src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>Rs. {product.price}</strong>
            <button
              type="button"
              className="primary-button"
              onClick={() => onAddToCart(product)}
            >
              Add to cart
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function CheckoutPage({ cart, total, onChangeQuantity }) {
  return (
    <section className="panel">
      <h2>Checkout</h2>
      <p className="section-text">Review selected items before placing an order.</p>
      <div className="checkout-box">
        {cart.length === 0 ? (
          <p className="empty-text">Your cart is empty.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-row">
                <div>
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price}</p>
                </div>
                <div className="quantity-box">
                  <button type="button" onClick={() => onChangeQuantity(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onChangeQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="total-row">
              <span>Total</span>
              <strong>Rs. {total}</strong>
            </div>
            <button type="button" className="primary-button wide-button">
              Place order
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function ContactPage({ contactForm, contactMessage, onChange, onSubmit }) {
  return (
    <section className="panel">
      <h2>Contact</h2>
      <p className="section-text">A small contact form for simple customer queries.</p>
      <form className="simple-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          value={contactForm.name}
          onChange={onChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={contactForm.email}
          onChange={onChange}
        />
        <textarea
          name="message"
          placeholder="Write your message"
          rows="5"
          value={contactForm.message}
          onChange={onChange}
        />
        <button type="submit" className="primary-button">
          Send message
        </button>
      </form>
      {contactMessage ? <p className="notice small">{contactMessage}</p> : null}
    </section>
  )
}

function AboutPage() {
  return (
    <section className="panel">
      <h2>About</h2>
      <p className="section-text">
        This demo shop is made with a beginner style layout, basic sections, and a simple
        shopping flow.
      </p>
      <div className="about-grid">
        <div className="about-card">
          <h3>What it has</h3>
          <p>Registration, login, products, checkout, contact, and about page sections.</p>
        </div>
        <div className="about-card">
          <h3>Style</h3>
          <p>Blue and white colors, plain buttons, simple borders, and very light spacing.</p>
        </div>
        <div className="about-card">
          <h3>Use</h3>
          <p>You can keep this as a starter and later connect it to a backend.</p>
        </div>
      </div>
    </section>
  )
}

export default App
