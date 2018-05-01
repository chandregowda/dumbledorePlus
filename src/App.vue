<template>
  <div id="app" class="container-fluid full-width">
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
        this.$store.dispatch('START_TIMEZONE_TIMER');
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
    padding: 0;
}
@media (min-width: 992px) {
    .modal-lg {
        max-width: 1200px;
    }
}
#modal2.bigModal .modal-content,
#modal2 div.modal-dialog.modal-lg,
#modal2 div.modal-lg {
    max-width: 1100px !important;
    min-width: 890px !important;
}

button:disabled {
    cursor: not-allowed;
}

/* SCROLL BAR CHANGE */
/* width */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

/* Track */
::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px transparent;
    border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
    /* background: #e4e4e4; */
    background: #b5d8f5;
    border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    /* background: #cdcdcd; */
    background: #f5c27f;
}

/* END of scroll */
</style>
