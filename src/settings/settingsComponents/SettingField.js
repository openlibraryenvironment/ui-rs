import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Button,
  Card,
  InfoPopover,
  Select,
  TextField,
} from '@folio/stripes/components';
import { RefdataButtons } from '@folio/stripes-reshare';
import { TemplateEditor } from '@folio/stripes-template-editor';

import HtmlToReact, { Parser } from 'html-to-react';

import snakeToCamel from '../../util/snakeToCamel';
import css from './SettingField.css';

class SettingField extends React.Component {
  static propTypes = {
    settingData: PropTypes.shape({
      refdatavalues: PropTypes.arrayOf(PropTypes.object),
      currentSetting: PropTypes.object
    }),
    input: PropTypes.object,
    onSave: PropTypes.func
  };

  state = {
    editing: false
  };

  renderHelpText = (id) => {
    return (
      <div className={css.help}>
        <FormattedMessage
          id={id}
          values={{
            b: (chunks) => <b>{chunks}</b>,
            i: (chunks) => <i>{chunks}</i>,
            em: (chunks) => <em>{chunks}</em>,
            strong: (chunks) => <strong>{chunks}</strong>,
            span: (chunks) => <span>{chunks}</span>,
            div: (chunks) => <div>{chunks}</div>,
            p: (chunks) => <p>{chunks}</p>,
            ul: (chunks) => <ul>{chunks}</ul>,
            ol: (chunks) => <ol>{chunks}</ol>,
            li: (chunks) => <li>{chunks}</li>,
          }}
        />
      </div>
    );
  };

  renderSettingValue = (setting) => {
    const { settingData } = this.props;
    switch (setting.settingType){
      case 'Refdata':
        const refValues = settingData?.refdatavalues?.filter((obj) => {
          return obj.desc === setting.vocab;
        })[0]?.values;
        const settingLabel = setting.value ? refValues?.filter((obj) => obj.value === setting.value)[0]?.label : undefined;
        return (
          <p>
            {settingLabel || (setting.defValue ? `[default] ${setting.defValue}` : <FormattedMessage id="ui-rs.settings.no-current-value" />)}
          </p>
        );
      case 'Password':
        return (
          <p>
            {setting.value ? '********' : (setting.defValue ? '[default] ********' : <FormattedMessage id="ui-rs.settings.no-current-value" />)}
          </p>
        );
      case 'Template':
        const parser = new Parser();
        const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
        const rules = [
          {
            shouldProcessNode: () => true,
            processNode: processNodeDefinitions.processDefaultNode,
          },
        ];
        const valueToParse = setting.value || setting.defValue;
        const parsedTemplate = parser.parseWithInstructions(valueToParse, () => true, rules);
        return parsedTemplate;
      default:
        return (
          <p>
            {setting.value || (setting.defValue ? `[default] ${setting.defValue}` : <FormattedMessage id="ui-rs.settings.no-current-value" /> )}
          </p>
        );
    }
  }

  renderEditSettingValue = (setting) => {
    const { settingData } = this.props;

    switch (setting.settingType) {
      case 'Refdata':
        // Grab refdata values corresponding to setting
        // eslint-disable-next-line no-case-declarations
        const selectRefValues = settingData?.refdatavalues.filter((obj) => {
          return obj.desc === setting.vocab;
        })[0].values;
        // eslint-disable-next-line no-case-declarations
        let RefdataComponent = Select;
        if (selectRefValues.length > 0 && selectRefValues.length <= 4) {
          RefdataComponent = RefdataButtons;
        }

        return (
          <Field
            name={`${this.props.input.name}`}
            component={RefdataComponent}
            dataOptions={selectRefValues}
          />
        );

      case 'Password':
        return (
          <Field
            autoFocus
            name={`${this.props.input.name}`}
            type="password"
            component={TextField}
            parse={v => v} // Lets us send an empty string instead of 'undefined'
          />
        );
      case 'Template':
        return (
          <Field
            name={`${this.props.input.name}`}
            component={TemplateEditor}
            tokens={[]}
            tokensList={<div/>}
            previewModalHeader={
              <FormattedMessage id={`ui-rs.settings.template.${snakeToCamel(setting.key)}.previewHeader`} />
            }
          />
        );
      default:
        // If in doubt, go with String
        return (
          <Field
            autoFocus
            name={`${this.props.input.name}`}
            component={TextField}
            parse={v => v} // Lets us send an empty string instead of 'undefined'
          />
        );
    }
  }

  renderEditButton() {
    const { editing } = this.state;
    let EditText;

    if (editing === true) {
      EditText = <FormattedMessage id="ui-rs.settings.finish-editing" />;
      return (
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            return (
              this.handleSave()
            );
          }}
        >
          {EditText}
        </Button>
      );
    } else {
      EditText = <FormattedMessage id="ui-rs.settings.edit" />;
      return (
        <Button
          onClick={(e) => {
            e.preventDefault();
            return (
              this.setState({ editing: true })
            );
          }}
        >
          {EditText}
        </Button>
      );
    }
  }

  handleSave = () => {
    this.props.onSave()
      .then(() => this.setState({ editing: false }));
  }

  render() {
    const { 
      settingData: {
        currentSetting: setting = {}
      } = {}
    } = this.props;

    console.log("PROPS: %o", this.props)

    let renderFunction;
    if (this.state.editing === false) {
      renderFunction = this.renderSettingValue(setting);
    } else {
      renderFunction = this.renderEditSettingValue(setting);
    }

    const camelKey = snakeToCamel(setting.key);
    const id = `ui-rs.settingName.${camelKey}.help`;

    return (
      <Card
        headerStart={
          Object.keys(setting).length > 0 ?
          <FormattedMessage id={`ui-rs.settingName.${camelKey}`} /> :
          <FormattedMessage id="ui-rs.settingName.settingLoading" />
        }
        headerEnd={this.renderEditButton()}
        roundedBorder
      >
        {renderFunction}
        {this.props.intl.messages[id] && <InfoPopover content={this.renderHelpText(id)} />}
      </Card>
    );
  }
}

export default injectIntl(SettingField);
