<template>
  <div class="container p-2">
    <div class="row">
      <div class="col-4">
        <b-form @submit="onSubmit" @reset="onReset">
          <div>
            <b-form-select v-model="form.environment" :options="options" class="mb-3" size="sm"/>
          </div>
          <b-form-group id="datacenterGroup"
                        label="Datacenter Display Name"
                        label-for="displayName"
                        description="Ex., INDIA DC, AUSTRALIA DC">
            <b-form-input id="displayName"
                          type="text"
                          v-model.trim="form.displayName"
                          size="sm"
                          required
                          placeholder="Datacenter Display Name">
            </b-form-input>
          </b-form-group>
          <b-form-group id="textGroup"
                        label="TEXT"
                        label-for="text"
                        description="One word, ex., sc9, uk, rhb, canada, idc, au">
            <b-form-input id="text"
                          type="text"
                          v-model.trim="form.name"
                          size="sm"
                          required
                          placeholder="Datacenter value">
            </b-form-input>
          </b-form-group>
          <hr>
          <p><b>{{form.environment}} {{form.displayName}} {{form.name}}</b></p>
          <hr>
          <b-button type="submit" variant="primary">Add New</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
      <div class="col">
        <h3>Existing Datatacenters</h3>
        <b-table
            show-empty
            striped
            bordered
            small
            hover
            responsive="true"
            head-variant="light"
            :items="getExistingDatacenters"
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
export default {
    data() {
        return {
            options: [
                { value: null, text: 'Please select an environment' },
                { value: 'production', text: 'Production' },
                { value: 'stage', text: 'Stage' }
            ],
            form: {
                name: '',
                displayName: '',
                environment: null
            },
            fields: [
                {
                    key: 'index',
                    label: 'Sl'
                },
                {
                    key: 'environment',
                    sortable: true
                },
                {
                    key: 'text',
                    label: 'Datacenter',
                    sortable: true
                }
            ]
        };
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            this.$store.dispatch('DATACENTER_ADD_ACTION', { ...this.form });
        },
        onReset(evt) {
            evt.preventDefault();
            /* Reset our form values */
            this.form.name = '';
            this.form.displayName = '';
            this.form.environment = null;

            /* Trick to reset/clear native browser form validation state */
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        }
    },
    computed: {
        getExistingDatacenters() {
            return this.$store.getters.DATACENTERS_GETTER;
        }
    }
};
</script>
