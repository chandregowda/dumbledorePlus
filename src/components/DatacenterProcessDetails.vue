<template>
  <div class="container-fluid ">
    <h3 class="mt-3 text-info">
      <font-awesome-icon class="mr-3 text-primary" size="lg" icon="sitemap" title="Datacenter Process Details"/>
      Datacenter Process Details - <span class="h6">{{dcInfo.environment.toUpperCase()}} - {{dcInfo.dc.toUpperCase()}} - {{filters.component}}</span>
    </h3>
    <hr>
      <!-- <div class="col-sm2">
        <p clsss="h5">Components Summary</p>
        <app-component-summary :componentDetails="dcInfo.dcDetails.components" />
      </div> -->
      <b-form inline>
        <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
        <b-form-select class="small" v-model="filters.component" :options="componentOptions" size="sm" />
        <b-form-input class="small" v-model="filters.ip" type="text" size="sm" placeholder="By SERVER" />
        <b-form-input class="small" v-model="filters.port" type="text" size="sm" placeholder="By PORT" />
        <b-form-input v-model="filters.cobrandGroup" type="text" size="sm" placeholder="By COBRAND GROUP" />
        <b-form-input class="small" v-model="filters.build" type="text" size="sm" placeholder="By BUILD" />
        <b-form-input class="small" v-model="filters.processStartDate" type="text" size="sm" placeholder="By DATE (PST)" />
        <b-form-input class="small" v-model="filters.processStartTime" type="text" size="sm" placeholder="By TIME (PST)" />
        <b-form-input class="small" v-model="filters.pid" type="text" size="sm" placeholder="By PROCESS ID" />
        <b-btn size="sm" class="ml-1" variant="outline-info" v-b-modal.modal1 :disabled="isLoading">
          <font-awesome-icon icon="binoculars" /> {{scanActionText}}
        </b-btn>
      </b-form>
      <h6 class="mt-1">*<small class="text-danger hint">Filters work with regular expression, Ex: "city|fide" in COBRAND GROUP will find both City and Fidelity, 'Apr 28|Apr 29' in STARTED ON will find process started on both days </small></h6>
      <h6 class="mt-1">*<small class="text-danger hint">Every instance visible below will be scanned, use filters if you need specific process</small></h6>

      <b-form @submit="scanLogs" >
        <b-modal ref="myModalRef" hide-footer id="modal1" :title="modalTitle" v-model="modalShow">
            <div class="my-1">
                <div class="row mb-3">
                    <b-col sm="2" class="legend-small">Scan in</b-col>
                    <b-col >
                        <b-form-radio-group  size="sm" id="logTypes" v-model="scanOptions.logType" name="radioSubComponent">
                            <b-form-radio value="server">Server Logs</b-form-radio>
                            <b-form-radio v-if="filters.component !== 'NODE'" value="core" class="sm">Core Logs</b-form-radio>
                            <b-form-radio v-if="allowApiScan" value="access">Access(API)</b-form-radio>
                            <b-form-radio v-if="filters.component === 'NODE'" value="params">params.js</b-form-radio>
                            <b-form-radio v-if="filters.component === 'NODE'" value="config">config.js</b-form-radio>
                        </b-form-radio-group>
                    </b-col>
                </div>

                <div class="row mt-3" v-if="scanOptions.logType !== 'params' && scanOptions.logType !== 'config'">
                    <div class="col">
                        <b-row >
                            <b-col sm="2" class="legend-small">Logs for </b-col>
                            <b-col sm="3">
                                <b-form-input class="small" v-model.trim="scanOptions.searchDate" type="text" size="sm" placeholder="YYYY-MM-DD" />
                            </b-col>
                            <b-col>
                                <b-form-text class="ml-2">
                                    <b>PST Time:</b> <span class="text-danger">{{losAngelesTime}}</span>
                                </b-form-text>
                            </b-col>
                        </b-row>
                        <!-- <b-row >
                            <b-col sm="4" class="legend-small">Logs modified since</b-col>
                            <b-col >
                                <b-form-input size="sm" type="range" :max="max" :min="min" v-model="lastModifiedSinceHrs"></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col class="col">
                                <b-progress  :value="lastModifiedSince" class="w-100 mt-3"></b-progress>
                            </b-col>
                        </b-row>
                        <h6 class="mt-1"><small class="text-danger hint">Files modified in last <b>{{lastModifiedSinceHrs}}</b> hours will be scanned</small></h6> -->
                    </div>
                    <h6 class="ml-3"><small class="text-danger hint">NOTE: Consider Server timezone while selecting dates to scan.</small></h6>
                </div>
                <div class="row mt-3" v-if="scanOptions.logType !== 'access'">
                    <div class="col">
                        <b-form-group>
                            <b-form-text class="legend-small">{{searchText}}</b-form-text>
                            <b-form-input v-model.trim="scanOptions.searchString" type="text" size="sm" :placeholder="searchFieldText" />
                            <h6 class="mt-1"><small class="text-danger hint">{{searchHint}}</small></h6>
                        </b-form-group>
                    </div>
                </div>
            </div>
            <b-btn class="mt-3" variant="outline-info" block type="submit" :disabled="isLoading">
                <template v-if="isLoading">
                    <font-awesome-icon icon="spinner" spin /> Scanning is in progress since <app-timer />
                </template>
                <template v-else>
                    <font-awesome-icon icon="binoculars" /> {{scanText}}
                </template>
            </b-btn>
            <!-- <b-btn class="mt-3" variant="outline-info" hide-footer block @click="hideModal">Scan Now</b-btn> -->
        </b-modal>
      </b-form>

      <div class="ml-3" v-if="exceptionDetails">
        <b-modal ref="resultModalRef" size="lg" class="bigModal" hide-footer id="modal2" title="Scan Summary Report" v-model="resultmodalShow">
          <div v-if="scanOptions.logType === 'server' || scanOptions.logType === 'core'">
              <app-exception-summary :exceptionDetails="exceptionDetails" :filters="filters" :scanOptions="scanOptions" :excelFileName="excelFileName"/>
          </div>
          <div v-if="scanOptions.logType === 'access'">
            <app-api-summary :exceptionDetails="exceptionDetails" :filters="filters" :scanOptions="scanOptions" :excelFileName="excelFileName"/>
          </div>
          <div v-if="scanOptions.logType === 'params' || scanOptions.logType === 'config'">
            <app-node-params-summary :exceptionDetails="exceptionDetails" :filters="filters" :scanOptions="scanOptions" :excelFileName="excelFileName"/>
          </div>
          <!-- {{exceptionDetails}} -->
          <b-btn class="mt-3" variant="outline-info" hide-footer block @click="hideModal">Analysis Completed</b-btn>
        </b-modal>
      </div>

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
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import ExceptionSummary from './ExceptionSummary';
import ApiSummary from './ApiSummary';
import NodeParamsSummary from './NodeParamsSummary';

import axios from '../axios-auth';
import * as utils from '../assets/appUtils';
import moment from 'moment-timezone';
import Timer from './Timer';

// import font from url('https://fonts.googleapis.com/css?family=Roboto+Condensed:400|Roboto:100');

export default {
    props: ['dcInfo'],
    data() {
        return {
            lastModifiedSinceHrs: 24,
            max: 24,
            min: 1,
            isLoading: false,
            modalShow: false,
            resultmodalShow: false,
            scanText: 'Scan Now',
            scanActionText: 'Scan Options',
            exceptionDetails: null,
            excelFileName: null,
            filters: {
                environment: this.dcInfo.environment,
                datacenter: this.dcInfo.dc,
                ip: '',
                port: '',
                component: '',
                cobrandGroup: '',
                build: '',
                processStartDate: '',
                processStartTime: '',
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
                    label: 'Inst'
                },
                {
                    key: 'port'
                },
                { key: 'component', sortable: false },
                { key: 'cobrandGroup', sortable: true },
                { key: 'build', sortable: true },
                { key: 'processStartDate', sortable: false, label: 'Start Date (PST)' },
                {
                    key: 'processStartTime',
                    sortable: false,
                    label: 'Start Time'
                },
                {
                    key: 'timestamp',
                    sortable: true,
                    label: 'Start On (IST)',
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
                searchDate: null, // moment().format('YYYY-MM-DD'),
                searchString: ''
            }
        };
    },
    methods: {
        scanLogs(evt) {
            evt.preventDefault();

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

            let url = (this.scanOptions.logType === 'params' || this.scanOptions.logType === 'config')
                        ? '/scanner/searchParamKeyInAllNodeInstances'
                        : '/scanner/getLogSummary';

            axios
                .post(url, {
                    mailTo: from + '@yodlee.com',
                    environments: [this.dcInfo.environment],
                    datacenters: [this.dcInfo.dc],
                    component: this.filters.component,
                    logType: this.scanOptions.logType,
                    searchString: this.scanOptions.searchString,
                    searchDate: this.scanOptions.searchDate || moment().format('YYYY-MM-DD'),
                    processInfo,
                    logPath: '/var/log'
                })
                .then(result => {
                    this.exceptionDetails = result.data.summary;
                    this.excelFileName = result.data.excelFileName;
                    this.isLoading = false;
                    this.scanActionText = 'Scan Options';
                    if (result.data.summary && result.data.summary.length) {
                        this.modalShow = false;
                        setTimeout(() => {
                            this.resultmodalShow = true;
                        }, 500);
                        this.scanText = 'Scan Now';
                        console.log('Scan Result');
                        console.log(result.data);
                    } else {
                        this.scanText = `Scan Completed with ZERO search results`;
                    }
                })
                .catch(e => {
                    console.log('Something went wrong', e);
                    this.isLoading = false;
                    this.scanActionText = 'Scan Options';
                    this.scanText = `Scan Completed, ${e}`;
                });
        },
        hideModal() {
            this.$refs.resultModalRef.hide();
        }
    },
    computed: {
        searchHint() {
            return (this.scanOptions.logType === 'params' || this.scanOptions.logType === 'config') ? 'Ex: enable_unified_flow, enable_sense_theme, enable_iav_theme'
                : (this.scanOptions.logType === 'access') ? "By default, all API's are searched"
                : "By default, all 'xceptions', 'ORA-', 'failed', strings are searched";
        },
        searchFieldText() {
            return (this.scanOptions.logType === 'params' || this.scanOptions.logType === 'config') ? 'Comma separated keys' : 'RegEx supported, avoid quotes';
        },
        searchText() {
            return (this.scanOptions.logType === 'params' || this.scanOptions.logType === 'config') ? 'Param Keys to Search' : 'Search string *optional';
        },
        modalTitle() {
            return `Scan ${this.filters.component} logs`;
        },
        lastModifiedSince() {
            return parseInt(100 / 24 * this.lastModifiedSinceHrs);
        },
        losAngelesTime() {
            return this.$store.getters.GET_LOSANGELES_TIME;
        },
        losAngelesDate() {
            return this.$store.timeStore
                ? this.$store.timeStore.losAngeles.format('YYYY-MM-DD')
                : moment().format('YYYY-MM');
        },
        allowApiScan() {
            return ['RESTSERVER', 'NEW SDK', 'YSL'].includes(this.filters.component);
        },
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
                .map(k => ({ value: k, text: `${k} (${obj[k].count})` }));
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
        this.scanOptions.searchDate = this.$store.state.TimeStore.losAngeles.format('YYYY-MM-DD');
    },
    components: {
        FontAwesomeIcon,
        appExceptionSummary: ExceptionSummary,
        appApiSummary: ApiSummary,
        appNodeParamsSummary: NodeParamsSummary,
        appTimer: Timer
    }
};
</script>

<style scoped>
.form-inline .form-control,
select.form-control {
    font-size: 12px;
    margin: 0 2px;
}
.legend-small {
    font-size: 12px;
    font-weight: bold;
}
input[type='text'].small {
    width: 120px;
}
input[type='medium'].small {
    width: 150px;
}
</style>
