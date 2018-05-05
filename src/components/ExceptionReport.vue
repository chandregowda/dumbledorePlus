<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="list-ul" title="Exception Report"/>Exception Report</h3>
    <hr>
    <div class="row">
        <div class="col">
            <b-table
                show-empty
                striped
                bordered
                small
                hover
                responsive="true"
                head-variant="light"
                :items="getExceptionReports"
                :fields="fields">

                <template slot="index" slot-scope="data">
                    {{data.index + 1}}
                </template>
                <template slot="generatedBy" slot-scope="row">
                    {{row.item.accountName}}
                </template>
                <template slot="show_more" slot-scope="row">
                    <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2" id="link-btn" variant="link">
                    {{ row.detailsShowing ? 'Less &#65085;' : 'More &#65086;'}}
                    </b-button>
                </template>
                <template slot="row-details" slot-scope="row">
                    <b-card>
                        <!-- <b-row>
                            <b-col>{{row.item.summary}}</b-col>
                        </b-row> -->
                        <b-row>
                          <b-col class="">
                            <app-exception-summary :exceptionDetails="row.item.summary" :filters="row.item.filters" :scanOptions="row.item.filters"/>
                          </b-col>
                        </b-row>
                        <b-button size="sm" @click="row.toggleDetails" variant="outline-info">Hide Details</b-button>
                    </b-card>
                </template>

            </b-table>
        </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';
import ExceptionSummary from './ExceptionSummary';
import moment from 'moment';
// import * as utils from '../assets/appUtils';
// import Timer from './Timer';

export default {
    data() {
        return {
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                // {
                //     key: 'createdAt',
                //     sortable: true,
                //     formatter: value => {
                //         return new Date(value)
                //             .toString()
                //             .split(' ')
                //             .splice(0, 5)
                //             .join(' ');
                //     }
                // },
                {
                    key: '_id',
                    label: 'Created On',
                    sortable: true,
                    formatter: value => {
                        let timestamp = value.toString().substring(0, 8);
                        let date = new Date(parseInt(timestamp, 16));
                        let createdOn = moment.unix(date).format('YYYY-MM-DD HH:mm:ss');
                        console.log('_id:', value);
                        console.log('timestame:', timestamp);
                        console.log('createdOn:', createdOn);
                        return createdOn;
                    }
                },
                {
                    key: 'generatedBy',
                    sortable: true
                },
                {
                    key: 'filters',
                    formatter: filters => {
                        let f = filters;
                        let content = `${f.logType.toUpperCase()} log for ${f.environment.toUpperCase()} 
                        ${f.datacenter} datacenter, ${f.component} component generated for ${f.searchDate}`;
                        return content;
                        // return JSON.stringify(value, undefined, 2);
                    }
                },
                { key: 'show_more', label: 'Details' }
            ]
        };
    },
    computed: {
        getExceptionReports() {
            return this.$store.getters.EXCEPTIONS_GETTER;
        }
    },
    created() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        this.$store.dispatch('EXCEPTIONS_FETCH_ACTION');
    },
    components: {
        FontAwesomeIcon,
        appExceptionSummary: ExceptionSummary
    }
};
</script>

<style>
#link-btn {
    font-size: 12px;
    padding: 0 !important;
}
</style>
