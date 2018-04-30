<template>
  <span class="timer">{{now}}</span>
</template>

<script>
export default {
    data() {
        return {
            now: 0,
            timerHandler: null
        };
    },
    method: {
        startTimer() {
            console.log('Starting Timer');
            let starter = new Date().getTime();
            this.timerHandler = setInterval(() => {
                let current = new Date().getTime();
                this.now = parseFloat(current - starter);
            }, 500);
        },
        stopTimer() {
            console.log('Clearing Interval');
            clearInterval(this.timerHandler);
        }
    },
    destroyed() {
        this.stopTimer();
    }
    // computed: {
    //   currentTime () {
    //     setInterval
    //   }
    // }
};
</script>

<style scoped>
.timer {
    font-style: italic;
    font-size: 10px;
}
</style>
