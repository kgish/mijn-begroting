import Ember from 'ember';

export function formatPercentage(params) {
    let percentage = params[0],
        pct = params[1] ? '' : '%';

    return Math.round(percentage) + pct;
}

export default Ember.Helper.helper(formatPercentage);
