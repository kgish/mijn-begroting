import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model(params) {
        let url_government = `${config.apiHost}/${config.apiNamespace}/governments/${params.government_id}`;
        return Ember.$.get(url_government);
    },
    setupController(controller, data) {
        this._super(controller, data);
        //http://openspending.nl/api/v1/aggregations/main/?direction=out&period=0&gov_code=1680&year=2017
    }
});
