<template>
  <div class="container">

      <hr>
      <b-jumbotron :header="title" lead="The ultimate truth with higher efficiency" >
        <p>Best viewed in Google Chrome Browser</p>
        <b-btn variant="primary" @click="$router.push('/process')">Proceed to Process Details</b-btn>
      </b-jumbotron>
  </div>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';

export default {
    name: 'FAExample',
    data() {
        return {
            title: 'Dumbledore +'
        };
    },
    components: {
        FontAwesomeIcon
    },
    // mounted() {
    //     axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
    //     this.$store.dispatch('DATACENTERS_FETCH_ACTION'); // get the datacenters, make sure 'x-access-token' is set
    // },
    created() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');

        let datacenters = this.$store.getters.DATACENTERS_GETTER;
        let oldProcessDetails = this.$store.getters.PROCESS_GETTER;
        if (!datacenters || !datacenters.length) {
            this.$store.dispatch('DATACENTERS_FETCH_ACTION'); // get the datacenters, make sure 'x-access-token' is set
        }
        if (!oldProcessDetails || !oldProcessDetails.length) {
            this.$store.dispatch('PROCESS_GET_ALL_ACTION');
        }
    }
};
</script>
