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
  Image
} from 'react-native';

import { connect } from 'react-redux';

import ListItem from '../components/ListItem';
import Loading from '../components/Loading';
import MenuBottom from '../components/MenuBottom';


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
      month: 0,
      budget: 0
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
      headerLeft: (
        <TouchableOpacity onPress={ navigation.getParam('onBackButton') }  style={{ marginLeft:10 }}>
            <Image source={require('../img/back-button.png')}  />
        </TouchableOpacity >
      ),
      headerRight: (
        <TouchableOpacity onPress={ navigation.getParam('openMenuBottom') }  style={{ marginRight:10 }}>
            <Image source={require('../img/icon-menu.png')}  />
        </TouchableOpacity >
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ openMenuBottom: this._openMenuBottom });
    this.props.navigation.setParams({ onBackButton: this._onBackButton });
    var { navigation  } = this.props;
    var year = navigation.getParam('year');
    var month = navigation.getParam('month');
    var budget = navigation.getParam('budget');
    this.setState({
      year : year,
      month : month,
      budget: budget
    });
    
    this.props.loadDataInMonth(year, month, budget);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInMonth } = nextProps;
    if(dataInMonth.length) {
      this.interval = setTimeout(() => {
        this.setState({
          dataInMonth : dataInMonth
        })
      }, Constants.DEFAULT_TIMEOUT);
    }
  }

  _openMenuBottom = () => {
    this.refs.showMenuBotton.getWrappedInstance().showActionSheet();
  }

  _onBackButton = () => {
    this.props.navigation.state.params.onBackFromMonth();
    this.props.navigation.goBack();
  }

  onDayItemClick = (day, count) => {
    var { year, month } = this.state;
    this.props.navigation.navigate(Constants.DAY_SCREEN, { month: month, year: year, day: day, count: count, onBackFromDay: this._onBackFromDay });
  }

  _onBackFromDay = () => {
    var { year, month, budget } = this.state;
    this.props.loadDataInMonth(year, month, budget);
  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ () => this.onDayItemClick(item.id, item.count) }>
        <ListItem type={1} name={ item.id } budget={ item.budget } used={ item.used } remain={ item.remain } dayOfWeek= { item.dayOfWeek } />
      </TouchableOpacity>
  );

  render() {
    var { dataInMonth, year, month } = this.state;
    
    var render = <Loading />;
    var menuBottom = <MenuBottom ref={'showMenuBotton'} navigation={this.props.navigation} />

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
        { menuBottom }
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
      types : state.types
    }
};



const mapDispatchToProps = (dispatch, props) => {
    return {
      loadDataInMonth: (year, month, budget) => {
        dispatch(Actions.loadDataInMonth(year, month, budget));
      }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Month);
