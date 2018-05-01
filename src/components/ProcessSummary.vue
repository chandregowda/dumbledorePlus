<template>
  <div class="container-fluid ">
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="chart-pie" title="Process Summary"/>Process Summary</h3>
    <hr>
    <b-card no-body>
      <b-tabs small card v-model="tabIndex">
        <b-tab :title="environment.toUpperCase()" v-for="(details, environment) of getProcessSummary" :key="environment">
          <p class="h5"><span class="brown">{{details.totalIp}}</span> IP's running <span class="brown">{{details.totalProcess}}</span> process</p>
            <div class="card-deck">
              <div class="card" v-for="(dcDetails, dc) of details.datacenters" :key="dc">
                <div class="card-body">
                  <b-button size="md" v-b-popover.hover="'Click here for scanning logs'"  variant="link" class="h3 card-title" @click="moreActions({environment, dc, dcDetails})">
                    {{dc.toUpperCase()}}
                  </b-button>
                  <!-- <p class="h3 card-title">{{dc.toUpperCase()}}</p> -->
                  <h6 class="card-subtitle mb-2 text-muted">IP:{{dcDetails.totalIp}}, Process:{{dcDetails.totalComponent}}</h6>
                  <app-component-summary :componentDetails="dcDetails.components" />
                </div>
              </div>
            </div>
            <!-- <div class="card p-2 d-flex align-content-start flex-fill text-center datacenters" v-for="(dcDetails, dcName) of value.datacenters" :key="dcName"> -->
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import ComponentSummary from './ComponentSummary';

export default {
    data() {
        return {
            tabIndex: 0
        };
    },
    methods: {
        moreActions(dcInfo) {
            this.$router.push({ name: 'DatacenterProcessDetails', params: { dcInfo } });
        }
    },
    computed: {
        getProcessSummary() {
            return this.$store.getters.PROCESS_SUMMARY_GETTER;
        }
    },
    components: {
        FontAwesomeIcon,
        appComponentSummary: ComponentSummary
    }
};
</script>

<style scoped>
.brown {
    color: brown;
}
.card-body {
    font-size: 0.8rem;
}
.card-deck {
    box-sizing: border-box;
}
.card-deck .card {
    margin-right: 5px;
    margin-left: 5px;
}
.card-deck .card .card-body {
    padding: 5px;
}
</style>
