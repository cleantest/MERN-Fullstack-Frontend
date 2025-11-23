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
        filteredsearchResults: function () {
          
            var self = this;
            var query = this.searchQuery.trim().toLowerCase();

            var results = this.lessons.filter(function (lesson) {
                if (!query) return true;
                return lesson.subject.toLowerCase().includes(query) ||
                    lesson.location.toLowerCase().includes(query);
            });
            
            return results;
//Sorting functionality 
           if (this.sortOption) {
                var opt = this.sortOption;
                if (opt === 'price-asc') {
                    results = results.slice().sort(function (a, b) {
                        return a.price - b.price;
                    });
                } else if (opt === 'price-desc') {
                    results = results.slice().sort(function (a, b) {
                        return b.price - a.price;
                    });
                } else if (opt === 'location-asc') {
                    results = results.slice().sort(function (a, b) {
                        return a.location.toLowerCase().localeCompare(b.location.toLowerCase());
                    });
                } else if (opt === 'location-desc') {
                    results = results.slice().sort(function (a, b) {
                        return b.location.toLowerCase().localeCompare(a.location.toLowerCase());
                    });
                }
            }

    
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
        processCheckout: function () {
            if (this.canCheckout) {
                this.showCheckout = false;
                this.showCart = false;
                this.showSuccess = true;
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
