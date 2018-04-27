<template>
  <div>
    <h1>Counter Store Demo</h1>
    Result here {{counter}}
    <app-result />
    <hr/>
    <app-counter />
  </div>
</template>
<script>
import Counter from './Counter';
import Result from './Result';
export default {
    components: {
        appResult: Result,
        appCounter: Counter
    },
    computed: {
        counter() {
            return this.$store.state.counterStore.counter;
        }
    }
};
</script>
