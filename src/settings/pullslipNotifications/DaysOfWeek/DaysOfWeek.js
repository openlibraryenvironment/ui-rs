import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@folio/stripes/components';
import css from './DaysOfWeek.css';

// See https://final-form.org/docs/react-final-form/api/Field#custom-inputs
// for the API that custom inputs for final-form must implement.

const days = [
  ['Mo', 'M'],
  ['Tu', 'Tu'],
  ['We', 'W'],
  ['Th', 'Th'],
  ['Fr', 'F'],
  ['Sa', 'Sa'],
  ['Su', 'Su'],
];

const display2code = {};
days.forEach(([code, display]) => { display2code[display] = code; });

const DaysOfWeek = (props) => {
  const { id, label, required, readOnly, input } = props;
  const { value, onChange } = input;
  const checked = {};
  value.forEach(v => { checked[v] = true; });

  const toggleDay = (e) => {
    const display = e.target.textContent;
    const code = display2code[display];

    checked[code] = !checked[code];
    const newValue = days.filter(([c]) => checked[c]).map(([c]) => c);
    onChange(newValue);
  };

  return (
    <>
      {label && (
        <Label
          htmlFor={id}
          required={required}
          readOnly={readOnly}
        >
          {label}
        </Label>
      )}

      <div className={css.days}>
        {days.map(([code, display], i) => (
          <React.Fragment key={i}>
            <button
              type="button"
              onClick={toggleDay}
              aria-pressed={checked[code]}
              className={checked[code] ? css.checked : css.unchecked}
            >
              {display}
            </button>
            {' '}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

DaysOfWeek.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  input: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default DaysOfWeek;
