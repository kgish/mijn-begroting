/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
import Ember from 'ember';
import FormatMoney from 'mijn-begroting/lib/format-money';
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
                percentage_delta;

            // Calculate total of all other percentages.
            Ember.$('.slider-percentage').each((index,elem) => {
                if (index !== id) {
                    percentage_other_total += parseInt(Ember.$(elem).text());
                }
            });

            console.log(fn+'percentage_new='+percentage_new+', percentage_other_total='+percentage_other_total);

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
                let num_sliders = Ember.$('.x-range-input').length;
                let sign = 1,
                    sliders_remaining = num_sliders - 1,
                    percentage_remaining,
                    percentage_each,
                    results = [];

                console.log(fn+'percentage_delta='+percentage_delta+', num_sliders='+num_sliders);
                if (num_sliders < 2) {
                    console.error(fn+'num_sliders < 2 => return');
                    return;
                }

                if (percentage_delta < 0) {
                    percentage_delta *= -1;
                    sign = -1;
                }

                percentage_remaining = percentage_delta;

                console.log(fn+'adjusted percentage_delta='+percentage_delta+', sign='+sign);

                percentage_each = percentage_remaining/sliders_remaining;
                if (sign === 1) {
                    Ember.$('.x-range-input').each(index => {
                        let slider_elem = Ember.$("#slider-"+index),
                            value_elem = Ember.$('#slider-value-'+index),
                            percentage_elem = Ember.$('#slider-percentage-'+index),
                            old_value = parseInt(value_elem.text().replace(/[^0-9]/g,'')),
                            old_percentage = parseInt(percentage_elem.text()),
                            new_value, new_percentage;

                        if (index !== id) {
                            new_percentage = old_percentage + percentage_each;
                            percentage_elem.text(new_percentage+'%');
                            sliders_remaining--;
                            percentage_remaining -= percentage_each;
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

                        console.log(fn+'id='+index+', sliders_remaining='+sliders_remaining+', percentage_remaining='+percentage_remaining+', percentage '+old_percentage+' => '+new_percentage+', value '+old_value+' => '+new_value);
                    });

                } else {
                    Ember.$('.x-range-input').each(index => {
                        let slider_elem = Ember.$("#slider-"+index),
                            value_elem = Ember.$('#slider-value-'+index),
                            percentage_elem = Ember.$('#slider-percentage-'+index),
                            old_value = parseInt(value_elem.text().replace(/[^0-9]/g,'')),
                            old_percentage = parseInt(percentage_elem.text()),
                            new_value, new_percentage;

                        if (index !== id && old_percentage <= percentage_each) {
                            percentage_remaining += (percentage_each - old_percentage);
                            sliders_remaining--;
                            new_percentage = new_value = 0;
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
                        }

                        percentage_check_total += new_percentage;
                        value_check_total += new_value;

                        console.log(fn+'id='+index+', sliders_remaining='+sliders_remaining+', percentage_remaining='+percentage_remaining+', percentage '+old_percentage+' => '+new_percentage+', value '+old_value+' => '+new_value);
                    });

                    percentage_each = percentage_remaining/sliders_remaining;

                    Ember.$('.x-range-input').each(index => {
                        let slider_elem = Ember.$("#slider-"+index),
                            value_elem = Ember.$('#slider-value-'+index),
                            percentage_elem = Ember.$('#slider-percentage-'+index),
                            old_value = parseInt(value_elem.text().replace(/[^0-9]/g,'')),
                            old_percentage = parseInt(percentage_elem.text()),
                            new_value, new_percentage;

                        if (index !== id) {
                            if (!results.findBy('index', index)) {
                                percentage_remaining -= percentage_each;
                                sliders_remaining--;
                                new_percentage = old_percentage - percentage_each;
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
                            }
                        } else {
                            new_percentage = percentage_new;
                            old_percentage = parseInt((100*old_value)/totalTerms);
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
                        }

                        percentage_check_total += new_percentage;
                        value_check_total += new_value;

                        console.log(fn+'id='+index+', sliders_remaining='+sliders_remaining+', percentage_remaining='+percentage_remaining+', percentage '+old_percentage+' => '+new_percentage+', value '+old_value+' => '+new_value);
                    });
                }

                results.forEach(result => {
                    result.slider_elem.val(result.new_percentage);
                    result.percentage_elem.text(result.new_percentage+'%');
                    result.value_elem.text(FormatMoney(result.new_value));
                });

                if (config.environment === 'development') {
                    // Verify that the totals are accurate.
                    if (Math.abs(percentage_check_total - 100) > 1) {
                        console.error(fn+'percentage_check_total='+percentage_check_total+' => (should be between 99 - 101)');
                    }
                    let epsilon = parseInt(0.01 * totalTerms);
                    if (Math.abs(value_check_total - totalTerms) > epsilon) {
                        console.error(fn+'value_check_total='+value_check_total+' => (should be between '+(totalTerms-epsilon)+ ' - '+(totalTerms+epsilon)+')');
                    }

                    // Verify new values have taken affect for all sliders.
                    results.forEach(result => {
                        let percentage = parseInt(Ember.$('#slider-percentage-'+result.index).text()),
                            value_text = parseInt(Ember.$('#slider-value-'+result.index).text().replace(/[^0-9]/g,'')),
                            value_slider = parseInt(Ember.$('#slider-'+result.index).val());

                        //console.log(fn+'result['+index+']='+JSON.stringify(result));
                        if (value_slider !== result.new_percentage) {
                            console.error(fn+'i=' + result.index + ', value_slider (' + value_slider + ') !== result.new_percentage (' + result.new_percentage + ')');
                        }
                        if (percentage !== result.new_percentage) {
                            console.error(fn+'i=' + result.index + ', percentage (' + percentage + ') !== result.new_percentage (' + result.new_percentage + ')');
                        }
                        if (value_text !== result.new_value) {
                            console.error(fn+'i=' + result.index + ', value_text (' + value_text + ') !== result.new_value (' + result.value + ')');
                        }
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
