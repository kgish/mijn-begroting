import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model() {
        let url = `${config.apiHost}/${config.apiNamespace}/governments?limit=0&format=json`;
        return Ember.$.get(url);
    },

    setupController(controller, data) {
        let governments = [],
            kinds = ['all'];
        data.objects.forEach(g => {
            if (kinds.indexOf(g.kind) === -1) {
                kinds.push(g.kind)
            }
            governments.push({
                // aggregations: g.aggregations,
                code: g.code,
                country: g.country,
                display_kind: g.display_kind,
                id: g.id,
                intro: g.intro,
                kind: g.kind,
                lat: g.lat,
                location: g.location,
                lon: g.lon,
                // metrics: g.metrics,
                name: g.name,
                resource_uri: g.resource_uri,
                slug: g.slug,
                state: g.state,
                website: g.website,
            });
        });
        let properties = {governments: governments, kinds: kinds};
        controller.setProperties(properties);
    }
});

