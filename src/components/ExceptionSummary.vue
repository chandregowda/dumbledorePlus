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
      <b-table :items="exceptionDetails" :fields="fields"
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
        <b-card>
          <b-row>
            <b-col>
              <span class="mr-2"><b>IP: </b>{{row.item.ip}}</span>
              <span class="mr-2"><b>Instance: </b>{{row.item.instance}}</span>
              <span class="mr-2"><b>Number of occurrence: </b>{{row.item.count}}</span>
              <span class="mr-2"><b>Log File name: </b>{{row.item.filename}}</span>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b>Searched Result: </b><pre class="exception-details">{{row.item.exception}}</pre>
            </b-col>
          </b-row>
          <b-button size="sm" @click="row.toggleDetails" variant="outline-info">Hide Details</b-button>
          <b-button size="sm" :disabled="downloading"  @click="download(row.item)" variant="outline-info">
            <template v-if="downloading">
             <font-awesome-icon icon="spinner" spin /> Extracting Stack Trace since <app-timer />
            </template>
            <template v-else>
              Extract Stack Trace
            </template>
          </b-button>
        </b-card>
      </template>
      </b-table>
    </section>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import * as appUtils from '../assets/appUtils';
import DownloadedFiles from './DownloadedFiles';
import Timer from './Timer';

export default {
    props: ['exceptionDetails', 'filters', 'scanOptions'],
    data() {
        return {
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
        appTimer: Timer
    },
    computed: {
        hasDownloads() {
            return this.exceptionFileNameList.length;
        }
    },
    methods: {
        download(item) {
            this.downloading = true;
            let { ip, instance, filename } = item;
            let { environment, datacenter, component } = this.filters;
            let generatedBy = localStorage.getItem('accountName');
            let {
                logType,
                searchDate,
                dateFactor,
                includeStackTrace,
                before,
                after,
                numberOfExtraLines,
                userSearchString,
                searchString
            } = this.scanOptions;

            // console.log('Item:', item);
            // console.log('Filters', this.filters);
            // console.log('ScanOptions', this.scanOptions);

            appUtils
                .downloadLogFile({
                    environment,
                    ip,
                    instance,
                    component,
                    datacenter,
                    filename,
                    searchCriteria: {
                        logType,
                        logDate: searchDate,
                        dateFactor,
                        includeStackTrace,
                        before,
                        after,
                        numberOfExtraLines,
                        userSearchString,
                        searchString
                    },
                    generatedBy
                })
                .then(filename => {
                    let splits = filename
                        .split('/')
                        .pop()
                        .split('-');
                    let url = filename.replace('/home/logmonitor/tools/node/public/', 'https://dumbledore.yodlee.com/');
                    this.exceptionFileNameList.push({
                        url,
                        type: splits[2],
                        ip: splits[3].replace(/_/g, '.'),
                        instance: splits[4],
                        component: splits[5]
                    });
                    this.downloading = false;
                })
                .catch(e => console.log(e));
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
.downloadLink {
    font-size: 13px;
    padding: 0 5px;
    margin: 0;
    line-height: 0;
}
.exception-details {
    font-size: 12px;
}
button:disabled {
    cursor: not-allowed;
}
</style>
