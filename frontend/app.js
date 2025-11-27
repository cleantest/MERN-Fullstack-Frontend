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
  cartTotal() {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  },
    isValidName() {
    if (!this.checkoutForm.parentName) return true;
    return /^[a-zA-Z\s]+$/.test(this.checkoutForm.parentName);
  },

  isValidPhone() {
    if (!this.checkoutForm.phone) return true;
    return /^\d+$/.test(this.checkoutForm.phone);
  },

  canCheckout() {
    return (
      this.isValidName &&
      this.isValidPhone &&
      this.checkoutForm.parentName.trim() !== '' &&
      this.checkoutForm.phone.trim() !== '' &&
      this.cartItems.length > 0
    );
  },

  // 🔍 Independent search results
  filteredsearchResults() {
    let query = this.searchQuery.trim().toLowerCase();
    if (!query) return null; // means "no search applied"

    return this.lessons.filter(lesson =>
      lesson.subject.toLowerCase().includes(query) ||
      lesson.location.toLowerCase().includes(query)
    );
  },

  // ↕ Independent sorting results
  sortedResults() {
    let results = [...this.lessons];

    switch (this.sortOption) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'location-asc':
        results.sort((a, b) =>
          a.location.toLowerCase().localeCompare(b.location.toLowerCase())
        );
        break;
      case 'location-desc':
        results.sort((a, b) =>
          b.location.toLowerCase().localeCompare(a.location.toLowerCase())
        );
        break;
    }

    return results;
  },

  // 🎯 Decide which list to show
  finalLessonsToDisplay() {
    if (this.searchQuery.trim() !== "") {
      return this.filteredsearchResults;
    }
    return this.sortedResults;
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
        
    // POST order to backend
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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        })
        .then(res => res.json());
    },

    // PUT update lesson spaces in backend
    updateLessonSpaces: function () {
        const updates = this.cartItems.map(item => {
            // find the lesson in the list to get the updated spaces count
            const lesson = this.lessons.find(l => l.id === item.id);
            return fetch(`${this.appURL}/lessons/${item.id}/spaces`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spaces: lesson.spaces })
            });
        });

        return Promise.all(updates);
    },

        toggleCart: function () {
            this.showCart = !this.showCart;
        },
        addToCart: function (lesson) {
            if (lesson.spaces > 0 && !this.isInCart(lesson)) {
                lesson.spaces--;
                

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
            var originalLesson = this.lessons.find(l => l.id === item.id);
                originalLesson.spaces++;

                var index = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
                if (index > -1) this.cartItems.splice(index, 1);
            },
           
        isInCart: function (lesson) {
            return this.cartItems.some(item => item.id === lesson.id); 
                return item.id === lesson.id;
            },
        
      processCheckout: function () {
        if (!this.canCheckout) return;

        // Step 1: Save order
        this.saveOrder()
            .then(() => {
                // Step 2: Update lesson spaces in DB
                return this.updateLessonSpaces();
            })
            .then(() => {
                // Step 3: Show success message
                this.showCheckout = false;
                this.showCart = false;
                this.showSuccess = true;

                // Optional: re-fetch lessons from server
                this.fetchLessons();
            })
            .catch(err => console.error("Checkout error:", err));
    },

    resetApp: function () {
        this.showSuccess = false;
        this.cartItems = [];
        this.checkoutForm.parentName = '';
        this.checkoutForm.phone = '';
    }
        
}
    
});
