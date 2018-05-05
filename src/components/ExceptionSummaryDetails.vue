<template>
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

      <span v-if="row.item.extractedFile" v-b-popover.hover="'Download Exception details (gz Zipped) and open it using 7z or Winrar'" >
        <a :href="row.item.extractedFile.url" target="_blank">
          <font-awesome-icon icon="download" class="ml-2"/>
          {{row.item.extractedFile.component}} {{row.item.extractedFile.type}} log in {{row.item.extractedFile.ip}} instance {{row.item.extractedFile.instance}}
        </a>
      </span>
  </b-card>
</template>

<script>
import * as appUtils from '../assets/appUtils';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Timer from './Timer';

export default {
    props: ['row', 'filters', 'scanOptions', 'exceptionFileNameList'],
    data() {
        return {
            downloading: false
        };
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
                .then(details => {
                    let splits = details.extractedFile
                        .split('/')
                        .pop()
                        .split('-');

                    let url = details.extractedFile.replace(
                        '/home/logmonitor/tools/node/public/',
                        'https://dumbledore.yodlee.com/'
                    );
                    let fileObj = {
                        url,
                        type: splits[2],
                        ip: splits[3].replace(/_/g, '.'),
                        instance: splits[4],
                        component: splits[5]
                    };

                    if (this.exceptionFileNameList) {
                        this.exceptionFileNameList.push(fileObj);
                    }
                    item.extractedFile = fileObj; // to show in the row

                    this.downloading = false;
                })
                .catch(e => console.log(e));
        }
    },
    components: {
        FontAwesomeIcon,
        appTimer: Timer
    }
};
</script>

<style scoped>
.exception-details {
    font-size: 12px;
}
</style>
