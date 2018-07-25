
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

class AddModal extends Component<Props> {

  showAddModal = () => {
    this.refs.myModal.open();
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      price: '',
      type: '0',
      location: '',
      ymd: ''
    };
  }

  addAction = () => {
    var error = '';
    if(this.state.name === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,['Tên hoạt động']) + "\n";
    }

    if(this.state.type === '0') {
      error += Utils.replactParamError(Constants.ERR_SELECT,['Loại hoạt động']) + "\n";
    }

    var pattern = /^\d+$/;
    if(!pattern.test(this.state.price)) {
        error += Utils.replactParamError(Constants.ERR_EMAIL,[]) + "\n"; 
    }

    if(error === '') {
      this.props.addAction(this.state);
      this.refs.myModal.close();
    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
  }

	render() {

    var { types_locations } = this.props;

    var typeItem = types_locations.types.map((type, index) => {
      return <Picker.Item key={index} label={ type.name } value={ type.id } />
    });

    var locationItem = types_locations.locations.map((location, index) => {
      return <Picker.Item key={index} label={ location.name } value={ location.id } />
    });


		return (
      <Modal ref={'myModal'}
             style={{ justifyContent: 'center', borderRadius:5, shadowRadius: 10, width: screen.width - 30, height: 400  }} 
             position='center'
             backdrop={true}
             onClosed={() => {
             }}
      >
        <Text style={{ fontSize:16, fontWeight: 'bold', textAlign: 'center' }}>{ Constants.TXT_TITLE_ACTION_MODAL }</Text>
        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ name: text })}
            placeholder={ Constants.TXT_NAME }
            value={ this.state.name } />

        <Picker
          selectedValue={this.state.type}
          style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 10, marginBottom: 20 }}
          onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
          <Picker.Item label={ Constants.TXT_SELECT_TYPE } value="0" />
          { typeItem }
        </Picker>

        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 10, marginBottom: 20,   }}
            onChangeText={(text) => this.setState({ price: text })}
            placeholder={ Constants.TXT_PRICE }
            value={ this.state.price } />

        <Picker
          selectedValue={this.state.location}
          style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 10, marginBottom: 20 }}
          onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>
          <Picker.Item label={ Constants.TXT_SELECT_LOCATION } value="0" />
          { locationItem }
        </Picker>

        <TouchableOpacity onPress={ this.addAction } style={{ padding:0, marginLeft: 70, marginRight: 70, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color:'#f0f0f0' }}>{ Constants.TXT_BUTTON_ADD }</Text>
        </TouchableOpacity>
      </Modal>
		)
	}
}

const mapStateToProps = (state) => {
  return {
    types_locations: state.types_locations
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onAddAction: (formdata) => {
      dispatch(Actions.onAddAction(formdata));
    }
  }
}

export default connect(mapStateToProps,null, null, { withRef: true})(AddModal);