import Ember from 'ember';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    metrics: [],

    terms: [],
    showTerms: false,

    columnsMetrics: [
        { propertyName: "id",     title: "Id" },
        { propertyName: "factor", title: "Factor" },
        { propertyName: "metric", title: "Metric", filterWithSelect: true },
        { propertyName: "year",   title: "Year", filterWithSelect: true },
        { propertyName: "resource_uri", title: "Resource URI"}
    ],

    columnsTerms: [
        { propertyName: "count",     title: "Count" },
        { propertyName: "min", title: "Min" },
        { propertyName: "max", title: "Max" },
        { propertyName: "mean", title: "Mean" },
        { propertyName: "term",   title: "Term" },
        { propertyName: "term_name", title: "Name" },
        { propertyName: "total", title: "Total"},
        { propertyName: "total_count", title: "Total count"}
    ],

    actions: {
        showTerms(b) {
            this.set('showTerms', b);
            //http://openspending.nl/api/v1/aggregations/main/?direction=out&period=0&gov_code=1680&year=2017
        },
        showMetrics(b) {
            this.set('metrics', b ? this.get('model.metrics') : []);
        }
    }
});
