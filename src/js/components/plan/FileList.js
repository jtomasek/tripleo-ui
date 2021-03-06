import ClassNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import { PlanFile } from '../../immutableRecords/plans';
import React from 'react';

export default class FileList extends React.Component {

  getMergedFiles(planFiles, selectedFiles) {
    let files = {};
    if(!planFiles.isEmpty()) {
      planFiles.map(file => {
        files[file.name] = file;
      });
    }
    if(selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        let existing = files[file.name];
        let info;
        if(!existing) {
          info = Map({
            newFile: planFiles.isEmpty() ? false : true,
            changed: false
          });
        }
        else {
          info = Map({
            newFile: false,
            changed: file.content !== existing.contents
          });
        }
        files[file.name] = PlanFile({ name: file.name, info: info });
      });
    }
    return Map(files)
            .sort((fileA, fileB) => {
              let [aName, aChangedOrNew] = [ fileA.name,
                                             (fileA.getIn(['info', 'changed']) ||
                                              fileA.getIn(['info', 'newFile'])) ];
              let [bName, bChangedOrNew] = [ fileB.name,
                                             (fileB.getIn(['info', 'changed']) ||
                                              fileB.getIn(['info', 'newFile'])) ];
              if(aChangedOrNew && !bChangedOrNew) {
                return -1;
              }
              else if(!aChangedOrNew && bChangedOrNew) {
                return 1;
              }
              else {
                return aName > bName ? 1 : -1;
              }
            })
            .toArray();
  }

  render() {
    if(this.props.planFiles.size === 0 && this.props.selectedFiles === 0) {
      return null;
    }
    let files = this.getMergedFiles(this.props.planFiles, this.props.selectedFiles).map(file => {
      let info = file.info.toJS() || {};
      let classes = ClassNames({
        'changed-plan-file': info.changed,
        'new-plan-file': info.newFile
      });
      return (
        <tr key={file.name}>
          <td className={classes}>{file.name}</td>
        </tr>
      );
    });
    return (
      <div className="panel panel-default">
        <div className="panel-heading" role="tab" id="plan-files-list-panel">
          <h4 className="panel-title">Plan Files</h4>
        </div>
        <table className="table upload-files">
          <tbody>
            {files}
          </tbody>
        </table>
      </div>
    );
  }
}

FileList.propTypes = {
  planFiles: ImmutablePropTypes.map,
  selectedFiles: React.PropTypes.array
};

FileList.defaultProps = {
  planFiles: Map(),
  selectedFiles: []
};
