import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model(params) {
        let url_government = `${config.apiHost}/${config.apiNamespace}/governments/${params.government_id}`;
        return Ember.$.get(url_government);
    },

    activate() {
        this._super.apply(this, arguments);
        this.controllerFor(this.routeName).send('reset');
    }
});
