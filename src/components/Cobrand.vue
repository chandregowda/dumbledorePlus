<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="users" title="Cobrand Details"/>Cobrand Details</h3>
    <hr>
    <b-row align-h="center">
      <b-col align-self="center" cols="6">
        <b-form inline>
            <font-awesome-icon icon="filter" class="mr-2 text-warning"/>
            <b-form-input class="mr-2" v-model="filters.cobrandGroup" type="text" size="sm" placeholder="By COBRAND GROUP" />
            <b-form-input class="mr-2" v-model="filters.cobrandName" type="text" size="sm" placeholder="By COBRAND NAME" />
            <b-form-input class="mr-2" v-model="filters.cobrandId" type="text" size="sm" placeholder="By COBRAND ID" />
        </b-form>
        <h6>*<small class="text-muted hint">Filters work with regular expression, Ex: "city|fide" in COBRAND GROUP will find both City and Fidelity,</small></h6>
      </b-col>
    </b-row>
    <br/>
    <b-row align-h="center">
        <b-col align-self="center" cols="6">
            <b-table
                show-empty
                striped
                bordered
                small
                hover
                head-variant="light"
                :items="filteredDetails"
                :fields="fields">

                <template slot="index" slot-scope="data">
                    {{data.index + 1}}
                </template>
            </b-table>
        </b-col>
    </b-row>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

export default {
    data() {
        return {
            filters: {
                cobrandGroup: '',
                cobranName: '',
                cobrandId: ''
            },
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: 'cobrandGroup',
                    sortable: true
                },
                {
                    key: 'cobrandName',
                    sortable: true
                },
                {
                    key: 'cobrandId',
                    sortable: true
                }
            ]
        };
    },
    computed: {
        allCobrands() {
            return this.$store.getters.COBRANDS_GETTER;
        },
        filteredDetails() {
            let filters = this.filters;
            let data = this.$store.getters.COBRANDS_GETTER;
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
        }
    },
    components: {
        FontAwesomeIcon
    },
    created() {
        if (!this.$store.getters.COBRANDS_GETTER && !this.$store.getters.COBRANDS_LOADING_STATUS_GETTER) {
            this.$store.dispatch('COBRANDS_FETCH_ACTION');
        }
    }
};
</script>

<style scoped>
.hint {
    font-style: italic;
}
</style>
