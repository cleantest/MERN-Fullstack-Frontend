new Vue({
    el: '#app',
    data: {
        appURL: 'https://mern-fullstack-backend-xct9.onrender.com',
        showCart: false,
        showCheckout: false,
        showSuccess: false,
        cartItems: [],
        checkoutForm: {
            parentName: '',
            phone: ''
        },
       searchQuery: '',
       sortOption: '', // '', 'price-asc', 'price-desc', 'location-asc', 'location-desc'
        lessons: []
    },
    computed: {
        cartTotal: function () {
            return this.cartItems.reduce(function (total, item) {
                return total + item.price;
            }, 0);
            
        },
        isValidName: function () {
            if (!this.checkoutForm.parentName) return true;
            return /^[a-zA-Z\s]+$/.test(this.checkoutForm.parentName);
        },
        isValidPhone: function () {
            if (!this.checkoutForm.phone) return true;
            return /^\d+$/.test(this.checkoutForm.phone);
        },
        canCheckout: function () {
            return this.isValidName &&
                this.isValidPhone &&
                this.checkoutForm.parentName.trim() !== '' &&
                this.checkoutForm.phone.trim() !== '' &&
                this.cartItems.length > 0;
        },

        filteredResults: function () {

          const query = this.searchQuery.trim().toLowerCase();
            if (!query) return this.lessons; // Return all lessons if no query

            // Filter by subject or location
            return this.lessons.filter(lesson => {
                return lesson.subject.toLowerCase().includes(query) ||
                    lesson.location.toLowerCase().includes(query);
            });
        },

        // Sort lessons based on selected sort option
        sortedResults: function () {
            // Always sort the entire list of lessons
            let results = [...this.lessons]; // Make a copy of the entire lessons list

            if (this.sortOption) {
                switch (this.sortOption) {
                    case 'price-asc':
                        results.sort((a, b) => a.price - b.price);
                        break;
                    case 'price-desc':
                        results.sort((a, b) => b.price - a.price);
                        break;
                    case 'location-asc':
                        results.sort((a, b) => a.location.toLowerCase().localeCompare(b.location.toLowerCase()));
                        break;
                    case 'location-desc':
                        results.sort((a, b) => b.location.toLowerCase().localeCompare(a.location.toLowerCase()));
                        break;
                    default:
                        break; // No sorting if no sortOption
                }
            }

            // Now, return the results filtered by search query
            return results.filter(lesson => {
                const query = this.searchQuery.trim().toLowerCase();
                return !query || lesson.subject.toLowerCase().includes(query) || lesson.location.toLowerCase().includes(query);
            });
        }
    },
    created() {
        this.fetchLessons();
    },
    methods: {
           // Fetch lessons from the backend
        fetchLessons: function () {
            fetch(`${this.appURL}/lessons`)
                .then(response => response.json())
                .then(data => {
                    this.lessons = data;
                })
                .catch(error => {
                    console.error("Error fetching lessons:", error);
                });
        },
        toggleCart: function () {
            this.showCart = !this.showCart;
        },
        addToCart: function (lesson) {
            if (lesson.spaces > 0 && !this.isInCart(lesson)) {
                var originalLesson = this.lessons.find(function (l) {
                    return l.id === lesson.id;
                });
                if (originalLesson) {
                    originalLesson.spaces--;
                }

                this.cartItems.push({
                    id: lesson.id,
                    subject: lesson.subject,
                    location: lesson.location,
                    price: lesson.price,
                    icon: lesson.icon
                });
            }
        },

        //  removed added cart items:
        removeFromCart: function (item) {
            var originalLesson = this.lessons.find(function (l) {
                return l.id === item.id;
            });
            if (originalLesson) {
                originalLesson.spaces++;
            }

            var index = this.cartItems.findIndex(function (cartItem) {
                return cartItem.id === item.id;
            });
            if (index > -1) {
                this.cartItems.splice(index, 1);
            }
        },
        isInCart: function (lesson) {
            return this.cartItems.some(function (item) {
                return item.id === lesson.id;
            });

        },
        saveOrder: function () {
             const order = {
                parentName: this.checkoutForm.parentName,
                phone: this.checkoutForm.phone,
                items: this.cartItems,
                total: this.cartTotal,
                timestamp: new Date().toISOString()
            };

            return fetch(`${this.appURL}/lessons/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            })
            .then(res => res.json())
            .catch(err => {
                console.error("Error saving order:", err);
            });
},

        processCheckout: function () {
            if (this.canCheckout) {
                this.saveOrder().then(() => {
                this.showCheckout = false;
                this.showCart = false;
                this.showSuccess = true;
                 });

            }
        },
        resetApp: function () {
            this.showSuccess = false;
            this.cartItems = [];
            this.checkoutForm.parentName = '';
            this.checkoutForm.phone = '';
        }
    }
});

