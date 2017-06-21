import Ember from 'ember';

export function formatPercentage(params/*, hash*/) {
    let percentage = params[0];

    return Math.round(percentage) + '%';
}

export default Ember.Helper.helper(formatPercentage);
