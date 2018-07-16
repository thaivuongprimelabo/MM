
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

export default class MonthItem extends Component<Props> {
	render() {
		return (
      <View style={{
          flex: 1,
          minWidth: 340,
          maxWidth: 340,
          height: 120,
          maxHeight:120,
          backgroundColor: '#7D8A96',
          marginBottom: 7,
          paddingLeft:5,
          paddingTop:5
        }}>
          <Text style={styles.itemName}>{Constants.MONTH} {this.props.name}</Text>
          <Text style={styles.itemCode}>Định mức: { Utils.formatCurrency(this.props.budget, '.', '.') }</Text>
          <Text style={styles.itemCode}>Đã sử dụng: { Utils.formatCurrency(this.props.used, '.', '.') }</Text>
          <Text style={styles.itemCode}>Còn lại: { Utils.formatCurrency(this.props.remain, '.', '.') }</Text>
      </View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
  itemName: {
    color: '#ffffff',
    marginBottom: 4,
    fontWeight: '800'
  },
  itemCode: {
    color: '#ffffff',
    marginBottom: 4
  }
});