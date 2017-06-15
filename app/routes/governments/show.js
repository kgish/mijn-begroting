import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model(params) {
        let url = `${config.apiHost}/${config.apiNamespace}/governments/${params.government_id}?format=json`;
        return Ember.$.get(url);
    },

    setupController(controller, data) {
        this._super(controller, data);
        console.log('++++ ', JSON.stringify(data));
    }
});
