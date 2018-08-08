
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';
import Swipeout from 'react-native-swipeout';
import TrashButton from './TrashButton';
import EditButton from './EditButton';

class SelectItem extends Component<Props> {

  componentDidMount() {

  }

  _onSelectItem = () => {
    this.props.onSelectItem(this.props.item);
  }

	render() {
    var { item } = this.props;

		return (
        
          <TouchableOpacity onPress={ this._onSelectItem } style={{
              flex: 1,
            }}>
            <Text style={ styles.item }>{ item.name }</Text>
          </TouchableOpacity>
        
		)
	}
}

const styles = StyleSheet.create({
  item : {
    padding:10,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede'
  }
});

export default SelectItem;