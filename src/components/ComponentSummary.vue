<template>
  <section class="card-text">
    <b-table :items="formatedComponents(componentDetails)" :fields="fields"
    show-empty
    striped
    bordered
    small
    hover
    responsive="true"
    head-variant="light" />
  </section>
</template>
<script>
export default {
    props: ['componentDetails'],
    data() {
        return {
            fields: [
                {
                    key: 'component',
                    sortable: true
                },
                {
                    key: 'count',
                    label: 'Nos'
                }
            ]
        };
    },
    methods: {
        formatedComponents(obj) {
            if (obj) {
                return Object.keys(obj)
                    .sort(function(a, b) {
                        return a.toLowerCase().localeCompare(b, 'en', { sensitivity: 'base' });
                    })
                    .map(k => ({ component: k, count: obj[k] }));
            }
        }
    }
};
</script>

<style scoped>
.brown {
    color: brown;
}
.card-body {
    font-size: 0.8rem;
}
.card-deck {
    box-sizing: border-box;
}
.card-deck .card {
    margin-right: 5px;
    margin-left: 5px;
}
.card-deck .card .card-body {
    padding: 5px;
}
</style>
