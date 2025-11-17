new Vue({
    el: '#app',
    data: {
        showCart: false,
        showCheckout: false,
        showSuccess: false,
        cartItems: [],
        checkoutForm: {
            parentName: '',
            phone: ''
        },
       // searchQuery: '',
       // sortOption: '', // '', 'price-asc', 'price-desc', 'location-asc', 'location-desc'
        lessons: [
            {
                id: 1,
                subject: 'Football Training',
                location: 'Sports Hall A',
                price: 15,
                spaces: 8,
                icon: 'icons/football.png'
            },
            {
                id: 2,
                subject: 'Art & Crafts',
                location: 'Art Room 2B',
                price: 12,
                spaces: 5,
                icon: 'icons/art.png'
            },
            {
                id: 3,
                subject: 'Piano Lessons',
                location: 'Music Room 1',
                price: 25,
                spaces: 3,
                icon: 'icons/piano.png'
            },
            {
                id: 4,
                subject: 'Drama Club',
                location: 'Main Hall',
                price: 18,
                spaces: 12,
                icon: 'icons/drama.png'
            },
            {
                id: 5,
                subject: 'Chess Club',
                location: 'Library',
                price: 10,
                spaces: 0,
                icon: 'icons/chess.png'
            },
            {
                id: 6,
                subject: 'Swimming',
                location: 'Pool Complex',
                price: 20,
                spaces: 6,
                icon: 'icons/swimming.png'
            },
            {
                id: 7,
                subject: 'Coding for Kids',
                location: 'Computer Lab',
                price: 22,
                spaces: 4,
                icon: 'icons/coding.png'
            },
            {
                id: 8,
                subject: 'Dance Classes',
                location: 'Dance Studio',
                price: 16,
                spaces: 9,
                icon: 'icons/dance.png'
            },
            {
                id: 9,
                subject: 'Science Club',
                location: 'Lab Room 3C',
                price: 14,
                spaces: 7,
                icon: 'icons/science.png'
            },
            {
                id: 10,
                subject: 'Basketball',
                location: 'Gymnasium',
                price: 17,
                spaces: 2,
                icon: 'icons/basketball.png'
            },
            {
                id: 11,
                subject: 'Cooking Class',
                location: 'Kitchen Lab',
                price: 19,
                spaces: 6,
                icon: 'icons/cooking.png'
            },
            {
                id: 12,
                subject: 'Guitar Lessons',
                location: 'Music Room 2',
                price: 24,
                spaces: 1,
                icon: 'icons/guitar.png'
            }
        ]
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
           //work in progress
            /*var self = this;
            var query = this.searchQuery.trim().toLowerCase();

            var results = this.lessons.filter(function (lesson) {
                if (!query) return true;
                return lesson.subject.toLowerCase().includes(query) ||
                    lesson.location.toLowerCase().includes(query);
            });
            */
              //  Search disabled → simply return all lessons
            var results = this.lessons;

            //  Sorting functionality also removed previously
            return results;
//Sorting functionality in progress
         /*   if (this.sortOption) {
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
*/
    
        }
    },
    methods: {
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

        // ✅ Inserted from your extracted code:
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
