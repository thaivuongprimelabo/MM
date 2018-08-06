
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

class AddModal extends Component<Props> {

  showAddModal = () => {
    this.refs.myModal.open();
  }

  constructor(props) {
    super(props);

    var y = Utils.getCurrentDate('YYYY');
    var m = Utils.getCurrentDate('MM');
    var d = Utils.getCurrentDate('DD');

    var h = Utils.getCurrentDate('HH');
    var i = Utils.getCurrentDate('II');
    var s = Utils.getCurrentDate('SS');

    this.state = {
      id: '',
      name: '',
      price: '',
      type: '0',
      location: '0',
      ymd: '',
      y: y,
      m: m,
      d: d,
      h: h,
      i: i,
      s: s
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.props.onLoadDataType();
    this.props.onLoadDataLocation();
  }

  componentWillReceiveProps(nextProps) {

  }

  _addAction = () => {
    var formdata = this.state;
    var error = '';
    if(formdata['name'] === '') {
      error += Utils.replactParamError(Constants.ERR_REQUIRED,[Constants.TXT_NAME]) + "\n";
    }

    if(formdata['type'] === '0') {
      error += Utils.replactParamError(Constants.ERR_SELECT,[Constants.TXT_TYPE_NAME]) + "\n";
    }

    var pattern = /^\d+$/;
    if(!pattern.test(formdata['price'])) {
        error += Utils.replactParamError(Constants.ERR_EMAIL,[]) + "\n"; 
    }

    if(!pattern.test(formdata['y']) || 
       !pattern.test(formdata['m']) || 
       !pattern.test(formdata['d']) || 
       !pattern.test(formdata['h']) || 
       !pattern.test(formdata['i']) || 
       !pattern.test(formdata['s']) ) {
        error += Utils.replactParamError(Constants.ERR_LIMIT,[]) + "\n"; 
    }

    if(error === '') {

      formdata['m'] = Utils.formatZero(formdata['m']);
      formdata['d'] = Utils.formatZero(formdata['d']);
      formdata['h'] = Utils.formatZero(formdata['h']);
      formdata['i'] = Utils.formatZero(formdata['i']);
      formdata['s'] = Utils.formatZero(formdata['s']);

      formdata['created_at'] = Utils.formatDateTimeString(formdata);
      formdata['ymd'] = Utils.formatDateString(formdata);
      formdata['types'] = this.props.types;
      formdata['locations'] = this.props.locations;
      formdata['screen'] = this.props.screen;

      var { index } = this.props;

      if(index === 999) {
        this.props.onAddAction(formdata);
      } else {
        formdata['index'] = index;
        this.props.onEditAction(formdata);
      }

      this._resetForm();

      this.refs.myModal.close();
    } else {
      Alert.alert(Constants.ALERT_TITLE_INFO, error);
    }
  }

  _resetForm = () => {

      var y = Utils.getCurrentDate('YYYY');
      var m = Utils.getCurrentDate('MM');
      var d = Utils.getCurrentDate('DD');

      var h = Utils.getCurrentDate('HH');
      var i = Utils.getCurrentDate('II');
      var s = Utils.getCurrentDate('SS');

      this.setState({
        id: '',
        name: '',
        price: '',
        type: '0',
        location: '0',
        ymd: '',
        y: y,
        m: m,
        d: d,
        h: h,
        i: i,
        s: s
      });
  }

  _addLocation = () => {
    this.props.openLocationModal();
  }

  _addType = () => {
    this.props.openTypeModal();
  }


  render() {

    var { index, locations, types } = this.props;

    var button_txt = Constants.TXT_BUTTON_UPDATE;
    if(index === 999 || index === 998) {
      button_txt = Constants.TXT_BUTTON_ADD;
    }

    var typeItem = types.map((type, index) => {
      return <Picker.Item key={index} label={ type.name } value={ type.value } />
    });

    var locationItem = locations.map((location, index) => {
      return <Picker.Item key={index} label={ location.name } value={ location.id } />
    });


    return (
      <Modal ref={'myModal'}
             style={{ justifyContent: 'center', borderRadius:5, shadowRadius: 10, width: screen.width - 30, height: 450  }} 
             position='center'
             backdrop={true}
             onOpened={() => {
              console.log('onOpened');
              var { index, dataInDay, ymd } = this.props;

              if(index !== 999) {

                if(dataInDay.length > 0 && this.state.id === '') {
                  var action = dataInDay[index];
                  var dayString = Utils.extractDayString(action.created_at);
                  
                  this.setState({
                    id: action.id,
                    name: action.name,
                    price: action.cost,
                    type: action.type_id,
                    location: action.location_id,
                    y: dayString.y,
                    m: dayString.m,
                    d: dayString.d,
                    h: dayString.h,
                    i: dayString.i,
                    s: dayString.s
                  })
                }

              } else {
                if(ymd !== '' && this.state.name === '') {
                  var dayString = Utils.subStringDay(ymd);
                  this.setState({
                    y: dayString.y,
                    m: dayString.m,
                    d: dayString.d,
                    h: dayString.h,
                    i: dayString.i,
                    s: dayString.s
                  })
                }
              }

              
             }}
             onClosed={() => {
                this._resetForm();
             }}
      >
        <Text style={{ fontSize:16, fontWeight: 'bold', textAlign: 'center' }}>{ Constants.TXT_TITLE_ACTION_MODAL }</Text>
        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ name: text })}
            placeholder={ Constants.TXT_NAME }
            value={ this.state.name } />

        <View style={{ flexDirection : 'row', justifyContent: 'center', alignItems: 'center',  marginBottom: 20 }}>
          <Picker
            selectedValue={this.state.type}
            style={{ width:220, height:40}}
            onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
            <Picker.Item label={ Constants.TXT_SELECT_TYPE } value="0" />
            { typeItem }
          </Picker>
          <TouchableOpacity onPress={ this._addType } style={{ width:60, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color:'#f0f0f0' }}>Thêm</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection : 'row', paddingLeft: 10, justifyContent: 'center', alignItems: 'center',  marginBottom: 20 }}>
          
          <TextInput 
              style={{ flex:0.1, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ d: text })}
              placeholder={ 'dd' }
              value={ this.state.d } />

          <View style={{ flex:0.05, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>/</Text>
          </View>

          <TextInput 
              style={{ flex:0.1, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ m: text })}
              placeholder={ 'mm' }
              value={ this.state.m } />

          <View style={{ flex:0.05, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>/</Text>
          </View>

          <TextInput 
              style={{ flex:0.15, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ y: text })}
              placeholder={ 'yyyy' }
              value={ this.state.y } />

          <TextInput 
              style={{ flex:0.1, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ h: text })}
              placeholder={ 'hh' }
              value={ this.state.h } />

          <View style={{ flex:0.05, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>:</Text>
          </View>

          <TextInput 
              style={{ flex:0.1, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ i: text })}
              placeholder={ 'ii' }
              value={ this.state.i } />

          <View style={{ flex:0.05, flexDirection:'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>:</Text>
          </View>

          <TextInput 
              style={{ flex:0.1, height:40, flexDirection:'column' }}
              onChangeText={(text) => this.setState({ s: text })}
              placeholder={ 'ss' }
              value={ this.state.s } />
        </View>

        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30, marginBottom: 20,   }}
            onChangeText={(text) => this.setState({ price: text })}
            placeholder={ Constants.TXT_PRICE }
            value={ this.state.price } />

      <View style={{ flexDirection : 'row', justifyContent: 'center', alignItems: 'center',  marginBottom: 20 }}>
        <Picker
          selectedValue={this.state.location}
          style={{ width:220, height:40}}
          onValueChange={(itemValue, itemIndex) => this.setState({location: itemValue})}>
          <Picker.Item label={ Constants.TXT_SELECT_LOCATION } value="0" />
          { locationItem }
        </Picker>

        <TouchableOpacity onPress={ this._addLocation } style={{ width:60, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color:'#f0f0f0' }}>Thêm</Text>
        </TouchableOpacity>
      </View>

        <TouchableOpacity onPress={ this._addAction } style={{ padding:0, marginLeft: 70, marginRight: 70, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color:'#f0f0f0' }}>{ button_txt }</Text>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    types: state.types,
    dataInDay: state.dataInDay,
    sync_send_data: state.sync_send_data,
    locations : state.locations
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onAddAction: (formdata) => {
      dispatch(Actions.addAction(formdata));
    },
    onEditAction: (formdata) => {
      dispatch(Actions.editAction(formdata));
    },
    onLoadDataLocation: () => {
      dispatch(Actions.loadDataLocation());
    },
    onLoadDataType: () => {
      dispatch(Actions.loadDataType());
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(AddModal);