<template>
  <span class="timer text-danger">{{ellapsedTime}}</span>
</template>

<script>
import moment from 'moment-timezone';

export default {
    data() {
        return {
            ellapsedMoment: null
        };
    },
    destroyed() {
        if (this.timer) {
            clearInterval(this.timer);
            this.ellapsedMoment = null;
        }
    },
    computed: {
        ellapsedTime() {
            return this.ellapsedMoment ? this.ellapsedMoment.format('HH:mm:ss') : '00:00:00';
        }
    },
    mounted() {
        this.timer = setInterval(() => {
            if (!this.ellapsedMoment) {
                this.ellapsedMoment = moment('2018-01-01');
            }
            this.ellapsedMoment = moment(this.ellapsedMoment).add(1, 's');
        }, 1000);
    }
};
</script>

<style scoped>
.timer {
    font-style: italic;
    font-size: 12px;
}
</style>
