
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
  ScrollView
} from 'react-native';

import { compose } from 'redux';
import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

import Modal from 'react-native-modalbox';

import SelectItem from './SelectItem';

var screen = Dimensions.get('window');

class SelectTypeModal extends Component<Props> {

  showSelectTypeModal = () => {
    this.refs.mySelectTypeModal.open();
  }

  constructor(props) {
    super(props);

    this.state = {
      keyword : '',
      types : []
    }
  }

  componentDidMount() {

  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    var { types } = nextProps;
   
    if(types.length > 0 && this.state.types.length === 0) {
      this.setState({
        types : types
      });
    }
  }

  _onSelectItem = (item) => {
    this.props.onSelectItem(item);
    this.refs.mySelectTypeModal.close();
  }

  _onChangeText = (text) => {
    this.setState({ keyword: text });
    this.props.onAddTypes(this.state.types);
    this.props.onSearch(text);
  }

	render() {

    var { types } = this.props;

    var typeItem = types.map((type, index) => {
      return <SelectItem key={ index } item = {type} onSelectItem={ this._onSelectItem }  />
    });

		return (
      <Modal ref={'mySelectTypeModal'}
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
          value={ this.state.name }>{ Constants.TXT_SELECT_TYPE }</Text>

        <TextInput 
            style={[{ height:40, marginBottom: 10,  }, styles.borderInput]}
            underlineColorAndroid={'transparent'}
            onChangeText={(text) => this._onChangeText(text) }
            placeholder={ Constants.TXT_KEYWORD }
            value={ this.state.keyword } />

        <ScrollView contentContainerStyle={{ borderWidth:1, borderColor: '#dedede' }} >
          { typeItem } 
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
    types : state.types
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onSelectItem : (item) => {
      dispatch(Actions.selectType(item));
    },
    onSearch: (keyword) => {
      dispatch(Actions.searchType(keyword));
    },
    onAddTypes: (list) => {
      dispatch(Actions.addTypes(list));
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(SelectTypeModal);