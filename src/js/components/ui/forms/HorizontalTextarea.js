import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

class HorizontalTextarea extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  renderErrorMessage() {
    let errorMessage = this.props.getErrorMessage();
    return errorMessage ? (
      <span className="help-block">{errorMessage}</span>
    ) : false;
  }

  renderDescription() {
    let description = this.props.description;
    return description ? (
      <small className="help-block">{description}</small>
    ) : false;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      // 'has-success': this.props.isValid(),
      'required': this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <textarea type={this.props.type}
                    name={this.props.name}
                    ref={this.props.name}
                    id={this.props.name}
                    rows={this.props.rows}
                    className="form-control"
                    onChange={this.changeValue.bind(this)}
                    value={this.props.getValue()}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled} />
          {this.renderErrorMessage()}
          {this.renderDescription()}
        </div>
      </div>
    );
  }
}
HorizontalTextarea.propTypes = {
  description: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  inputColumnClasses: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.func,
  isValid: React.PropTypes.func,
  labelColumnClasses: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  rows: React.PropTypes.number,
  setValue: React.PropTypes.func,
  showError: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};
HorizontalTextarea.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  rows: 3,
  type: 'text'
};
export default Formsy.HOC(HorizontalTextarea);
