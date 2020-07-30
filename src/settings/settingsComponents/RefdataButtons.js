import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Tooltip, Row } from '@folio/stripes/components';

const RefdataButtons = (props) => {
  // Render the right number of buttons:
  const buttonRender = () => {
    const { dataOptions, input } = props;
    return (
      dataOptions.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      }).map(option => {
        const buttonProps = {
          'buttonStyle': (input.value === option.value ? 'primary' : 'default'),
          'fullWidth': true,
          'marginBottom0': true,
          'onClick': (() => input.onChange(option.value))
        };

        return (
          <Col xs={12 / dataOptions.length}>
            {option.label.length > 8 ?
              <Tooltip
                id={option.id}
                text={option.label}
              >
                {({ ref, ariaIds }) => (
                  <Button
                    {...buttonProps}
                    ref={ref}
                    aria-labelledby={ariaIds.text}
                  >
                    {`${option.label.substring(0, 8)}...`}
                  </Button>
                )}
              </Tooltip> :
              <Button
                {...buttonProps}
              >
                {option.label}
              </Button>
            }
          </Col>
        );
      })
    );
  };

  return (
    <Row>
      {buttonRender()}
    </Row>
  );
};

RefdataButtons.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
  input: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
    onChange: PropTypes.func.isRequired,
  }).isRequired,
};

export default RefdataButtons;
