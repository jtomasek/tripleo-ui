import { Schema, arrayOf } from 'normalizr';

export const resourceGroupSchema = new Schema('resourceGroups', { idAttribute: 'id' });
export const parameterSchema = new Schema('parameters', { idAttribute: 'id' });

resourceGroupSchema.define({
  NestedParameters: arrayOf(resourceGroupSchema),
  Parameters: arrayOf(parameterSchema)
});
