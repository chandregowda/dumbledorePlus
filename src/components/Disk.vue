<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="dot-circle" title="Disk Details"/>Disk Details</h3>
    <hr>
    <b-form inline>
        <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
        <b-form-select v-model="filters.environment" :options="envOptions" size="sm" />
        <b-form-select v-model="filters.datacenter" :options="filteredDataCenters" size="sm" />
        <b-form-input v-model="filters.ip" type="text" size="sm" placeholder="By IP" />
        <b-button size="sm" variant="link" @click="download" v-b-tooltip.hover="'Download Excel'" v-show="!isLoading" >
          <font-awesome-icon icon="download" class=""/>
        </b-button>
        <b-button size="sm" class="ml-1" variant="link" @click="refresh" :disabled="isLoading" v-b-tooltip.hover="'Refresh Disk details'" >
          <!-- <font-awesome-icon icon="spinner" spin v-if="isLoading" />  -->
          <font-awesome-icon icon="sync-alt" :spin="isLoading"/> <app-timer v-if="isLoading"/>
        </b-button>
        <b-button size="sm" class="ml-1" variant="link" @click="retry" :disabled="isRetrying" v-b-tooltip.hover="'Retry Failure Disk details'" >
          <!-- <font-awesome-icon icon="spinner" spin v-if="isRetrying" />  -->
          <font-awesome-icon icon="retweet" /> <app-timer v-if="isRetrying"/>
        </b-button>
    </b-form>
    <h6>*<small class="text-muted hint">Filters work with regular expression, Ex: "10$|12$" in IP will find xxx.xxx.xxx.10 and xxx.xxx.xxx.12</small></h6>
    <br/>
    <div class="ip-details-container">
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
import axios from '../axios-auth';
import * as utils from '../assets/appUtils';
import Timer from './Timer';

export default {
    data() {
        return {
            envOptions: [
                { value: null, text: 'By ENVIRONMENT' },
                { value: 'production', text: 'Production' },
                { value: 'stage', text: 'Stage' }
            ],
            filters: {
                environment: 'production',
                datacenter: null,
                ip: ''
            },
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
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
                { key: 'hostname', sortable: true, label: 'HOST' },
                { key: 'NumberOfCpu', sortable: true, label: 'CPU\'s' },
                { key: 'processes', sortable: true },
                { key: 'os' },
                { key: 'kernel' },
                { key: 'type', sortable: true },
                { key: 'isFailed', sortable: true, label: 'Status' }
                // { key: 'bios' }
            ]
        }
    },
    methods: {
        download() {
            const url = '/downloads/Ip.xlsx';
            utils.downloadExcelFile(url);
        },
        refresh() {
            this.$store.dispatch('IP_GET_ALL_ACTION');
            this.$store.dispatch('IPSTATUS_GET_ALL_ACTION');
        },
        retry() {
            this.$store.dispatch('IPSTATUS_RETRY_FAILED_ID');
        }
    },
    computed: {
        isLoading() {
            let isLoadingCompleted = this.$store.getters.IP_FETCHING_GETTER;
            return isLoadingCompleted;
        },
        isRetrying() {
            return false;
        },
        filteredDetails() {
            return utils.filterDetails(this.filters, this.modifiedDetails);
        },
        failedIpList() {
            return this.$store.getters.IPSTATUS_ONLY_IP_GETTER;
        },
        modifiedDetails() {
            let updatedList = this.$store.getters.IP_GETTER;
            if (updatedList && updatedList.length > 0 && this.failedIpList) {
                updatedList = updatedList.map(o => {
                        o.isFailed = this.failedIpList[o.ip]
                        return o;
                    });
            }
            return updatedList;
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
        let oldDiskDetails = this.$store.getters.IP_GETTER;
        let isLoadingCompleted = this.$store.getters.IP_FETCHING_GETTER;
        if (!isLoadingCompleted && (!oldDiskDetails || !oldDiskDetails.length)) {
            this.$store.dispatch('IP_GET_ALL_ACTION');
        }
        this.$store.dispatch('IPSTATUS_GET_ALL_ACTION');
    },
    components: {
        FontAwesomeIcon,
        appTimer: Timer
    }
};
</script>

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
input.small {
    width: 110px;
}
input.medium {
    width: 140px;
}
</style>
