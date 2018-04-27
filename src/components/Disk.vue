<template>
  <div>This is Disk details</div>
</template>

<script>
export default {
    created() {
        this.$store.dispatch('DISK_GET_ALL_ACTION');
    }
};
</script>
