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
          <b-form-input v-model="filters.ip" type="text" size="sm" placeholder="By SERVER" />
          <b-form-select v-model="filters.component" :options="componentOptions" size="sm" />
          <!-- <b-form-input class="small" v-model="filters.component" type="text" size="sm" placeholder="By COMPONENT" /> -->
          <b-form-input v-model="filters.cobrandGroup" type="text" size="sm" placeholder="By COBRAND GROUP" />
          <b-form-input v-model="filters.build" type="text" size="sm" placeholder="By BUILD" />
          <b-form-input v-model="filters.processStartDate" type="text" size="sm" placeholder="By STARTED ON (PST)" />
          <b-form-input v-model="filters.pid" type="text" size="sm" placeholder="By PROCESS ID" />
          <!-- <b-button size="sm" class="ml-1" variant="outline-warning" @click="scanLogs" :disabled="isLoading">
            <font-awesome-icon icon="spinner" spin v-if="isLoading" /> <span v-if="isLoading" class="loading"> please wait...</span>
            <font-awesome-icon icon="binoculars" v-if="!isLoading" /> <span v-if="!isLoading" class="log-summary">Scan Logs</span>
          </b-button> -->
          <div class="ml-3">
            <b-btn size="sm" variant="outline-info" v-b-modal.modal1  :disabled="isLoading"> <font-awesome-icon icon="binoculars" />{{scanActionText}}</b-btn>
            <!-- Modal Component -->
            <b-modal ref="myModalRef" hide-footer id="modal1" title="Scan Options" v-model="modalShow">
              <div class="my-1">
                <div class="row">
                  <div class="col-3">
                    <b-form-group label="Log Type">
                      <b-form-radio-group id="logTypes" v-model="scanOptions.logType" name="radioSubComponent">
                        <b-form-radio value="server">Server</b-form-radio>
                        <b-form-radio value="core">Core</b-form-radio>
                      </b-form-radio-group>
                    </b-form-group>
                  </div>
                  <div class="col-3">
                    <b-form-group label="Search Date">
                      <b-form-input class="small" v-model.trim="scanOptions.searchDate" type="text" size="sm" placeholder="Search Date" />
                    </b-form-group>
                  </div>
                  <div class="col">
                    <b-form-group label="Search String (optional)">
                      <b-form-input v-model.trim="scanOptions.searchString" type="text" size="sm" placeholder="Search String" />
                    </b-form-group>
                  </div>
                </div>

              </div>
              <b-btn class="mt-3" variant="outline-info" block @click="scanLogs" :disabled="isLoading">
                <font-awesome-icon icon="spinner" spin v-if="isLoading" /> <span v-if="isLoading" class="loading"> Scanning is in progress, please wait...</span>
                <font-awesome-icon icon="binoculars" v-if="!isLoading" /> <span v-if="!isLoading" class="log-summary">{{scanText}}</span>
              </b-btn>
              <!-- <b-btn class="mt-3" variant="outline-info" hide-footer block @click="hideModal">Scan Now</b-btn> -->
            </b-modal>
          </div>

          <div class="ml-3">
            <!-- Modal Component -->
            <b-modal ref="myModalRef" size="lg" hide-footer id="modal2" title="Scan Result" v-model="resultmodalShow">
              <app-exception-summary :exceptionDetails="exceptionDetails" :filters="filters" :scanOptions="scanOptions"/>
              <b-btn class="mt-3" variant="outline-info" hide-footer block @click="hideModal">Analysis Completed</b-btn>
            </b-modal>
          </div>

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
import ExceptionSummary from './ExceptionSummary';
import axios from '../axios-auth';
import * as utils from '../assets/appUtils';
import moment from 'moment';

export default {
    props: ['dcInfo'],
    data() {
        return {
            isLoading: false,
            modalShow: false,
            resultmodalShow: false,
            scanText: 'Scan Now',
            scanActionText: 'Scan Options',
            exceptionDetails: null,
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
                processStartDate: '',
                pid: ''
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
                },
                { key: 'pid', label: 'Process ID' }
            ],
            scanOptions: {
                logType: 'server',
                searchDate: moment().format('YYYY-MM-DD'),
                searchString: ''
            }
        };
    },
    methods: {
        scanLogs() {
            this.isLoading = true;
            this.scanActionText = 'Scanning in progress';
            let processInfo = this.filteredDetails.map(processDetails => {
                let { ip, instance, component, deploymentMethod } = processDetails;
                return { ip, instance, component, deploymentMethod };
            });
            let from =
                localStorage.getItem('accountName') ||
                this.$store.getters.AUTH_USER_DETAILS_GETTER.accountName ||
                'Unknown';

            axios
                .post('/scanner/getComponentExceptionSummary', {
                    mailTo: from + '@yodlee.com',
                    environments: [this.dcInfo.environment],
                    datacenters: [this.dcInfo.dc],
                    logType: this.scanOptions.logType,
                    searchString: this.scanOptions.searchString,
                    searchDate: this.scanOptions.searchDate || moment().format('YYYY-MM-DD'),
                    processInfo,
                    logPath: '/var/log'
                })
                .then(result => {
                    console.log('Got result', result);
                    this.exceptionDetails = result.data;
                    this.isLoading = false;
                    this.scanActionText = 'Scan Options';
                    if (result.data.length) {
                        this.modalShow = false;
                        setTimeout(() => {
                            this.resultmodalShow = true;
                        }, 1000);
                    } else {
                        this.scanText = `Scan Completed with ZERO search results`;
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.isLoading = false;
                    this.scanText = `Scan Completed, with some Error, ${e}`;
                });
        },
        hideModal() {
            this.$refs.myModalRef.hide();
        }
    },
    computed: {
        // isLoading() {
        //     let isLoadingCompleted = this.$store.getters.PROCESS_FETCHING_GETTER;
        //     return isLoadingCompleted;
        // },
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
                            let reg = new RegExp(element.toLowerCase(), 'gi');
                            return reg.test(item[key].toString().toLowerCase());
                            // return item[key].toLowerCase().includes(element.toLowerCase());
                        });
                        data = newData; // reassign filtered list
                    }
                }
            }
            return data;
        },
        componentOptions() {
            let obj = this.dcInfo.dcDetails.components;
            return Object.keys(obj || {})
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
        appExceptionSummary: ExceptionSummary
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
