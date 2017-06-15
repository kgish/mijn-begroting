import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model() {
        let apiUrl = `${config.apiHost}/${config.apiNamespace}`;
        return Ember.$.get(apiUrl + '/aggregations/documents?format=json&limit=0');
    },

    setupController(controller, model) {
        let years = model.facets.years.terms.map(t => t.term).sort();
        controller.set('years', years);
    }
});

