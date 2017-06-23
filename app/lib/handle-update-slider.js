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

                Ember.$('.x-range-input').each(index => {
                    let slider_elem = Ember.$("#slider-"+index),
                        value_elem = Ember.$('#slider-value-'+index),
                        percentage_elem = Ember.$('#slider-percentage-'+index),
                        old_value = parseInt(value_elem.text().replace(/[^0-9]/g,'')),
                        old_percentage = parseInt(percentage_elem.text()),
                        new_value, new_percentage, diff_percentage = 0;

                    if (index !== id) {
                        diff_percentage = sign * Math.round(percentage_remaining/sliders_remaining);
                        new_percentage = old_percentage + diff_percentage;
                        if (new_percentage < 0) {
                            console.log(fn+'new_percentage='+new_percentage+' < 0');
                            diff_percentage += Math.abs(new_percentage);
                            new_percentage = 0;
                        }
                        percentage_elem.text(new_percentage+'%');
                        slider_elem.val(new_percentage);
                        sliders_remaining--;
                    } else {
                        diff_percentage = 0;
                        new_percentage = percentage_new;
                        old_percentage = parseInt((100*old_value)/totalTerms);
                    }
                    new_value = (new_percentage*totalTerms)/100;
                    value_elem.text(FormatMoney(new_value));

                    if (config.environment === 'development') {
                        results.push({
                            percentage: new_percentage,
                            value: new_value
                        });
                    }

                    percentage_remaining -= Math.abs(diff_percentage);
                    percentage_check_total += new_percentage;
                    value_check_total += new_value;

                    console.log(fn+'id='+index+', sliders_remaining='+sliders_remaining+', percentage_remaining='+percentage_remaining+', percentage_diff='+diff_percentage+', percentage '+old_percentage+' => '+new_percentage+', value '+old_value+' => '+new_value);
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
                    results.forEach((result,index) => {
                        let percentage = parseInt(Ember.$('#slider-percentage-'+index).text()),
                            value_text = parseInt(Ember.$('#slider-value-'+index).text().replace(/[^0-9]/g,'')),
                            value_slider = parseInt(Ember.$('#slider-'+index).val());

                        //console.log(fn+'result['+index+']='+JSON.stringify(result));
                        if (value_slider !== result.percentage) {
                            console.error(fn+'i=' + index + ', value_slider (' + value_slider + ') !== result.percentage (' + result.percentage + ')');
                        }
                        if (percentage !== result.percentage) {
                            console.error(fn+'i=' + index + ', percentage (' + percentage + ') !== result.percentage (' + result.percentage + ')');
                        }
                        if (value_text !== result.value) {
                            console.error(fn+'i=' + index + ', value_text (' + value_text + ') !== result.value (' + result.value + ')');
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
