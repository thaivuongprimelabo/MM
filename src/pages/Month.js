/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';

import ListItem from '../components/ListItem';

import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';

type Props = {};
class Month extends Component<Props> {

  constructor(props) {
    super(props);

    // var date = new Date();
    // var year = date.getFullYear();
    // var months = [
    //         { ym: year + '01', name: '1', code: '#1abc9c', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '02', name: '2', code: '#2ecc71', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '03', name: '3', code: '#3498db', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '04', name: '4', code: '#9b59b6', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '05', name: '5', code: '#34495e', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '06', name: '6', code: '#16a085', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '07', name: '7', code: '#27ae60', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '08', name: '8', code: '#2980b9', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '09', name: '9', code: '#8e44ad', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '10', name: '10', code: '#2c3e50', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '11', name: '11', code: '#f1c40f', budget: '0', 'used': '0', remain: '0'}, 
    //         { ym: year + '12', name: '12', code: '#e67e22', budget: '0', 'used': '0', remain: '0'}
    //       ];

    // this.state = {
    //   year: year,
    //   days: []
    // }
  }

  static navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;

    var { year } = this.props;

    return {
      title: params.day + year,
      headerTintColor: Constants.HEADER_TINI_COLOR,
      headerStyle: {
        backgroundColor: Constants.HEADER_BG_COLOR 
      },
    }
  };

  onDayItemClick = () => {

  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ this.onDayItemClick }>
        <ListItem type={1} name={ item.name } budget={ item.budget } used={ item.used } remain={ item.remain } />
      </TouchableOpacity>
  );

  render() {
    var { dataInMonth } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
            contentContainerStyle={styles.list}
            data={dataInMonth}
            extraData={this.props}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ this._renderItem } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:7
  },
  list: {
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


const mapStateToProps = (state) => {
    return {
      dataInMonth : state.dataInMonth,
      year : year
    }
};



const mapDispatchToProps = (dispatch, props) => {
    return {};
}


export default connect(mapStateToProps, mapDispatchToProps)(Month);
