import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
    this.route('data');
    this.route('about');
    this.route('contact');
    this.route('credits');
    this.route('governments', function(){
        this.route('show', { path: ':government_id' });
    });
});

export default Router;
