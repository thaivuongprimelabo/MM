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
import Loading from '../components/Loading';


import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

type Props = {};
class Month extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      dataInMonth: [],
      year: 0,
      month: 0
    }
  }

  static navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;

    var title = Constants.MONTH + ' ' + params.month + '/' + params.year;

    return {
      title: title,
      headerTintColor: Constants.HEADER_TINI_COLOR,
      headerStyle: {
        backgroundColor: Constants.HEADER_BG_COLOR 
      },
      headerRight: (
        <View></View>
      )
    }
  };

  componentDidMount() {
    console.log('componentDidMount');
    var { navigation  } = this.props;
    this.setState({
      year : navigation.getParam('year'),
      month : navigation.getParam('month')
    })
    this.props.loadDataInMonth(this.state.year, this.state.month);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInMonth } = nextProps;
    if(dataInMonth.length) {
      this.interval = setTimeout(() => {
        this.setState({
          dataInMonth : dataInMonth
        })
      }, 1000);
    }
  }

  onDayItemClick = (day) => {
    var { year, month } = this.state;
    this.props.navigation.navigate('DayScreen', { month: month, year: year, day: day });
  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ () => this.onDayItemClick(item.id) }>
        <ListItem type={1} name={ item.id } budget={ item.budget } used={ item.used } remain={ item.remain } dayOfWeek= { item.dayOfWeek } />
      </TouchableOpacity>
  );

  render() {
    var { dataInMonth } = this.state;

    var render = <Loading />;

    if(dataInMonth.length) {

      render = <FlatList
            contentContainerStyle={styles.list}
            data={dataInMonth}
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
      dataInMonth : state.dataInMonth
    }
};



const mapDispatchToProps = (dispatch, props) => {
    return {
      loadDataInMonth: (year, month) => {
        dispatch(Actions.loadDataInMonth(year, month));
      }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Month);
