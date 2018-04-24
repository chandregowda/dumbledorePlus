<template>
  <div>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">Dumbledore + </b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
      <template v-if="isAuthenticated">
        <b-navbar-brand to="#" active-class="active" exact >Welcome, {{user.displayName}}</b-navbar-brand>
        <b-nav-item to="/home" active-class="active" exact >Home</b-nav-item>
        <b-nav-item to="/dashboard" active-class="active" >Dashboard</b-nav-item>
        <button class='logout' @click='logout' >Logout</button>
      </template>
    </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  </div>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return this.$store.getters.AUTH_TOKEN_GETTER !== null;
        },
        user() {
            // console.log(this.$store.getters.AUTH_USER_DETAILS_GETTER);
            let details = this.$store.getters.AUTH_USER_DETAILS_GETTER;
            return { displayName: '', ...details };
        }
    },
    methods: {
        logout() {
            return this.$store.dispatch('AUTH_LOGOUT_ACTION');
        }
    }
};
</script>
<style>
.logout {
    background-color: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
}
.logout:hover {
    color: rgba(255, 255, 255, 0.75);
}
</style>
