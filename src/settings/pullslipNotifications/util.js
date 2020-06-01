import { rrulestr, RRule } from 'rrule';

const dayNumber2String = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const dayString2Number = {};
dayNumber2String.forEach((val, i) => { dayString2Number[val] = i; });


export function raw2userData(raw) {
  const rrule = rrulestr(raw.rrule);
  const payload = JSON.parse(raw.taskConfig);
  const { locations, emailAddresses } = payload;

  return {
    id: raw.id,
    name: raw.description,
    status: raw.enabled,
    times: rrule.options.byhour.map(t => `${`0${t}`.substr(-2)}:00:00`),
    days: rrule.options.byweekday.map(w => dayNumber2String[w]),
    locations,
    emailAddresses,
  };
}


export function user2rawData(values) {
  const { locations, emailAddresses } = values;
  const rrule = new RRule({
    freq: RRule.WEEKLY,
    byweekday: values.days.map(s => dayString2Number[s]),
    byhour: values.times.map(t => t.replace(/0*([0-9]+):.*/, '$1')),
  });

  return {
    id: values.id,
    taskCode: 'PrintPullSlips',
    description: values.name,
    enabled: values.status,
    rrule: rrule.toString(),
    taskConfig: JSON.stringify({ locations, emailAddresses }),
  };
}
