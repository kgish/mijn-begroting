import Ember from 'ember';

export default Ember.Controller.extend({
    tab: 0,

    actions: {
        selectTab(tab) {
            this.set('tab', tab);
        }
    }
});
