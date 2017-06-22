/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default function(context, b) {
    if (b) {
        let model_code = context.get('model.code'),
            gov_code = model_code.substring(2),
            direction = context.get('direction'),
            period = context.get('period'),
            year = context.get('year'),
            url_aggregations =
                config.apiHost + '/' + config.apiNamespace + '/aggregations/main' +
                '?direction=' + direction +
                '&period=' + period +
                '&gov_code=' + gov_code +
                '&year=' + year;
        //console.log('url_aggregations='+url_aggregations);
        context.set('loadingTerms', true);
        Ember.$.get(url_aggregations).then(
            data => {
                let terms = data.facets.terms.terms,
                    names = context.get('mainNames'),
                    results = [],
                    totalTerms = 0;
                terms.forEach(term => {
                    let index = parseInt(term.term);
                    term.mean = term.mean.toFixed(2);
                    if (index > 0 && index < 10) {
                        term.term_name = names[term.term - 1];
                    } else {
                        term.term_name = '';
                    }
                    results.push(term);
                    totalTerms += parseInt(term.total);
                    return term;
                });
                context.set('terms', results);
                context.set('totalTerms', totalTerms);
                context.set('loadingTerms', false);
                context.set('showTerms', true);
            },
            error => {
                console.error(error);
                context.set('loadingTerms', false);
                context.set('showTerms', true);
            }
        );
    } else {
        context.set('showTerms', b);
    }
}
