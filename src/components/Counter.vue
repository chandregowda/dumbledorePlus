<template>
  <div>
    <button class='btn primary' @click='increment'>Increment</button>
    <button class='btn primary' @click='decrement'>Decrement</button>
    <button class='btn warning' @click='timerIncrement'>TimedIncrement</button>
    <hr/>
    <button class='btn warning' @click='authLogin'>AUTH Login {{getAuthToken}}</button>
  </div>
</template>
<script>
export default {
    methods: {
        increment() {
            this.$store.commit('increment');
        },
        decrement() {
            this.$store.commit('decrement');
        },
        timerIncrement() {
            console.log('Triggering Timed Increment');
            this.$store.dispatch('incrementAfterSometime');
        },
        authLogin() {
            console.log('Triggering Auth Login');
            this.$store.dispatch('AUTH_LOGIN_ACTION');
        }
    },
    computed: {
        getAuthToken() {
            console.log('GETTING AUTH Token');
            return this.$store.getters.AUTH_TOKEN_GETTER;
        }
    }
};
</script>
