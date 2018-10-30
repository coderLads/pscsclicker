Vue.component('click-area', {
    template: `
        <div id="click-area">
            <img id="logo" src="https://i.imgur.com/Pl6SXmn.png" @click="handleClick('hand')">
            <img class="appreciator-img" src="https://i.imgur.com/CVH00Um.png" v-for="item in $root.students">           
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
            <div>Courage Coins: {{$root.abbreviateNumber($root.courageCoins)}}</div>
            <div>Current Rate: {{$root.abbreviateNumber(($root.students ** 2) + ((2 * $root.teachers) * $root.students))}} /s</div>
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
                {{$root.abbreviateNumber($root.studentPrice)}}
                <button class="active" v-if="$root.courageCoins >= $root.studentPrice" v-on:click="buyItem('student')">Buy</button>
                <button v-else disabled>Buy</button>
                {{$root.students}}
            </div>

            <div class="store-item">
                <div>Teacher</div>
                {{$root.abbreviateNumber($root.teacherPrice)}}
                <button class="active" v-if="$root.courageCoins >= $root.teacherPrice" v-on:click="buyItem('teacher')">Buy</button>
                <button v-else disabled>Buy</button>
                {{$root.teachers}}
            </div>

            <!-- <button v-on:click="buyItem('admin')">add coins [admin]</button> -->

            <div v-if="$root.recentCommit" id="updates">Recent update: {{$root.recentCommit}}</div>
            
        </div>
    `,
    methods: {
        buyItem(item) {
            let self = this.$root;
            if (item == "student") {
                if (self.courageCoins >= self.studentPrice) {
                    self.students++;
                    self.courageCoins -= self.studentPrice;
                    self.studentPrice = Math.floor(self.studentPrice *= 1.35);
                }
            } else if (item == "teacher") {
                if (self.courageCoins >= self.teacherPrice) {
                    self.teachers++;
                    self.courageCoins -= self.teacherPrice;
                    self.teacherPrice = Math.floor(self.teacherPrice *= 1.6);
                }
            } else if (item == "admin") {
                self.courageCoins += 1000;
            }
        }
    }
})

let app = new Vue({
    el: "#app",
    data: {
        courageCoins: 0,
        students: 0,
        teachers: 0,
        studentPrice: 50,
        teacherPrice: 3000,
        events: [
            [10, "Troubled Boy's School", (root) => {
                root.students = Math.floor(root.students * (root.randomNum(8, 9) * .1));
            }, false],
            [20, 'Values Misaligned', (root) => {
                root.students -= 2;
            }, false],
            [27, 'The Drug Year', (root) => {
                root.students = Math.floor(root.students * (root.randomNum(5, 9) * .1));
            }, false],
            [33, "Join the navy", (root) => {
                root.students -= 1;
            }, false],
            [40, 'The Druuug Year', (root) => {
                root.students = Math.floor(root.students * (root.randomNum(7, 9) * .1));
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
        let currentStudents;
        let eventString;
        setInterval(function () {
            self.courageCoins += (self.students ** 2) + ((2 * self.teachers) * self.students);

            self.events.forEach(e => {
                if (self.students >= e[0] && e[3] == false) {
                    e[3] = true;
                    setTimeout(() => {
                        currentStudents = self.students;
                        e[2](self);
                        eventString = ("The event: " + e[1] + " occurred, you lost " + (currentStudents - self.students) + " students");
                        console.log(eventString);
                        alert(eventString);
                    }, Math.random() * 1000 * 120);
                }
            })
        }, 1000);
        this.fetchLog();
    },
});