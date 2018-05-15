<template>
  <div class="table-responsive">
    <div>
        <p class="h5 text-info text-left">
        {{filters.environment.toUpperCase()}} <span class="highlight">{{filters.datacenter.toUpperCase()}}</span> datacenter
        <span class="component"> {{filters.component}} </span> component.
        </p>
        <p class="h6 text-left">
          <small>Searched for <span class="highlight"> {{scanOptions.searchDate}} </span> with {{scanOptions.searchString||'default search string'}}.</small>
          <span class='text-danger pst-time'>PST time is {{losAngelesTime}}</span>
        </p>
      <div v-if="hasDownloads" class="mb-1">
        <app-downloaded-files :exceptionFileNameList="exceptionFileNameList" />
      </div>
    </div>

    <hr>
    <b-form inline class="mb-3">
        <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
        <b-form-input class="medium mr-2" v-model="formFilters.ip" type="text" size="sm" placeholder="By SERVER" />
        <b-form-input class="small mr-2" v-model="formFilters.instance" type="text" size="sm" placeholder="By INSTANCE" />
        <b-form-input class="medium mr-2" v-model="formFilters.exception" type="text" size="sm" placeholder="By EXCEPTION" />
        <b-button v-if="excelFileName" size="sm" variant="link" @click="downloadExcel(excelFileName)" v-b-popover.hover="'Download Excel'" >
          <font-awesome-icon icon="download" class=""/>
        </b-button>
    </b-form>

    <section class="card-text table-responsive" style="max-width:1270px">
      <b-table :items="filteredDetails" :fields="fields"
      show-empty
      striped
      bordered
      small
      hover
      responsive="true"
      head-variant="light" >
      <template slot="show_more" slot-scope="row">
        <b-button size="sm" @click.stop="row.toggleDetails" class="mr-2" id="link-btn" variant="link">
          {{ row.detailsShowing ? '&#65085;' : '&#65086;'}}
        </b-button>
      </template>
      <template slot="row-details" slot-scope="row">
        <app-exception-summary-details :row="row" :filters="filters"
            :scanOptions="scanOptions"
            :exceptionFileNameList="exceptionFileNameList"
            :dbFetchList="dbFetchList" />
      </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import DownloadedFiles from './DownloadedFiles';
import ExceptionSummaryDetails from './ExceptionSummaryDetails';
import Timer from './Timer';
import * as utils from '../assets/appUtils';

export default {
    props: ['exceptionDetails', 'filters', 'scanOptions', 'excelFileName'],
    data() {
        return {
            dbFetchList: {},
            exceptionFileNameList: [],
            downloading: false,
            formFilters: {
                exception: '',
                ip: '',
                instance: ''
            },
            fields: [
                { key: 'show_more', label: 'More' },
                {
                    key: 'ip',
                    sortable: true
                },
                {
                    key: 'instance'
                },
                {
                    key: 'count',
                    sortable: true
                },
                // { key: 'actions', label: 'Extract' },
                {
                    key: 'filename',
                    label: 'Log File Path'
                },
                {
                    key: 'exception',
                    sortable: true
                }
            ]
        };
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
    },
    components: {
        FontAwesomeIcon,
        appDownloadedFiles: DownloadedFiles,
        appExceptionSummaryDetails: ExceptionSummaryDetails,
        appTimer: Timer
    },
    computed: {
        losAngelesTime() {
            return this.$store.getters.GET_LOSANGELES_TIME;
        },
        filteredDetails() {
            let filters = this.formFilters;
            let data = this.modifiedExceptionList;
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
</style>
