import Ember from 'ember';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    budget: [],
    metrics: [],

    columnsMetrics: [
        { propertyName: "id",     title: "Id" },
        { propertyName: "factor", title: "Factor" },
        { propertyName: "metric", title: "Metric", filterWithSelect: true },
        { propertyName: "year",   title: "Year", filterWithSelect: true, filterFunction: function(s1, s2) {
            return parseInt(s1) === parseInt(s2);
        } },
        { propertyName: "resource_uri", title: "Resource URI"}
    ],

    actions: {
        getBudget(b) {
            this.set('budget', b ? this.get('model.budget') : []);
            //http://openspending.nl/api/v1/aggregations/main/?direction=out&period=0&gov_code=1680&year=2017
        },
        showMetrics(b) {
            this.set('metrics', b ? this.get('model.metrics') : []);
        }
    }
});
