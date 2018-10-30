Vue.component('click-area', {
    template: `
        <div id="click-area">
            <img id="logo" src="https://i.imgur.com/Pl6SXmn.png" @click="handleClick('hand')">
            <img class="appreciator-img" src="https://i.imgur.com/CVH00Um.png" v-for="item in $root.appreciators">           

        </div>
    `,
    methods: {
        handleClick(status) {
            if (status == "hand") {
                this.$root.courageCoins++;
            }
        }
    }
});

Vue.component("stat-area", {
    template: `
        <div id="stat-area">
            Courage Coins: {{$root.abbreviateNumber($root.courageCoins)}}
            Current Rate: {{$root.abbreviateNumber($root.appreciators**2)}} /s
            Students: {{$root.abbreviateNumber($root.appreciators)}}
        </div>
    `
});

Vue.component("store-area", {
    template: `
        <div id="store">
            <button v-on:click="buyItem('appreciator')">Buy Student</button>
            current price: {{$root.abbreviateNumber($root.appreciatorPrice)}}
            <!-- <button v-on:click="buyItem('admin')">add coins [admin]</button> -->
        </div>
    `,
    methods: {
        buyItem(item) {
            if (item == "appreciator") {
                if (this.$root.courageCoins >= this.$root.appreciatorPrice) {
                    this.$root.appreciators++;
                    this.$root.courageCoins -= this.$root.appreciatorPrice;
                    this.$root.appreciatorPrice = Math.floor(this.$root.appreciatorPrice *= 1.35);
                }
            }
            if (item == "admin") {
                this.$root.courageCoins += 1000;
            }
        }
    }
})

let app = new Vue({
    el: "#app",
    data: {
        courageCoins: 0,
        appreciators: 0,
        appreciatorPrice: 50,
        events: [
            [10, "Troubled Boy's School", (root) => {
                root.appreciators *= (root.randomNum(8, 9) * .1);
            }, false],
            [20, 'Values Misaligned', (root) => {
                root.appreciators -= 2;
            }, false],
            [30, 'The Drug Year', (root) => {
                root.appreciators *= (root.randomNum(5, 9) * .1)
            }, false]
        ],
    },
    methods: {
        abbreviateNumber: function (value) {
            let newValue = value;
            if (value >= 1000) {
                let suffixes = ["", "k", "m", "b", "t"];
                let suffixNum = Math.floor(("" + value).length / 3);
                let shortValue = '';
                for (let precision = 2; precision >= 1; precision--) {
                    shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                    let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                    if (dotLessShortValue.length <= 2) {
                        break;
                    }
                }
                if (shortValue % 1 != 0) shortNum = shortValue.toFixed(1);
                newValue = shortValue + suffixes[suffixNum];
            }
            return newValue;
        },
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    mounted() {
        let self = this;
        setInterval(function () {
            self.courageCoins += (self.appreciators ** 2);

            self.events.forEach(e => {
                if (self.appreciators == e[0] && e[3] == false) {
                    e[3] = true;
                    setTimeout(() => {
                        e[2](self);
                        console.log(e[1]);
                        alert(e[1]);
                    }, Math.random() * 1000 * 30);
                }
            })
        }, 1000)
    },
});