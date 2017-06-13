import Ember from 'ember';

export function capitalizeWords(params/*, hash*/) {
    return params[0]
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default Ember.Helper.helper(capitalizeWords);
