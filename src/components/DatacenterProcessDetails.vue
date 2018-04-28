<template>
  <div class="container-fluid ">
    <h3 class="mt-3">
      <font-awesome-icon class="mr-3" size="lg" icon="sitemap" title="Datacenter Process Details"/>
      Datacenter Process Details - <span class="h6">{{dcInfo.environment.toUpperCase()}} - {{dcInfo.dc.toUpperCase()}}</span>
    </h3>
    <hr>
    <div class="row">
      <!-- <div class="col-sm2">
        <p clsss="h5">Components Summary</p>
        <app-component-summary :componentDetails="dcInfo.dcDetails.components" />
      </div> -->
      <div class="col">
        <b-form inline>
          <font-awesome-icon icon="filter" class="success"/>
          <b-form-input class="small" v-model="filters.ip" type="text" size="sm" placeholder="By SERVER" />
          <b-form-select v-model="filters.component" :options="componentOptions" size="sm" />
          <!-- <b-form-input class="small" v-model="filters.component" type="text" size="sm" placeholder="By COMPONENT" /> -->
          <b-form-input class="medium" v-model="filters.cobrandGroup" type="text" size="sm" placeholder="By COBRAND GROUP" />
          <b-form-input class="small" v-model="filters.build" type="text" size="sm" placeholder="By BUILD" />
          <b-form-input class="medium" v-model="filters.processStartDate" type="text" size="sm" placeholder="By STARTED ON (PST)" />
        </b-form>
        <br/>

        <div>
          <b-table
            show-empty
            striped
            bordered
            small
            hover
            foot-clone
            responsive="true"
            head-variant="light"
            :items="filteredDetails"
            :fields="fields">
              <template slot="index" slot-scope="data">
                {{data.index + 1}}
              </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import ComponentSummary from './ComponentSummary';
import axios from '../axios-auth';
import * as utils from '../assets/appUtils';

export default {
    props: ['dcInfo'],
    data() {
        return {
            // fields: ['first_name', 'last_name', 'age'],
            allSelected: '',
            envOptions: [
                { value: null, text: 'By ENVIRONMENT' },
                { value: 'production', text: 'Production' },
                { value: 'stage', text: 'Stage' }
            ],
            filters: {
                environment: this.dcInfo.environment,
                datacenter: this.dcInfo.dc,
                ip: '',
                component: '',
                cobrandGroup: '',
                build: '',
                processStartDate: ''
            },
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: 'SORTABLE_IP',
                    sortable: true,
                    label: 'Server',
                    formatter: value => {
                        return utils.thousandSeparator(value);
                    }
                },
                {
                    key: 'instance',
                    sortable: false,
                    label: 'Inst'
                },
                { key: 'component', sortable: false },
                { key: 'cobrandGroup', sortable: true },
                { key: 'build', sortable: true },
                { key: 'processStartDate', sortable: false, label: 'Started On (PST)' },
                {
                    key: 'processStartTime',
                    sortable: false,
                    label: 'Started At'
                },
                {
                    key: 'timestamp',
                    sortable: true,
                    label: 'Started On (IST)',
                    formatter: value => {
                        return new Date(value)
                            .toString()
                            .split(' ')
                            .splice(0, 5)
                            .join(' ');
                    }
                }
            ]
        };
    },
    computed: {
        filteredDetails() {
            let filters = this.filters;
            let data = this.$store.getters.PROCESS_GETTER;
            for (const key in filters) {
                if (filters.hasOwnProperty(key) && filters[key]) {
                    const element = filters[key].toString().trim();
                    if (element) {
                        let newData = data.filter(item => {
                            if (key === 'component') {
                                return item[key] === element;
                            }
                            return item[key].toLowerCase().includes(element.toLowerCase());
                        });
                        data = newData; // reassign filtered list
                    }
                }
            }
            return data;
        },
        componentOptions() {
          let obj = this.dcInfo.dcDetails.components;
            return Object.keys( obj || {})
                .sort(function(a, b) {
                    return a.toLowerCase().localeCompare(b, 'en', { sensitivity: 'base' });
                })
                .map(k => ({ value: k, text: `${k} (${obj[k]})` }));
        }
    },
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
    },
    mounted() {
        this.filters.environment = this.dcInfo.environment;
        this.filters.datacenter = this.dcInfo.dc;
        this.filters.component = this.componentOptions[0].value || '';
    },
    components: {
        FontAwesomeIcon,
        appComponentSummary: ComponentSummary
    }
};
</script>

<style scoped>
input.small {
    width: 120px;
}
input.medium {
    width: 150px;
}
</style>
