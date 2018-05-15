<template>
  <div>
    <div>
        <p class="h5 text-info text-left">
        {{environment}} <span class="highlight"> {{datacenter}} </span> datacenter
        <span class="component"> {{filters.component}} </span> component
        </p>
        <p class="h6 text-left">
          <small>Searched for <span class="highlight"> {{scanOptions.searchDate}} </span> with {{scanOptions.searchString||'default search string'}}.</small>
          <span class='text-danger pst-time'>PST time is {{losAngelesTime}}</span>
        </p>
    </div>

    <hr>
    <b-form inline class="mb-3">
        <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
        <b-form-input class="small mr-2" v-model="formFilters.ip" type="text" size="sm" placeholder="By SERVER" />
        <b-form-input class="small mr-2" v-model="formFilters.instance" type="text" size="sm" placeholder="By INSTANCE" />
        <b-form-input class="medium mr-2" v-model="formFilters.api" type="text" size="sm" placeholder="By SERVICE" />
        <b-form-input class="medium mr-2" v-model="formFilters.apiMethod" type="text" size="sm" placeholder="By API" />
        <b-form-input class="small mr-2" v-model="formFilters.cobrandId" type="text" size="sm" placeholder="By COBRAND" />
        <b-form-input class="small mr-2" v-model="formFilters.status" type="text" size="sm" placeholder="By STATUS" />
        <b-button v-if="excelFileName" size="sm" variant="link" @click="downloadExcel(excelFileName)" v-b-popover.hover="'Download Excel'" >
          <font-awesome-icon icon="download" class=""/>
        </b-button>
    </b-form>
    <hr>
    <div class="text-center" v-if="exceptionDetails">
      <b-form inline class="mb-3">
        <p class="h6 text-left">
        <small>Per page : </small> <b-form-select class="small ml-2 mr-2" v-model="rowsPerPage" :options="pageOptions" size="sm" />
        <small class="ml-2 mr-2">Total records : {{exceptionDetails.length}}</small>
        <small class="ml-2 mr-2">Filtered records : {{filteredDetails.length}}</small>
      </p>
      </b-form>
      <b-pagination align="center" size="sm" :total-rows="exceptionDetails.length" :limit="10" v-model="currentPage" :per-page="rowsPerPage"></b-pagination>
    </div>

    <section class="card-text table-responsive">
      <b-table :items="filteredDetails" :fields="fields"
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
      </b-table>
    </section>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Timer from './Timer';
import * as utils from '../assets/appUtils';

export default {
    props: ['exceptionDetails', 'filters', 'scanOptions', 'excelFileName'],
    data() {
        return {
            currentPage: 1,
            rowsPerPage: 250,
            pageOptions: [
                { value: 100, text: 100 },
                { value: 250, text: 250 },
                { value: 500, text: 500 },
                { value: 1000, text: 1000 }
                // { value: 2500, text: 2500 },
                // { value: 5000, text: 5000 }
            ],
            dbFetchList: {},
            exceptionFileNameList: [],
            downloading: false,
            formFilters: {
                api: '',
                apiMethod: '',
                cobrandId: '',
                ip: '',
                instance: ''
            },
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: 'ip',
                    sortable: true
                },
                {
                    key: 'instance',
                    sortable: true
                },
                {
                    key: 'count',
                    sortable: true
                },
                { key: 'api', label: 'Service', sortable: true },
                { key: 'apiMethod', label: 'API' },
                { key: 'httpMethod', label: 'HTTP', sortable: true },
                { key: 'status', sortable: true },
                { key: 'cobrandId', label: 'Cobrand', sortable: true }
            ]
        };
    },
    components: {
        FontAwesomeIcon,
        appTimer: Timer
    },
    computed: {
        losAngelesTime() {
            return this.$store.getters.GET_LOSANGELES_TIME;
        },
        filteredDetails() {
            let filters = this.formFilters;
            let data = [].concat(this.modifiedExceptionList);

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
            let startIndex = this.rowsPerPage * this.currentPage - this.rowsPerPage;
            let finalData = data.splice(startIndex, this.rowsPerPage);
            return finalData;
        },
        environment() {
            let filters = this.filters;
            let env = filters.environment ? filters.environment : filters.environments ? filters.environments : '';
            return env.toUpperCase();
        },
        datacenter() {
            let filters = this.filters;
            let dc = filters.datacenter ? filters.datacenter : filters.datacenters ? filters.datacenters : '';
            return dc.toUpperCase();
        },
        modifiedExceptionList() {
            let updatedList = this.exceptionDetails;
            if (this.exceptionDetails) {
                updatedList = this.exceptionDetails.map(o => {
                    o.extractedFile = null;
                    o.extractedFileList = [];
                    o.extractedFileCount = 0;
                    return o;
                });
            }
            return updatedList;
        },
        hasDownloads() {
            return this.exceptionFileNameList.length;
        }
    },
    methods: {
        downloadExcel(filename) {
            let index = filename.indexOf('public');
            if (index !== -1) {
                let url = filename.substring(index + 'public'.length);
                // const url = '/downloads/Process.xlsx?';
                utils.downloadExcelFile(url);
            }
        }
    }
};
</script>

<style scoped>
#link-btn {
    font-size: 12px;
    padding: 0 !important;
}
.highlight {
    color: red;
}
.component {
    color: blue;
}

.pst-time {
    font-size: 12px;
}
input[type='text'].small {
    width: 120px;
}
input[type='medium'].small {
    width: 150px;
}
</style>
