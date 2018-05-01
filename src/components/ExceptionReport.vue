<template>
  <div class="container-fluid">
    <!-- <app-process-filters></app-process-filters> -->
    <h3 class="mt-3 text-info"><font-awesome-icon class="mr-3 text-primary" size="lg" icon="list-ul" title="Exception Report"/>Exception Report</h3>
    <hr>
    <div class="row">
        <div class="col">
            <b-table
                show-empty
                striped
                bordered
                small
                hover
                responsive="true"
                head-variant="light"
                :items="getExceptionReports"
                :fields="fields">

                <template slot="index" slot-scope="data">
                    {{data.index + 1}}
                </template>
            </b-table>
        </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import axios from '../axios-auth';
export default {
    data() {
        return {
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: 'createdAt',
                    sortable: true,
                    formatter: value => {
                        return new Date(value)
                            .toString()
                            .split(' ')
                            .splice(0, 5)
                            .join(' ');
                    }
                },
                {
                    key: 'filters',
                    formatter: value => {
                        // function ()
                        return JSON.stringify(value, undefined, 2);
                    }
                }
            ]
        };
    },
    components: {
        FontAwesomeIcon
    },
    computed: {
        getExceptionReports() {
            return this.$store.getters.EXCEPTIONS_GETTER;
        }
    },
    created() {
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token');
        this.$store.dispatch('EXCEPTIONS_FETCH_ACTION');
    }
};
</script>
