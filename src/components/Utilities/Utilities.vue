<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="cogs" title="Utilities"/>Utilities</h3>
    <hr>
    <div v-if="user.showUtilities">
      <b-card-group deck>
          <!-- <b-card header="featured"
                  header-tag="header"
                  footer="Card Footer"
                  footer-tag="footer"
                  title="Title">
              <p class="card-text">Header and footers using props.</p>
              <b-button href="#"
                        variant="primary">Go somewhere</b-button>
          </b-card> -->
          <b-card title="Cobranded Param.js value finder"
                  header-tag="header"
                  footer-tag="footer">
              <h6 slot="header" class="mb-0">Params.js Finder</h6>
              <em slot="footer">Cobranded Value in param.js</em>
              <p class="card-text">Search for cobranded value in param.js</p>
              <b-button href="#" variant="primary" to="/params">Search Params</b-button>
          </b-card>
          <b-card title="Manage Users"
                  header-tag="header"
                  footer-tag="footer">
              <h6 slot="header"
                  class="mb-0">Users</h6>
              <em slot="footer">User Management</em>
              <p class="card-text">Change roles of users</p>
              <b-button href="#" variant="primary" to="/users">Manage Users</b-button>

          </b-card>
          <b-card title="Title"
                  header-tag="header"
                  footer-tag="footer">
              <h6 slot="header"
                  class="mb-0">Future</h6>
              <em slot="footer">Message</em>
              <p class="card-text">For next feature</p>
              <b-button href="#" variant="primary">Go somewhere</b-button>
          </b-card>
      </b-card-group>
    </div>
    <div v-else class="text-center">
      <p class="display-1">Private Property</p>
      <p class="display-3">NO TRESPASSING</p>
      <p class="display-4">Violators will be shot, survivors will be shot again !!!</p>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.AUTH_TOKEN_GETTER !== null;
    },
    user() {
      // console.log(this.$store.getters.AUTH_USER_DETAILS_GETTER);
      let details = this.$store.getters.AUTH_USER_DETAILS_GETTER;
      return { displayName: '', showUtilities: '', ...details };
    }
  },
  components: {
    FontAwesomeIcon
  }
}
</script>
