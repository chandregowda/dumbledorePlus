<template>
  <b-card v-if="processDetail">
    <b-row class="mb-2">
      <b-col cols="2">
        <span class="mr-5"><b>Environment: </b>{{processDetail.environment}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>Datacenter: </b>{{processDetail.datacenter}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>IP: </b>{{processDetail.ip}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>Port: </b>{{processDetail.port}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>Instance: </b>{{processDetail.instance}}</span>
      </b-col>
    </b-row>
    <b-row class="mb-2">
      <b-col cols="2">
        <span><b>Number of occurrence: </b></span><span class="mr-5" style="color:red; font-size:1.2em;">{{row.item.count}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>Component: </b>{{processDetail.component}}</span>
      </b-col>
      <b-col cols="2">
        <span class="mr-5"><b>Build: </b>{{processDetail.build}}</span>
      </b-col>
      <b-col cols="4">
        <span class="mr-5"><b>Cobrand Group: </b>{{processDetail.cobrandGroup}}</span>
      </b-col>
    </b-row>
    <b-row class="mb-2" >
      <b-col cols="4" v-if="processDetail.hostname">
        <span class="mr-5"><b>hostname: </b>{{processDetail.hostname}}</span>
        <!-- <span class="mr-2"><b>Total Downloadable Files: </b>{{numberOfDownloadableFiles}}</span> -->
      </b-col>
      <b-col cols="4">
        <span class="mr-5"><b>Process Started on: </b>{{processDetail.processStartDate}} {{processDetail.processStartTime}}</span>
      </b-col>
    </b-row>
    <b-row class="mb-2" >
      <b-col cols>
        <span class="mr-5"><b>Log File name: </b>{{row.item.filename}}</span>
      </b-col>
    </b-row>
    <!-- <b-row v-if="processDetail">
      <b-col>
        <span class="mr-2"><b>Process Detail: </b>{{processDetail}}</span>
      </b-col>
    </b-row> -->
    <b-row class="mt-2">
      <b-col>
        <b>Searched Result: </b><pre class="exception-details">{{row.item.exception}}</pre>
      </b-col>
    </b-row>

    <section v-if="allDownloadableFile.length" class="mt-1">
      <p class="h6"><small><b>Extracted Files ready for analysis: </b></small></p>
      <b-row>
        <b-col cols="4" v-for="(files, index) in allDownloadableFile" :key="index"
        v-if="(files.filename === row.item.filename && files.ip === row.item.ip)">
          <a :href="files.url" target="_blank"  v-b-popover.hover="'Download Exception details (gz Zipped) and open it using 7z or Winrar'">
            <font-awesome-icon icon="download" class="ml-2"/>
            <!-- {{files.component}} {{files.type}} log in {{files.ip}} instance {{files.instance}} -->
            Generated on {{files.createdDate}} by {{files.generatedBy}}
          </a>
          <!-- {{files.filename}} | {{row.item.filename}} -->
        </b-col>
      </b-row>
    </section>

    <hr>
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

<script>
import * as appUtils from '../assets/appUtils';
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import Timer from './Timer';
import axios from '../axios-auth';

export default {
    props: ['row', 'filters', 'scanOptions', 'exceptionFileNameList', 'dbFetchList'],
    data() {
        return {
            downloading: false,
            processDetail: null,
            onCreateFetchedFile: [] // This is to make sure not to add to the list everytime details is opened
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
                    // console.log('Details...', details);
                    let fileObj = appUtils.getFileDetailsByDownloadedFileName(filename, details.extractedFile);

                    this.exceptionFileNameList.push(fileObj); // update parent data

                    this.downloading = false;
                })
                .catch(e => console.log(e));
        }
    },
    computed: {
        numberOfDownloadableFiles() {
            // console.log('Changed count');
            return this.exceptionFileNameList.length;
        },
        allDownloadableFile() {
            // console.log('Changed list', JSON.stringify(this.exceptionFileNameList, undefined, 2));
            return this.exceptionFileNameList;
        }
    },
    // beforeCreate() {
    //     console.log('Summar Details Before Create');
    // },
    created() {
        this.getProcessDetails = this.$store.getters.GET_PROCESS_DETAILS;
    },
    mounted() {
        // console.log('Summar Details Created', this.row.item);
        if (this.row) {
            let { ip, instance, filename } = this.row.item;
            let { environment, datacenter, component } = this.filters;

            // console.log('Getting download files for ', ip, instance, filename, component);
            let postData = { ip, instance, filename, component };
            // call process vuex getter to know the process details for the given
            this.processDetail = this.getProcessDetails({ environment, datacenter, ip, instance, component });

            let key = `${ip}-${instance}-${component}-${filename}`;
            if (!this.dbFetchList[key]) {
                this.dbFetchList[key] = true;
                axios
                    .post('/download/get', postData)
                    .then(result => {
                        let fileDetails = result.data;
                        // console.log('FETCHED FILES:', fileDetails);
                        // console.log('Updating data...');
                        fileDetails.forEach(element => {
                            // console.log('Element:', element);
                            let fileObj = appUtils.getFileDetailsByDownloadedFileName(filename, element.extractedFile);

                            this.exceptionFileNameList.push(fileObj);
                        });
                    })
                    .catch(e => console.log(e));
            }
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
