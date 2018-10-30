Vue.component('click-area', {
    template: `
        <div id="click-area">

            <img id="logo" src="https://i.imgur.com/Pl6SXmn.png" @click="handleClick('hand')">

            <img class="appreciator-img" src="https://i.imgur.com/CVH00Um.png" v-for="item in $root.appreciators">           

        </div>
    `,
    methods: {
        handleClick(status) {
            if(status == "hand") {
                this.$root.courageCoins++;
            }
        }
    }
});



Vue.component("stat-area", {
    template: `
        <div id="stat-area">
            Courage Coins: {{$root.courageCoins}}
            Current Rate: {{$root.appreciators**2}} /s
            Students: {{$root.appreciators}}
        </div>
    `
});

Vue.component("store-area", {
    template: `
        <div id="auto-appreciation">
            <button v-on:click="buyItem('appreciator')">Buy Student</button>
            current price: {{$root.appreciatorPrice}}

            <button v-on:click="buyItem('admin')">add coins [admin]</button>
        </div>
    `,
    methods: {
        buyItem(item) {
            if(item == "appreciator") {
                if(this.$root.courageCoins >= this.$root.appreciatorPrice) {
                    this.$root.appreciators++;
                    this.$root.courageCoins -= this.$root.appreciatorPrice;
                    this.$root.appreciatorPrice = Math.floor(this.$root.appreciatorPrice *= 1.35);
                }
            }
            if(item == "admin"){
                this.$root.courageCoins += 1000;
            }
        }
    }
})

let app = new Vue({
    el: "#app",
    data: {
        courageCoins: 50,
        appreciators: 1,
        appreciatorPrice: 50
    },
    methods: {

    },
    mounted() {
        let self = this;
        setInterval(function () {
            self.courageCoins += (self.appreciators**2);
        }, 1000)
    },
});