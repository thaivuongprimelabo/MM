
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

var screen = Dimensions.get('window');

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

class AddLocation extends Component<Props> {

  showAddLocationModal = () => {
    this.refs.myLocationModal.open();
  }

  constructor(props) {
    super(props);

    this.state = {
      id: '',
      name: '',
      latlong: Constants.DEFAULT_LATLONG,
      address: ''
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  _addLocation = () => {
    var error = '';

    if(this.state.name === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,[Constants.TXT_TYPE_NAME]) + "\n";
    }

    if(error === '') {

      var formdata = this.state;

      this.props.onAddLocation(formdata);
      this._resetForm();
      this.refs.myLocationModal.close();

    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
  }

  _resetForm = () => {
    this.setState({
      id: '',
      name: '',
      latlong: Constants.DEFAULT_LATLONG,
      address: ''
    })
  }

	render() {

    var { types_locations, index } = this.props;

    var button_txt = Constants.TXT_BUTTON_UPDATE;
    if(index === 999) {
      button_txt = Constants.TXT_BUTTON_ADD;
    }

		return (
      <Modal ref={'myLocationModal'}
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
            placeholder={ Constants.TXT_LOCATION }
            value={ this.state.name } />

        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ address: text })}
            placeholder={ Constants.TXT_ADDRESS }
            value={ this.state.address } />

        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ latlong: text })}
            placeholder={ Constants.TXT_LATLONG }
            value={ this.state.latlong } />
        

        <TouchableOpacity onPress={ this._addLocation } style={{ padding:0, marginLeft: 70, marginRight: 70, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
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
    onAddLocation: (formdata) => {
      dispatch(Actions.addLocation(formdata));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(AddLocation);