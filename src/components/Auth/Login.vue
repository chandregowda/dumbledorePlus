<template>
  <div class="loginForm">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group id="emailGroup"
                    label="Login"
                    label-for="email"
                    description="You can skip @yodlee.com">
        <b-form-input id="email"
                      type="text"
                      v-model="form.email"
                      required
                      placeholder="you@yodlee.com">
        </b-form-input>
      </b-form-group>
      <b-form-group id="passwordGroup"
                    label="Password"
                    label-for="password">
        <b-form-input id="password"
                      type="password"
                      v-model="form.password"
                      required
                      placeholder="Password">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                email: '',
                password: ''
            },
            show: true
        };
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            this.$store.dispatch('AUTH_LOGIN_ACTION', { ...this.form });
        },
        onReset(evt) {
            evt.preventDefault();
            /* Reset our form values */
            this.form.email = '';
            this.form.password = '';

            /* Trick to reset/clear native browser form validation state */
            this.show = false;
            this.$nextTick(() => {
                this.show = true;
            });
        }
    }
};
</script>
<style>
.loginForm {
    width: 300px;
    margin: 30px auto;
    border: 1px solid #eee;
    padding: 20px;
    box-shadow: 0 0 2px #ccc;
}
</style>
