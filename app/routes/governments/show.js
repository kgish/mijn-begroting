/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default Ember.Route.extend({
    model(params) {
        let url_government = `${config.apiHost}/${config.apiNamespace}/governments/${params.government_id}`;
        return Ember.$.get(url_government);
    },
    setupController(controller, data) {
        this._super(controller, data);
        if (data.kind !== 'benchmark') {
            let gov_code = data.code.substring(2);
            let url_aggregations =
                config.apiHost + '/' + config.apiNamespace + '/aggregations/main' +
                '?direction=out' +
                '&period=0' +
                '&gov_code=' + gov_code +
                '&year=2017';
            //console.log('url_aggregations='+url_aggregations);
            Ember.$.get(url_aggregations).then(
                data => {
                    let terms = data.facets.terms.terms,
                        names = ["bestuur-en-ondersteuning", "veiligheid", "verkeer-vervoer-en-waterstaat", "economie", "onderwijs","sport-cultuur-en-recreatie", "sociaal-domein", "volksgezondheid-en-milieu", "volkshuisvesting-ruimtelijke-ordening-en-stedelijke-vernieuwing"];
                    terms = terms.map(term => {
                        let index = parseInt(term.term);
                        term.mean = term.mean.toFixed(2);
                        if (index > 0 && index < 10) {
                            term.term_name = names[term.term - 1];
                        } else {
                            term.term_name = '';
                        }
                        return term;
                    });
                    controller.set('terms', terms);
                },
                error => {
                    console.error(error);
                }
            );
        }
    }
});
