import Ember from 'ember';

export function safeWidth(params/*, hash*/) {
    let width = params[0],
        style = `width:${width}%`;

    return Ember.String.htmlSafe(style);
}

export default Ember.Helper.helper(safeWidth);
