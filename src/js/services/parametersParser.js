import { fromJS, Map } from 'immutable';

import { Parameter } from '../immutableRecords/parameters';

/**
* Turns Immutable Map into List and adds Map's key as a specified property
*/
const mapToList = (map, newProp) => {
  return map.map((v, k) => v.set(newProp, k)).toList();
};

/**
 * converts Heat validate response into tree of Map Lists so it can be normalized
 */
export const arrayify = heatResponseTree => {
  return heatResponseTree.map((item, key) => {
    if (key === 'Parameters') {
      return mapToList(item, 'id');
    } else if (key === 'NestedParameters') {
      return mapToList(item, 'id').map(item => arrayify(item));
    } else {
      return item;
    }
  });
};

/**
 * Transforms Heat validate output into a sane parameters object
 */
export const parseParameters = heatResponse => {
  const heatParameters = fromJS(heatResponse);
  return Map({
    general: _convertToParameters(heatParameters.get('Parameters', Map())),
    roles: heatParameters.get('NestedParameters', Map())
             .filter(resource => resource.get('Type') === 'OS::Heat::ResourceGroup')
             .map((role, roleKey) => {
               const roleNestedStack = role.getIn(['NestedParameters', '0'], Map());
               return Map({
                 description: roleNestedStack.get('Description'),
                 parameters: _convertToParameters(roleNestedStack.get('Parameters', Map())),
                 services: _getRoleServices(heatParameters, roleKey),
                 networkConfiguration: _getRoleNetworkConfigParameters(roleNestedStack, roleKey)
               });
             })
  });
};

/**
 * Brings up network configuration parameters for a specific role
 */
export const _getRoleNetworkConfigParameters = (roleNestedStack, roleKey) => {
  return roleNestedStack.get('NestedParameters', Map())
           .filter(resource =>
                   resource.get('Type') === `OS::TripleO::${roleKey}::Net::SoftwareConfig`)
           .map(resource => Map({
             description: resource.get('Description'),
             parameters: _convertToParameters(resource.get('Parameters', Map()))
           }));
};

/**
 * Brings parameters for services assigned to a role
 */
export const _getRoleServices = (heatParameters, roleKey) => {
  return heatParameters.get('NestedParameters', Map())
           // find resources named <RoleName>ServiceChain
           .find((resource, resourceKey) => resourceKey === `${roleKey}ServiceChain`, Map())
           // get Map of services (format is {0:service})
           .getIn(['NestedParameters', 'ServiceChain', 'NestedParameters'], Map())
           // convert the format of services to {Type:service}
           .mapEntries(([serviceKey, service]) => [service.get('Type'), service])
           // map the service to { name:..., description: ..., parameters: Map() }
           .map(service => Map({
             name: service.get('Type'),
             description: service.get('Description'),
             parameters: _convertToParameters(service.get('Parameters', Map()))
           }));
};

/**
 * Converts parameters to immutable Parameter Records
 */
export const _convertToParameters = parameters => {
  return parameters.map(parameter => new Parameter(parameter));
};
