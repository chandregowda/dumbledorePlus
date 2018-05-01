<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="cubes" title="Process Details"/>Process Details</h3>
    <hr>
    <b-form inline>
        <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
        <b-form-select v-model="filters.environment" :options="envOptions" size="sm" />
        <b-form-select v-model="filters.datacenter" :options="filteredDataCenters" size="sm" />
        <b-form-input v-model="filters.ip" type="text" size="sm" placeholder="By SERVER" />
        <b-form-input v-model="filters.component" type="text" size="sm" placeholder="By COMPONENT" />
        <b-form-input v-model="filters.cobrandGroup" type="text" size="sm" placeholder="By COBRAND GROUP" />
        <b-form-input v-model="filters.build" type="text" size="sm" placeholder="By BUILD" />
        <b-form-input v-model="filters.processStartDate" type="text" size="sm" placeholder="By STARTED ON (PST)" />
        <b-button size="lg" class="ml-1" variant="link" @click="reload" :disabled="isLoading" v-b-popover.hover="'Refresh build details'" >
          <!-- <font-awesome-icon icon="spinner" spin v-if="isLoading" />  -->
          <font-awesome-icon icon="sync-alt" :spin="isLoading"/>
        </b-button>
    </b-form>
    <h6>*<small class="text-muted hint">Filters work with regular expression, Ex: "city|fide" in COBRAND GROUP will find both City and Fidelity, 'Apr 28|Apr 29' in STARTED ON will find process started on both days </small></h6>
    <br/>

    <div class="process-details-container">
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
          <template slot="show_more" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2" id="link-btn" variant="link">
              {{ row.detailsShowing ? 'Less &#65085;' : 'More &#65086;'}}
            </b-button>
          </template>

          <!-- <template slot="HEAD_actions" slot-scope="foo">
            <input @click.stop type="checkbox" :value="foo.column" v-model="allSelected"> ALL
          </template> -->

          <!-- <template slot="actions" slot-scope="cell"> -->
            <!-- <b-link size="sm" @click.stop="details(cell.item,cell.index,$event.target)">Action</b-link> -->
            <!-- <input type="checkbox" v-model="allSelected" v-show="allSelected"> -->
            <!-- <input type="checkbox" v-show="!allSelected"> -->
          <!-- </template> -->

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row>
                <b-col><b>PID: </b>{{row.item.pid}}</b-col>
                <b-col><b>JRE / NODE: </b>{{row.item.jreNodeVersion}}</b-col>
                <b-col><b>Deployment Method: </b>{{row.item.deploymentMethod}}</b-col>
                <b-col><b>Started by: </b>{{row.item.userStartingProcess}}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="3" class="text-sm-left"><b>Command:</b></b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col><pre>{{ row.item.command.split(',').join('\n\t').split(' ').join('\n') }}</pre></b-col>
              </b-row>
              <b-button size="sm" @click="row.toggleDetails" variant="outline-info">Hide Details</b-button>
            </b-card>
          </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';
import * as utils from '../assets/appUtils';

export default {
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
                environment: 'production',
                datacenter: null,
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
                    /* , variant: 'info' */
                },
                {
                    key: 'environment',
                    label: 'Env',
                    sortable: false,
                    formatter: value => {
                        return value.substr(0, 4).toUpperCase();
                    }
                },
                { key: 'datacenter', sortable: true, label: 'DC' },
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
                { key: 'port', sortable: false },
                { key: 'component', sortable: true },
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
                },
                {
                    key: 'generatedOn',
                    sortable: true,
                    label: 'Data Valid As On',
                    variant: 'info',
                    formatter: value => {
                        return new Date(value)
                            .toString()
                            .split(' ')
                            .splice(0, 5)
                            .join(' ');
                    }
                },
                { key: 'show_more', label: 'Details' }
                // { key: 'actions' }
                // { key: 'jreNodeVersion', sortable: true }
                // { key: 'pid', sortable: false }
            ]
        };
    },
    computed: {
        isLoading() {
            let isLoadingCompleted = this.$store.getters.PROCESS_FETCHING_GETTER;
            return isLoadingCompleted;
        },
        filteredDetails() {
            let filters = this.filters;
            let data = this.$store.getters.PROCESS_GETTER;
            for (const key in filters) {
                if (filters.hasOwnProperty(key) && filters[key]) {
                    const element = filters[key].trim();
                    if (element) {
                        let newData = data.filter(item => {
                            let reg = new RegExp(element.toLowerCase(), 'gi');
                            return reg.test(item[key].toString().toLowerCase());
                            // return item[key].toLowerCase().includes(element);
                        });
                        data = newData; // reassign filtered list
                    }
                }
            }
            return data;
        },
        filteredDataCenters() {
            let datacenters = this.$store.getters.DATACENTERS_GETTER;
            let environment = this.filters.environment;
            let filteredDatacenters = [{ value: null, text: 'By DATACENTER' }];
            if (datacenters && datacenters.length > 0) {
                filteredDatacenters = filteredDatacenters.concat(
                    datacenters.filter(dc => dc.environment === environment)
                );
            }
            return filteredDatacenters;
        }
    },
    created() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');

        let datacenters = this.$store.getters.DATACENTERS_GETTER;
        let oldProcessDetails = this.$store.getters.PROCESS_GETTER;
        let isLoadingCompleted = this.$store.getters.PROCESS_FETCHING_GETTER;

        if (!datacenters || !datacenters.length) {
            this.$store.dispatch('DATACENTERS_FETCH_ACTION'); // get the datacenters, make sure 'x-access-token' is set
        }
        if (!isLoadingCompleted && (!oldProcessDetails || !oldProcessDetails.length)) {
            this.$store.dispatch('PROCESS_GET_ALL_ACTION');
        }
    },
    methods: {
        reload() {
            this.loading = 1;
            this.$store.dispatch('PROCESS_FETCH_START_ACTION');
            this.$store.dispatch('PROCESS_GET_ALL_ACTION');
        }
    },
    components: {
        FontAwesomeIcon
    }
};
</script>

<style>
table.b-table > thead > tr > th,
table.b-table > tfoot > tr > th,
table.b-table > thead > tr > th.sorting,
table.b-table > tfoot > tr > th.sorting,
.table-sm th,
.table-sm td {
    font-size: 12px !important;
    white-space: nowrap;
}
</style>
<style scoped>
#link-btn {
    font-size: 12px;
    padding: 0 !important;
}

.form-inline .form-control,
select.form-control {
    font-size: 12px;
    margin: 0 2px;
}
.loading {
    font-size: 12px;
}
.hint {
    font-style: italic;
}
</style>
