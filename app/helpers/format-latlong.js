import Ember from 'ember';

export function formatLatlong(params/*, hash*/) {
    let lat = params[0],
        long = params[1];

    return `(${lat},${long})`;
}

export default Ember.Helper.helper(formatLatlong);
