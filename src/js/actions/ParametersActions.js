import { browserHistory } from 'react-router';
import { fromJS } from 'immutable';
import { normalize } from 'normalizr';

import NotificationActions from '../actions/NotificationActions';
import ParametersConstants from '../constants/ParametersConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import { arrayify } from '../services/parametersParser';
import { resourceGroupSchema } from '../normalizrSchemas/parameters';

export default {
  fetchParametersPending() {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_PENDING
    };
  },

  fetchParametersSuccess(parameters) {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
      payload: parameters
    };
  },

  fetchParametersFailed(formErrors, formFieldErrors) {
    return {
      type: ParametersConstants.FETCH_PARAMETERS_FAILED
    };
  },

  fetchParameters(planName) {
    return dispatch => {
      dispatch(this.fetchParametersPending());
      // TripleOApiService.getPlanParameters(planName).then(response => {
      MistralApiService.runAction('tripleo.get_parameters', { container: planName })
      .then(response => {
        // console.log(JSON.parse(response.output).result);
        const rootResourceGroup = arrayify(fromJS(JSON.parse(response.output).result)).toJS();
        const normalizedResponse = normalize(rootResourceGroup, resourceGroupSchema);
        console.log(normalizedResponse);
        // console.log(abc.toJS());
        // const parameters = parseParameters(JSON.parse(response.output).result);
        dispatch(this.fetchParametersSuccess(parameters));
      }).catch(error => {
        dispatch(this.fetchParametersFailed());
        console.error('Error in ParametersActions.fetchParameters', error.stack || error); //eslint-disable-line no-console
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },


  updateParametersPending() {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_PENDING
    };
  },

  updateParametersSuccess(parameters) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_PENDING,
      payload: parameters
    };
  },

  updateParametersFailed(formErrors, formFieldErrors) {
    return {
      type: ParametersConstants.UPDATE_PARAMETERS_FAILED,
      payload: {
        formErrors: formErrors,
        formFieldErrors: formFieldErrors
      }
    };
  },

  updateParameters(planName, data, inputFieldNames, url) {
    return dispatch => {
      dispatch(this.updateParametersPending());
      // TripleOApiService.updatePlanParameters(planName, data).then(response => {
      const dataa = {CloudName: 'overcloud122'};
      MistralApiService.runAction('tripleo.update_parameters',
                                  { container: planName, parameters: dataa })
      .then(response => {
        dispatch(this.updateParametersSuccess(response.parameters));
        dispatch(NotificationActions.notify({
          title: 'Parameters updated',
          message: 'The Deployment parameters have been successfully updated',
          type: 'success'
        }));
        browserHistory.push(url);
      }).catch(error => {
        let errorHandler = new MistralApiErrorHandler(error, inputFieldNames);
        dispatch(this.updateParametersFailed(errorHandler.errors, errorHandler.formFieldErrors));
      });
    };
  }
};
