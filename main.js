Vue.component('click-area', {
    template: `
        <div id="click-area">
            <img id="logo" src="https://i.imgur.com/Pl6SXmn.png" @click="handleClick('hand')">
            <img class="appreciator-img" src="https://i.imgur.com/CVH00Um.png" v-for="item in $root.appreciators">           
            <img class="appreciator-img" src="https://i.imgur.com/X3m5Asv.png" v-for="item in $root.teachers">
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
            Current Rate: {{$root.abbreviateNumber(($root.appreciators ** 2) + ((2 * $root.teachers) * $root.appreciators))}} /s
        </div>
    `
});

Vue.component("store-area", {
    template: `
        <div id="store">
            <div class="store-item">
                <div>Item</div>
                <div>Price</div>
                <div>Buy</div>
                <div>Count</div>
            </div>

            <div class="store-item">
                <div>Student</div>
                {{$root.abbreviateNumber($root.appreciatorPrice)}}
                <button class="active" v-if="$root.courageCoins >= $root.appreciatorPrice" v-on:click="buyItem('appreciator')">Buy</button>
                <button v-else disabled>Buy</button>
                {{$root.appreciators}}
            </div>

            <div class="store-item">
                <div>Teacher</div>
                {{$root.abbreviateNumber($root.teacherPrice)}}
                <button class="active" v-if="$root.courageCoins >= $root.teacherPrice" v-on:click="buyItem('teacher')">Buy</button>
                <button v-else disabled>Buy</button>
                {{$root.teachers}}
            </div>

            <!-- <button v-on:click="buyItem('admin')">add coins [admin]</button> -->

            <div>Most recent commit title: {{$root.recentCommit}}</div>
            
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
            } else if (item == "teacher") {
                if (this.$root.courageCoins >= this.$root.teacherPrice) {
                    this.$root.teachers++;
                    this.$root.courageCoins -= this.$root.teacherPrice;
                    this.$root.teacherPrice = Math.floor(this.$root.teacherPrice *= 1.6);
                }
            } else if (item == "admin") {
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
        teachers: 0,
        appreciatorPrice: 50,
        teacherPrice: 3000,
        events: [
            [10, "Troubled Boy's School", (root) => {
                root.appreciators = Math.floor(root.appreciators * (root.randomNum(8, 9) * .1));
            }, false],
            [20, 'Values Misaligned', (root) => {
                root.appreciators -= 2;
            }, false],
            [27, 'The Drug Year', (root) => {
                root.appreciators = Math.floor(root.appreciators * (root.randomNum(5, 9) * .1));
            }, false],
            [33, "Join the navy", (root) => {
                root.appreciators -= 1;
            }, false],
            [40, 'The Druuug Year', (root) => {
                root.appreciators = Math.floor(root.appreciators * (root.randomNum(5, 9) * .1));
            }, false],
        ],
        recentCommit: ""
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
        },
        fetchLog() {
            let self = this;
            axios.get("https://cors-anywhere.herokuapp.com/" + "https://github.com/coderLads/pscsclicker/commits/master.atom").then(response => {
                let parser = new DOMParser();
                let xmlDoc = parser.parseFromString(response.data, "text/xml");
                let items = xmlDoc.getElementsByTagName("entry");
                self.recentCommit = items[0]['textContent'].split(">")[1].split("<")[0];
            });
        }
    },
    mounted() {
        let self = this;
        setInterval(function () {
            self.courageCoins += (self.appreciators ** 2) + ((2 * self.teachers) * self.appreciators);

            self.events.forEach(e => {
                if (self.appreciators >= e[0] && e[3] == false) {
                    e[3] = true;
                    setTimeout(() => {
                        e[2](self);
                        console.log(e[1]);
                        alert(e[1]);
                    }, Math.random() * 1000 * 30);
                }
            })
        }, 1000);
        this.fetchLog();
    },
});