import Ember from 'ember';

export default Ember.Controller.extend({

    modelsTableCustom: Ember.inject.service(),
    customIcons: Ember.computed.alias('modelsTableCustom.customIcons'),
    customClasses: Ember.computed.alias('modelsTableCustom.customClasses'),

    metrics: [],

    columns: [
        { propertyName: "id",     title: "Id" },
        { propertyName: "factor", title: "Factor" },
        { propertyName: "metric", title: "Metric", filterWithSelect: true },
        { propertyName: "year",   title: "Year", filterWithSelect: true, filterFunction: function(s1, s2) {
            return parseInt(s1) === parseInt(s2);
        } },
        { propertyName: "resource_uri", title: "Resource URI"}
    ],

    actions: {
        showMetrics(b) {
            this.set('metrics', b ? this.get('model.metrics') : []);
        },
        getDocuments() {
            // url_docs http://www.openspending.nl/api/v1/documents/?government__kind=county&period=0&plan=budget&direction=in&limit=10
        }
    }
});
