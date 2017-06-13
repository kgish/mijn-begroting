import DS from 'ember-data';

export default DS.Model.extend({
    factor: DS.attr('number'),
    metric: DS.attr('string'),
    resource_uri: DS.attr('string'),
    year: DS.attr('number')
});
