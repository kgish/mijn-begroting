/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import Ember from 'ember';
import config from 'mijn-begroting/config/environment';

export default function(context, id, totalTerms) {
    let fn = 'handle-update-slider(id='+id+') ',
        elem_changed = Ember.$('#slider-'+id);
    if (elem_changed.length) {
        Ember.run.later(context, () => {
            let percentage_new = parseInt(elem_changed.val()),
                percentage_other_total = 0,
                percentage_check_total = 0,
                value_check_total = 0,
                num_sliders_other = 0,
                percentage_delta,
                terms = context.get('terms'),
                terms_new = [];

            //console.log(fn+'terms='+JSON.stringify(terms));

            // Calculate total of all other percentages.
            Ember.$('.slider-percentage').each((index,elem) => {
                if (index !== id) {
                    percentage_other_total += parseInt(Ember.$(elem).text());
                    num_sliders_other++;
                }
            });

            //console.log(fn+'percentage_new='+percentage_new+', percentage_other_total='+percentage_other_total);

            // Sanity check, just in case.
            if (percentage_new > 100) {
                console.error(fn+'percentage_new > 100, adjust');
                percentage_new = 100;
            } else if (percentage_new < 0) {
                console.error(fn+'percentage_new < 0, adjust');
                percentage_new = 0;
            }

            percentage_delta = 100 - (percentage_other_total + percentage_new);

            if (percentage_delta) {
                let sign = 1,
                    results = [];

                if (percentage_delta < 0) {
                    percentage_delta *= -1;
                    sign = -1;
                }

                //console.log(fn+'percentage_delta='+percentage_delta+', sign='+sign);

                Ember.$('.x-range-input').each(index => {
                    let slider_elem = Ember.$("#slider-"+index),
                        value_elem = Ember.$('#slider-value-'+index),
                        percentage_elem = Ember.$('#slider-percentage-'+index),
                        old_value = parseInt(value_elem.text().replace(/[^0-9]/g,'')),
                        old_percentage = parseInt(percentage_elem.text()),
                        new_value, new_percentage;

                    if (index !== id) {
                        if (sign === -1) {
                            if (old_percentage) {
                                let delta = (old_percentage/percentage_other_total)*percentage_delta;
                                //console.log(fn+'delta='+delta);
                                new_percentage = old_percentage - delta;
                            } else {
                                new_percentage = 0;
                            }
                        } else {
                            let delta = percentage_delta/num_sliders_other;
                            //console.log(fn+'delta='+delta);
                            new_percentage = old_percentage + delta;
                        }
                    } else {
                        new_percentage = percentage_new;
                        old_percentage = parseInt((100*old_value)/totalTerms);
                    }

                    new_value = (new_percentage*totalTerms)/100;

                    results.push({
                        index: index,
                        slider_elem: slider_elem,
                        value_elem: value_elem,
                        percentage_elem: percentage_elem,
                        old_percentage: old_percentage,
                        new_percentage: Math.round(new_percentage),
                        old_value: old_value,
                        new_value: Math.round(new_value)
                    });

                    percentage_check_total += new_percentage;
                    value_check_total += new_value;

                    //console.log(fn+'id='+index+', percentage '+old_percentage+' => '+new_percentage+', value '+old_value+' => '+new_value);
                });

                terms.forEach((term,index) => {
                    let term_new = term,
                        results_new = results.findBy('index', index);
                    term_new.total = results_new ? results_new.new_value : term.total;
                    terms_new.push(term_new);
                });

                context.set('terms', terms_new);

                if (config.environment === 'development') {
                    Ember.run.scheduleOnce('afterRender', this, () => {
                        // Verify that the totals are accurate.
                        if (Math.abs(percentage_check_total - 100) > 1) {
                            console.error(fn+'percentage_check_total='+percentage_check_total+' => (should be between 99 - 101)');
                        }
                        let epsilon = parseInt(0.01 * totalTerms);
                        if (Math.abs(value_check_total - totalTerms) > epsilon) {
                            console.error(fn+'value_check_total='+value_check_total+' => (should be between '+(totalTerms-epsilon)+ ' - '+(totalTerms+epsilon)+')');
                        }

                        // // Verify new values have taken affect for all sliders.
                        // results.forEach(result => {
                        //     let percentage = parseInt(Ember.$('#slider-percentage-'+result.index).text()),
                        //         value_text = parseInt(Ember.$('#slider-value-'+result.index).text().replace(/[^0-9]/g,'')),
                        //         value_slider = parseInt(Ember.$('#slider-'+result.index).val());
                        //
                        //     //console.log(fn+'result['+index+']='+JSON.stringify(result));
                        //     if (value_slider !== result.new_percentage) {
                        //         console.error(fn+'i=' + result.index + ', value_slider (' + value_slider + ') !== result.new_percentage (' + result.new_percentage + ')');
                        //     }
                        //     if (percentage !== result.new_percentage) {
                        //         console.error(fn+'i=' + result.index + ', percentage (' + percentage + ') !== result.new_percentage (' + result.new_percentage + ')');
                        //     }
                        //     if (value_text !== result.new_value) {
                        //         console.error(fn+'i=' + result.index + ', value_text (' + value_text + ') !== result.new_value (' + result.new_value + ')');
                        //     }
                        // });
                    });
                }

            } else {
                console.error(fn+'percentage_delta='+percentage_delta+' => return');
            }
        }, 250);
    } else {
        console.error(fn+'unknown slider id='+id);
    }
}
