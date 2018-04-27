<template>
  <div>
    <h1>Dashboard for {{user.displayName}}</h1>
</div>
</template>

<script>
export default {
    computed: {
        user() {
            // console.log(this.$store.getters.AUTH_USER_DETAILS_GETTER);
            let details = this.$store.getters.AUTH_USER_DETAILS_GETTER;
            return { displayName: '', ...details };
        }
    },
    created() {
        this.$store.dispatch('PROCESS_GET_BUILD_DETAILS');
    }
};
</script>
