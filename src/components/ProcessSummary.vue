<template>
  <div class="container-fluid">
    <h3>Process Summary</h3>
    <hr>
      <b-card no-body>
      <b-tabs small card v-model="tabIndex">
        <b-tab :title="key.toUpperCase()" v-for="(value, key) of getProcessSummary" :key="key">
          <p class="h5"><span class="brown">{{value.totalIp}}</span> IP's running <span class="brown">{{value.totalProcess}}</span> process</p>
            <div class="card-deck">
              <div class="card" v-for="(dcDetails, dcName) of value.datacenters" :key="dcName">
                <div class="card-body">
                  <h6 class="card-title">{{dcName.toUpperCase()}}</h6>
                  <h6 class="card-subtitle mb-2 text-muted">IP:{{dcDetails.totalIp}}, Process:{{dcDetails.totalComponent}}</h6>
                  <section class="card-text">
                    <b-table :items="formatedComponents(dcDetails.components)" :fields="fields"
                    show-empty
                    striped
                    bordered
                    small
                    hover
                    responsive="true"
                    head-variant="light" />
                  </section>
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
export default {
    data() {
        return {
            tabIndex: 0,
            fields: [
                {
                    key: 'component',
                    sortable: true
                },
                {
                    key: 'count',
                    label: 'Nos'
                }
            ]
        };
    },
    methods: {
        formatedComponents(obj) {
            return Object.keys(obj)
                .sort(function(a, b) {
                    return a.toLowerCase().localeCompare(b, 'en', { sensitivity: 'base' });
                })
                .map(k => ({ component: k, count: obj[k] }));
        }
    },
    computed: {
        getProcessSummary() {
            return this.$store.getters.PROCESS_SUMMARY_GETTER;
        }
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
