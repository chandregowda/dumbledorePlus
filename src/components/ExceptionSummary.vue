<template>
  <div>
    <div>
      <p class="h5">
        Summary of {{filters.environment.toUpperCase()}} <span class="highlight">{{filters.datacenter.toUpperCase()}}</span> datacenter
        <span class="component"> {{filters.component}} </span> component.
      </p>
      <p class="h6">Searched for <span class="highlight"> {{scanOptions.searchDate}} </span> with {{scanOptions.searchString||'default search string'}}</p>
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
      </b-table>
    </section>
  </div>
</template>
<script>
export default {
    props: ['exceptionDetails', 'filters', 'scanOptions'],
    data() {
        return {
            fields: [
                {
                    key: 'ip',
                    sortable: true
                },
                // {
                //     key: 'instance'
                // },
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
                }
            ]
        };
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
@media (min-width: 992px) {
    .modal-lg {
        max-width: 900px;
    }
}
</style>
