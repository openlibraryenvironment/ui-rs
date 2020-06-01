import { rrulestr } from 'rrule';

function raw2userData(raw) {
  const daymap = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const rrule = rrulestr(raw.rrule);
  const payload = JSON.parse(raw.taskConfig);
  const { locations, emailAddresses } = payload;

  return {
    id: raw.id,
    name: raw.description,
    status: raw.enabled,
    times: rrule.options.byhour.map(t => `${`0${t}`.substr(-2)}:00:00`),
    days: rrule.options.byweekday.map(w => daymap[w]),
    locations,
    emailAddresses,
  };
}

export default raw2userData;
