<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <b-row>
        <b-col cols="2">
            <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="list-ul" title="Reports"/>Reports </h3>
        </b-col>
        <b-col cols class="text-right">
            <section class="text-right mb-3">
                <b-button size="sm" class="ml-1" variant="link" @click="reload" :disabled="isLoading" >
                <!-- <font-awesome-icon icon="spinner" spin v-if="isLoading" />  -->
                <app-timer v-if="isLoading"/> <font-awesome-icon icon="sync-alt" :spin="isLoading"/> Refresh
                </b-button>
            </section>
        </b-col>
    </b-row>
    <hr>
    <section class="card-text table-responsive" v-if="getExceptionReports">
        <b-table :items="getExceptionReports" :fields="fields"
            show-empty
            striped
            bordered
            small
            hover
            responsive="true"
            head-variant="light" >

            <template slot="index" slot-scope="data">
                {{data.index + 1}}
            </template>
            <template slot="generatedBy" slot-scope="row">
                {{row.item.accountName}}
            </template>
            <template slot="show_more" slot-scope="row">
                <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2" id="link-btn-more" variant="link">
                {{ row.detailsShowing ? 'Less &#65085;' : 'More &#65086;'}}
                </b-button>
                <b-button v-if="row.item.excelFileName" size="sm" variant="link" @click="downloadExcel(row.item.excelFileName)" id="link-btn-download" v-b-tooltip.hover="'Download Excel'" v-show="!isLoading" >
                    <font-awesome-icon icon="download" class="" size="sm"/>
                </b-button>
            </template>
            <template slot="row-details" slot-scope="row" v-if="row">
                <b-card>
                    <!-- <b-card-body> -->
                        <div v-if="row.item.filters.logType === 'server' || row.item.filters.logType === 'core'">
                            <app-exception-summary :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters" :excelFileName="row.item.excelFileName"/>
                        </div>
                        <div v-if="row.item.filters.logType === 'access'">
                            <app-api-summary :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters" :excelFileName="row.item.excelFileName" />
                        </div>
                        <div v-if="row.item.filters.logType === 'params' || row.item.filters.logType === 'config'">
                            <app-node-params-summary :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters" :excelFileName="row.item.excelFileName"/>
                        </div>
                    <!-- </b-card-body> -->
                </b-card>
                <!-- <b-card>
                    <b-row>
                        <b-col class="">
                            <app-exception-summary v-if="row.item.filters.logType !== 'access'" :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters" />
                            <app-api-summary v-else :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters"/>
                        </b-col>
                    </b-row>
                    <b-button size="sm" @click="row.toggleDetails" variant="outline-info">Hide Details</b-button>
                </b-card> -->
            </template>

        </b-table>
    </section>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';
import ExceptionSummary from './ExceptionSummary';
import ApiSummary from './ApiSummary';
import NodeParamsSummary from './NodeParamsSummary';

import moment from 'moment';
import * as utils from '../assets/appUtils';
import Timer from './Timer';

export default {
    data() {
        return {
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: '_id',
                    label: 'Created On',
                    sortable: true,
                    formatter: value => {
                        let timestamp = value.toString().substring(0, 8);
                        let date = new Date(parseInt(timestamp, 16));
                        let createdOn = moment.unix(date).format('YYYY-MM-DD HH:mm:ss');
                        return createdOn;
                    }
                },
                {
                    key: 'generatedBy',
                    sortable: true
                },
                {
                    key: 'filters',
                    label: 'Scan options',
                    formatter: filters => {
                        let f = filters;
                        // console.log('Filters: ', f);
                        if (f) {
                            let logTypeMessage = f.logType === 'access' ? 'API details' : f.logType.toUpperCase() + ' log';
                            let env = f.environment
                                ? f.environment.toString().toUpperCase()
                                : f.environments ? f.environments.toString().toUpperCase() : '';
                            let dc = f.datacenter
                                ? f.datacenter.toString().toUpperCase()
                                : f.datacenters ? f.datacenters.toString().toUpperCase() : '';
                            let content = `${logTypeMessage} ${env} ${dc} datacenter, ${
                                f.component
                            } component generated for ${f.searchDate}`;
                            return content;
                        }
                        return 'NO_FILTER';
                        // return JSON.stringify(value, undefined, 2);
                    }
                },
                { key: 'show_more', label: 'Details' }
            ]
        };
    },
    methods: {
        reload() {
            this.$store.dispatch('EXCEPTIONS_FETCH_START_ACTION');
            this.$store.dispatch('EXCEPTIONS_FETCH_ACTION');
        },
        // download(item) {
        //     console.log('Downloading item', item);
        //     axios
        //         .get('/exception/getSummaryExcel?id=' + item._id)
        //         .then(r => console.log('Excel generated', r.data))
        //         .catch(e => console.log(e));
        // },
        downloadExcel(filename) {
            let index = filename.indexOf('logSummary');
            if (index !== -1) {
                let url = filename.substring(index + 'logSummary'.length);
                utils.downloadExcelFile(url);
            }
        }
    },
    computed: {
        getExceptionReports() {
            return this.$store.getters.EXCEPTIONS_GETTER;
        },
        isLoading() {
            return this.$store.getters.EXCEPTIONS_FETCHING_GETTER;
        }
    },
    created() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        if (!this.getExceptionReports) {
            this.$store.dispatch('EXCEPTIONS_FETCH_START_ACTION');
            this.$store.dispatch('EXCEPTIONS_FETCH_ACTION');
        }
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
#link-btn-more,
#link-btn-download {
    font-size: 12px;
    padding: 0 !important;
}
</style>
