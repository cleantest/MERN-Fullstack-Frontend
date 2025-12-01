# Elite Tuition Booking Platform

A Vue.js web app for browsing and booking after-school classes. Users can search, sort, add to cart, and checkout with form validation.

---

##  Features

- Browse and search classes by name/location
- Sort by price, location, or subject
- Shopping cart with totals
- Checkout with form validation (name: letters only, phone: numbers only)
- Responsive design (desktop, tablet, mobile)
- Real-time booking confirmation

--


##  app.js composition
### Data
```javascript
appURL: 'https://mern-fullstack-backend-xct9.onrender.com'
showCart, showCheckout, showSuccess   // UI toggles
cartItems, lessons                     // Data arrays
searchQuery, sortOption                // Filters
checkoutForm: { parentName, phone }    // Form inputs
```

### Computed Properties
| Property | Purpose |
|----------|---------|
| `cartTotal` | Sum of cart prices |
| `isValidName` | Letters/spaces only |
| `isValidPhone` | Numbers only |
| `canCheckout` | All validations pass |
| `filteredsearchResults` | Filtered lessons |
| `sortedResults` | Sorted lessons |
| `finalLessonsToDisplay` | Search or sorted |

### Methods
| Method | Purpose |
|--------|---------|
| `fetchLessons()` | GET classes from backend |
| `saveOrder()` | POST booking data |
| `updateLessonSpaces()` | PUT spaces update |
| `addToCart(lesson)` | Add class to cart |
| `removeFromCart(item)` | Remove from cart |
| `processCheckout()` | Save → Update → Success |

---

## Validation

| Field | Rules | Regex |
|-------|-------|-------|
| Name | Letters & spaces | `/^[a-zA-Z\s]+$/` |
| Phone | Numbers only | `/^\d+$/` |
| Cart | Must have items | JS check |

---

## Tech Stack

- Vue.js 2.6.14 (CDN)
- HTML5, CSS3
- JavaScript ES6+
- Fetch API

---

##  User Flow

1. Browse all classes
2. Search/sort to filter
3. Add to cart
4. View cart & total
5. Enter name + phone → checkout
6. See order confirmation

---



##  Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ support.

---
https://github.com/cleantest/MERN-Fullstack-Frontend



https://cleantest.github.io/MERN-Fullstack-Frontend/



https://mern-fullstack-backend-xct9.onrender.com/lessons/



https://github.com/cleantest/MERN-Fullstack-Backend