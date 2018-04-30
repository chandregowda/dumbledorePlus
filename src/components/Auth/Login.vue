<template>
  <div class="loginForm">
    <h1 class="display-1 text-center text-warning">
        <font-awesome-icon icon="crosshairs" :spin="isAuthenticating" class="success"/>
    </h1>
    <h2 class="display-5 text-center text-info">Dumbledore +</h2>
    <hr>
    <b-form @submit="onSubmit" v-if="show" >
      <b-form-group id="emailGroup"
                    label="Username"
                    label-for="email"
                    description="Your Email login name, skip @yodlee.com">
        <b-form-input id="email"
                      type="text"
                      :state="nameState"
                      v-model.trim="form.email"
                      size="sm"
                      required
                      placeholder="you@yodlee.com"> {{nameState}}
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
            Enter at least 3 letters
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="passwordGroup"
                    label="Password"
                    label-for="password">
        <b-form-input id="password"
                      type="password"
                      :state="passwordState"
                      v-model.trim="form.password"
                      size="sm"
                      required
                      placeholder="Password">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
            Enter at least 6 letters
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- <b-form-invalid-feedback>{{hasAuthError}}</b-form-invalid-feedback> -->
      <b-button type="submit" block variant="primary" :disabled="isAuthenticating || !isDisabled">
          {{isAuthenticating ? 'Validating' : 'Login'}}
      </b-button>
      <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
    </b-form>
    <p class="mt-3 error text-danger text-center" v-if="hasAuthError">{{hasAuthError}}</p>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';

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
    computed: {
        isAuthenticating() {
            return this.$store.getters.AUTH_AUTHENTICATING_GETTER;
        },
        hasAuthError() {
            return this.$store.getters.AUTH_ERROR_GETTER;
        },
        nameState() {
            // console.log('checking name state', this.form.email.length);
            return this.form.email.length >= 3;
        },
        passwordState() {
            return this.form.password.length >= 6;
        },
        isDisabled() {
            return this.form.email.length >= 3 && this.form.password.length >= 6;
        }
    },
    components: {
        FontAwesomeIcon
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            this.$store.dispatch('AUTH_START_AUTHENTICATION_ACTION');
            this.$store.dispatch('AUTH_LOGIN_ACTION', { ...this.form });
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
.main-logo {
    font-size: 46px;
}
</style>
