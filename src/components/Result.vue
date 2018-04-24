<template>
<div>
  <p>Counter is {{ counter }} </p>
  <p>Getters is {{ getIncrement }} </p>
  </div>
</template>

<script>
export default {
    computed: {
        counter() {
            return this.$store.state.counterStore.counter;
        },
        getIncrement() {
            return this.$store.getters.getIncrement;
        }
    }
};
</script>
