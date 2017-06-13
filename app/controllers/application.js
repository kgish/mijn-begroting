import Ember from 'ember';
import config from 'accountability-hack/config/environment';

export default Ember.Controller.extend({
    appTitle: config.APP.title
});
