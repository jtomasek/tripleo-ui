/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import cx from 'classnames';
import { Modal as BootstrapModal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Enhanced React Bootstrap Modal component to allow additional xl size
 */
const Modal = ({ dialogClassName, bsSize, ...props }, { modalManager }) => (
  <BootstrapModal
    {...props}
    manager={modalManager}
    dialogClassName={cx(dialogClassName, `modal-${bsSize}`)}
  />
);
Modal.contextTypes = {
  modalManager: PropTypes.object
};
Modal.propTypes = {
  ...BootstrapModal.propTypes,
  bsSize: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  children: PropTypes.node
};
Modal.defaultProps = {
  ...BootstrapModal.defaultProps,
  bsSize: 'md'
};
export default Modal;