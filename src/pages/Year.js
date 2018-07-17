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
import * as Actions from '../actions/index';

import Utils from '../constants/Utils';

type Props = {};



class Year extends Component<Props> {

  constructor(props) {
    super(props);

    // var date = new Date();
    // var year = date.getFullYear();
    // var months = [
    //         { ym: year + '01', name: '1', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '02', name: '2', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '03', name: '3',  budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '04', name: '4', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '05', name: '5', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '06', name: '6', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '07', name: '7', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '08', name: '8', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '09', name: '9', budget: '0', 'used': '0', remain: '0'},  
    //         { ym: year + '10', name: '10', budget: '0', 'used': '0', remain: '0'},
    //         { ym: year + '11', name: '11', budget: '0', 'used': '0', remain: '0'}, 
    //         { ym: year + '12', name: '12', budget: '0', 'used': '0', remain: '0'}
    //       ];

    this.state = {
      monthsInYear: []
    }
  }

  componentWillMount() {
    var monthsInYear = this.props.initData();
    console.log(monthsInYear);
  }

  static navigationOptions = {
      title: 'Năm 2018',
      headerTintColor: Constants.HEADER_TINI_COLOR,
      headerLeft: null,
      headerStyle: {
        backgroundColor: Constants.HEADER_BG_COLOR 
      },
  };

  onMonthItemClick = (ym) => {
    this.props.navigation.navigate('MonthScreen', { ym: ym });
  }

  onMoneyIconClick = () => {

  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ () => this.onMonthItemClick(item.ym) }>
        <ListItem type={0} name={ item.name } budget={ item.budget } used={ item.used } remain={ item.remain } onMoneyIconClick={ this.onMoneyIconClick }  />
      </TouchableOpacity>
  );

  render() {
    var { monthsInYear }  = this.state;

    return (
      <View style={styles.container}>
        <FlatList
            contentContainerStyle={styles.list}
            data={ monthsInYear }
            extraData={this.state}
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
    return {};
};



const mapDispatchToProps = (dispatch, props) => {
    return {
      initData: (year) => {
        dispatch(Actions.initData(year));
      }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Year);