<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <app-store-demo /> -->
    <app-header />
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header';
import StoreDemo from './components/StoreDemo';
export default {
    components: {
        appHeader: Header,
        appStoreDemo: StoreDemo
    },
    created() {
        this.$store.dispatch('AUTH_AUTO_LOGIN_ACTION');
    }
};
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    /* text-align: center; */
    /* margin-top: 60px; */
}
</style>
