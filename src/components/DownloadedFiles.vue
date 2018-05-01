<template>
  <b-card header="Recent extracted files"
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
                {{fileObj.component}} {{fileObj.type}} log in {{fileObj.ip}} instance {{fileObj.instance}}
              </a>
            </small>
            </p>
        </b-card>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
    props: ['exceptionFileNameList'],
    components: {
        FontAwesomeIcon
    }
};
</script>
<style scoped>
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
