<template>
  <div>
    <div>
        <p class="h5 text-info text-center">
        {{filters.environment.toUpperCase()}} <span class="highlight">{{filters.datacenter.toUpperCase()}}</span> datacenter
        <span class="component"> {{filters.component}} </span> component
        </p>
        <p class="h6 text-center">
          <small>Searched for <span class="highlight"> {{scanOptions.searchDate}} </span> with {{scanOptions.searchString||'default search string'}}</small>
        </p>
      <div v-if="hasDownloads" class="mb-1">
        <app-downloaded-files :exceptionFileNameList="exceptionFileNameList" />
      </div>
    </div>
    <section class="card-text table-responsive">
      <b-table :items="modifiedExceptionList" :fields="fields"
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

export default {
    props: ['exceptionDetails', 'filters', 'scanOptions'],
    data() {
        return {
            dbFetchList: {},
            exceptionFileNameList: [],
            downloading: false,
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
    components: {
        FontAwesomeIcon,
        appDownloadedFiles: DownloadedFiles,
        appExceptionSummaryDetails: ExceptionSummaryDetails,
        appTimer: Timer
    },
    computed: {
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
