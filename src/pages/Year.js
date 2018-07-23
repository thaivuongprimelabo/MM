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
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';

import Storage from 'react-native-storage';

import ListItem from '../components/ListItem';
import Loading from '../components/Loading';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';

import Utils from '../constants/Utils';

type Props = {};

class Year extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      dataInYear : [],
      
    }
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    this.props.loadDataInYear('2018');
  }

  componentWillReceiveProps(nextProps) {
    var { dataInYear } = nextProps;
    if(dataInYear.length) {
      this.interval = setTimeout(() => {
        this.setState({
          dataInYear : dataInYear
        })
      }, 1000);
    }
  }

  static navigationOptions = ({ navigation }) => {

    var date = new Date();
    var fullYear = date.getFullYear();

    return {
      title: Constants.YEAR + ' ' + fullYear,
      headerTintColor: Constants.HEADER_TINI_COLOR,
      headerLeft: null,
      headerStyle: {
        backgroundColor: Constants.HEADER_BG_COLOR 
      },
    }
      
  };

  onMonthItemClick = (month) => {
    var currentYear = Utils.getCurrentYear();
    this.props.navigation.navigate('MonthScreen', { month: month, year: currentYear });
  }

  onMoneyIconClick = () => {

  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ () => this.onMonthItemClick(item.id) }>
        <ListItem type={0} name={ item.id } budget={ item.budget } used={ item.used } remain={ item.remain } onMoneyIconClick={ this.onMoneyIconClick }  />
      </TouchableOpacity>
  );

  render() {
    
    var { dataInYear } = this.state;

    var render = <Loading />;

    if(dataInYear.length) {

      render = <FlatList
                contentContainerStyle={styles.list}
                data={ dataInYear }
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ this._renderItem } />;
    }

    return (
      <View style={styles.container}>
        { render }
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
      dataInYear : state.dataInYear
    };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadDataInYear : (year) => {
      dispatch(Actions.loadDataInYear(year))
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Year);