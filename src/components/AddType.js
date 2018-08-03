
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Picker,
  Alert
} from 'react-native';

import { compose } from 'redux';
import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

import Modal from 'react-native-modalbox';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var screen = Dimensions.get('window');

class AddType extends Component<Props> {

  showAddTypeModal = () => {
    this.refs.myTypeModal.open();
  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      name: '',
      icon: Constants.DEFAULT_ICON
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  _addType = () => {
    var error = '';
    if(this.state.name === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,[Constants.TXT_TYPE_NAME]) + "\n";
    }

    if(error === '') {
      var formdata = this.state;

      var created_at = updated_at = Utils.getCurrentDate();
      var id = Utils.generateId();
      var sql = 'INSERT INTO ' + Constants.TYPES_TBL + '(value, name, color, icon, is_sync, `order`, created_at, updated_at) VALUES ';
      sql += '(' + id  +',"' + formdata.name + '", "", "' + formdata.icon + '", "' + Constants.NOT_SYNC + '",90,"' + created_at + '", "' + updated_at + '")';
        
      db.transaction((tx) => {
          tx.executeSql(sql, [], (tx, results) => {
              if(results.rowsAffected > 0) {
                  this.props.onAddType(formdata);
                  Alert.alert(Constants.ALERT_TITLE_INFO, Constants.REGISTER_DATA_SUCCESS);
              }
          });
      });

      this._resetForm();

      this.refs.myTypeModal.close();
    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
  }

  _resetForm = () => {
    this.setState({
      value: '',
      name: '',
      icon: Constants.DEFAULT_ICON,
    })
  }

	render() {

    var { types_locations, index } = this.props;

    var button_txt = Constants.TXT_BUTTON_UPDATE;
    if(index === 999) {
      button_txt = Constants.TXT_BUTTON_ADD;
    }

		return (
      <Modal ref={'myTypeModal'}
             style={{ justifyContent: 'center', borderRadius:5, shadowRadius: 10, width: screen.width - 30, height: 400  }} 
             position='center'
             backdrop={true}
             onOpened={() => {
              
                
             }}
             onClosed={() => {
             }}
      >
        <Text style={{ fontSize:16, fontWeight: 'bold', textAlign: 'center' }}>{ Constants.TXT_ADD_TYPE }</Text>
        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ name: text })}
            placeholder={ Constants.TXT_TYPE_NAME }
            value={ this.state.name } />

        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ icon: text })}
            placeholder={ Constants.TXT_ICON }
            value={ this.state.icon } />
        

        <TouchableOpacity onPress={ this._addType } style={{ padding:0, marginLeft: 70, marginRight: 70, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color:'#f0f0f0' }}>{ button_txt }</Text>
        </TouchableOpacity>
      </Modal>
		)
	}
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onAddType: (formdata) => {
      dispatch(Actions.addType(formdata));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(AddType);