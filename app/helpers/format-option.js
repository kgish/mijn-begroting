import Ember from 'ember';

export function formatOption(params/*, hash*/) {
    let option = params[0];

    option = option.charAt(0).toUpperCase() + option.slice(1);
    option = option.replace(/_/, ' ');

    return option;
}

export default Ember.Helper.helper(formatOption);
