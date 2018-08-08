
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
  FlatList,
  ScrollView,
} from 'react-native';

import { compose } from 'redux';
import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

import Modal from 'react-native-modalbox';

import SelectItem from './SelectItem';

var screen = Dimensions.get('window');

class SelectLocationModal extends Component<Props> {

  showSelectLocationModal = () => {
    this.refs.mySelectLocationModal.open();
  }

  constructor(props) {
    super(props);

    this.state = {
      keyword : '',
      locations : []
    }
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    var { locations } = nextProps;
   
    if(locations.length > 0 && this.state.locations.length === 0) {
      this.setState({
        locations : locations
      });
    }
  }

  _onSelectItem = (item) => {
    this.props.onSelectItem(item);
    this.refs.mySelectLocationModal.close();
  }

  _onChangeText = (text) => {
    this.setState({ keyword: text });
    this.props.onAddLocations(this.state.locations);
    this.props.onSearch(text);
  }

	render() {

    var { locations } = this.props;

    var locationItem = locations.map((location, index) => {
      return <SelectItem key={ index } item = {location} onSelectItem={ this._onSelectItem }  />
    });

		return (
      <Modal ref={'mySelectLocationModal'}
             style={{ 
                justifyContent: 'flex-start', 
                borderRadius:5, 
                shadowRadius: 10, 
                width: screen.width - 30, 
                height: 400, 
                paddingLeft:30, 
                paddingRight:30,
                paddingTop:30,
                paddingBottom: 30  }} 
             position='center'
             backdrop={true}
             swipeArea={50}
             onOpened={() => {
                
             }}
             onClosed={() => {
             }}
      >
        <Text 
          style={{ fontSize:16, fontWeight: 'bold', textAlign: 'center' }}
          value={ this.state.name }>{ Constants.TXT_SELECT_LOCATION }</Text>

        <TextInput 
            style={[{ height:40, marginBottom: 10,  }, styles.borderInput]}
            underlineColorAndroid={'transparent'}
            onChangeText={(text) => this._onChangeText(text) }
            placeholder={ Constants.TXT_KEYWORD }
            value={ this.state.keyword } />

        <ScrollView contentContainerStyle={{ borderWidth:1, borderColor: '#dedede' }} >
          { locationItem } 
        </ScrollView>

      </Modal>
		)
	}
}

const styles = StyleSheet.create({
  list : {
    borderWidth:1,
    borderColor:'#dedede'
  },
  borderInput: {
    paddingBottom:-5,
    borderBottomWidth:1, 
    borderBottomColor: '#dedede'
  }
});

const mapStateToProps = (state) => {
  return {
    locations : state.locations
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSelectItem : (item) => {
      dispatch(Actions.selectLocation(item));
    },
    onSearch: (keyword) => {
      dispatch(Actions.searchLocation(keyword));
    },
    onAddLocations: (list) => {
      dispatch(Actions.addLocations(list));
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(SelectLocationModal);