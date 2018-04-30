<template>
  <div>
    <div>
        <p class="h5 text-info text-center">
        Summary of {{filters.environment.toUpperCase()}} <span class="highlight">{{filters.datacenter.toUpperCase()}}</span> datacenter
        <span class="component"> {{filters.component}} </span> component.
        </p>
        <p class="h6 text-center">
          <small>Searched for <span class="highlight"> {{scanOptions.searchDate}} </span> with {{scanOptions.searchString||'default search string'}}</small>
        </p>
      <div v-if="hasDownloads">

        <b-card header="Detailed Files for Analysis "
                header-tag="header"
                footer="* Use 7z or Winrar application to view gzipped files (gz)"
                footer-tag="footer"
                border-variant="info"
                header-bg-variant="info"
                header-text-variant="white"
                header-class="analysis-header"
                footer-class="analysis-footer"
            >
            <p class="mb-1 card-text" v-for="(fileObj, index) in exceptionFileNameList" :key="index">
              <small v-b-popover.hover="'Download Exception details (gz Zipped) and open it using 7z or Winrar'" >
              <a :href="fileObj.url" target="_blank">
                <font-awesome-icon icon="download" class="ml-2"/>
                {{fileObj.type.toUpperCase()}} log for {{fileObj.ip}} instance {{fileObj.instance}}
              </a>
            </small>
            </p>
        </b-card>
        <br>
        <!-- <p class="h6">Downloaded Files</p>
        <ul>
          <li v-for="(fileObj, index) in exceptionFileNameList" :key="index">
            <small v-b-popover.hover="'Download Exception details (gz Zipped) and open it using 7z or Winrar'" >
              <a :href="fileObj.url" target="_blank">
                <font-awesome-icon icon="download" class="ml-2"/>
                {{fileObj.type.toUpperCase()}} log for {{fileObj.ip}} instance {{fileObj.instance}}
              </a>
            </small>
          </li>
        </ul> -->
        <!-- <b-table :items="exceptionFileNameList" :fields="downloadedFilefields"
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
        </b-table> -->

      </div>
    </div>
    <section class="card-text">
      <b-table :items="exceptionDetails" :fields="fields"
      show-empty
      striped
      bordered
      small
      hover
      responsive="true"
      head-variant="light" >
      <template slot="actions" slot-scope="cell">
        <!-- We use click.stop here to prevent a 'row-clicked' event from also happening -->
        <!-- <b-btn size="sm" class="downloadLink" variant="link" @click.stop="download(cell.item,cell.index,$event.target)"><font-awesome-icon icon="download"/></b-btn> -->
        <b-btn size="sm" class="downloadLink" :disabled="downloading"  variant="link" @click.stop="download(cell.item)">
          <font-awesome-icon icon="file-medical-alt" v-b-popover.hover="'Extract Exceptions'" v-if="!downloading"/>
          <span v-else><font-awesome-icon icon="spinner" spin/></span>
        </b-btn>
      </template>
      </b-table>
    </section>
  </div>
</template>
<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import * as appUtils from '../assets/appUtils';

export default {
    props: ['exceptionDetails', 'filters', 'scanOptions'],
    data() {
        return {
            exceptionFileNameList: [],
            downloading: false,
            downloadedFilefields: [
                {
                    key: 'index',
                    label: 'Sl'
                    /* , variant: 'info' */
                },
                { key: 'ip' },
                { key: 'instance' },
                { key: 'type' },
                {
                    key: 'url',
                    label: 'DOWNLOAD',
                    formatter: value => {
                        return <a href="{{value}}" />;
                    }
                }
            ],
            fields: [
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
                {
                    key: 'exception',
                    sortable: true
                },
                {
                    key: 'filename',
                    label: 'Log File Path'
                },
                { key: 'actions', label: 'Detailed Log' }
            ]
        };
    },
    components: {
        FontAwesomeIcon
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

            console.log('Item:', item);
            console.log('Filters', this.filters);
            console.log('ScanOptions', this.scanOptions);

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
                        ip: splits[3],
                        instance: splits[4]
                    });
                    this.downloading = false;
                })
                .catch(e => console.log(e));
        }
    }
};
</script>

<style scoped>
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
.analysis-header {
    font-size: 14px;
    line-height: 14px;
    padding: 10px;
}
.analysis-footer {
    font-size: 12px;
    font-style: italic;
    line-height: 12px;
    padding: 10px;
}
</style>
