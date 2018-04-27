<template>
  <div class="container">
    <!-- <p>
      <font-awesome-icon icon="spinner" />
      <font-awesome-icon icon="spinner" spin />
      <font-awesome-icon icon="spinner" pulse />
      <font-awesome-icon icon="sign-out-alt" />
      <font-awesome-icon :icon="['fas', 'spinner']" />
      <font-awesome-icon icon="chess-king" />
      <font-awesome-icon icon="dove" />
      <font-awesome-icon icon="cubes" />
      <font-awesome-icon icon="server" />
      </p> -->
      <hr>
      <b-jumbotron header="Dumbledore +" lead="Dumbledore with higher efficiency" >
        <p>For more information contach Chandregowda</p>
        <b-btn variant="primary" href="#">Call Chandru</b-btn>
      </b-jumbotron>
  </div>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';

export default {
    name: 'FAExample',

    components: {
        FontAwesomeIcon
    },
    mounted() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        this.$store.dispatch('DATACENTERS_FETCH_ACTION'); // get the datacenters, make sure 'x-access-token' is set
    }
};
</script>
