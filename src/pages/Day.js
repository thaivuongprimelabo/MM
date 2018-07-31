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

import Modal from 'react-native-modalbox';

import { connect } from 'react-redux';

import ActionItem from '../components/ActionItem';
import Loading from '../components/Loading';
import NoDataFound from '../components/NoDataFound';
import AddModal from '../components/AddModal';
import MenuBottom from '../components/MenuBottom';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';


type Props = {};
class Day extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      dataInDay: [],
      year: 0,
      month: 0,
      count : 0,
      ymd: '',
    }
  }

  static navigationOptions = ({ navigation }) => {

    const { params } = navigation.state;

    var title = Constants.DAY + ' ' + params.day + '/' + params.month + '/' + params.year;
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
    var day = navigation.getParam('day');
    var count = navigation.getParam('count');
    var ymd = Utils.formatDateString({ y: year, m: month, d: day, format: 'YYYYMMDD' });
    this.setState({
      year : year,
      month : month,
      day: day,
      count: count,
      ymd: ymd,
      index: 999
    })
    this.props.loadDataInDay(year, month, day, count);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInDay } = nextProps;
    if(dataInDay.length) {
        this.interval = setTimeout(() => {
          this.setState({
            dataInDay : dataInDay
          });
        }, Constants.DEFAULT_TIMEOUT);
    }
  }

  _openMenuBottom = () => {
    this.refs.showMenuBotton.getWrappedInstance().showActionSheet();
  }

  _onBackButton = () => {
    this.props.navigation.state.params.onBackFromDay();
    this.props.navigation.goBack();
  }

  _openAddModal = () => {
    this.refs.addModal.getWrappedInstance().showAddModal();
  }

  onActionClick = () => {
    this._openAddModal();
  }

  openEditModal = (index) => {
    this.setState({
      index: index
    })
    this._openAddModal();
  }

  _renderItem = ({item, index}) => (

      <ActionItem index={index} openEditModal={ this.openEditModal } />
  );

  render() {
    var { dataInDay, year, month, day, ymd, count, index } = this.state;
    var render = <Loading />;
    var modal = <AddModal ref={'addModal'} parentFlatList={this} ymd={ ymd } index={ index }  screen={ Constants.DAY_SCREEN }  />
    var menuBottom = <MenuBottom ref={'showMenuBotton'} screen={'DayScreen'} navigation={this.props.navigation} openAddModal={ this._openAddModal } />

    // if(!count) {
    //   render = <NoDataFound />;
    // }

    if(dataInDay.length) {
      if(dataInDay[0].id !== 999) {
        render = <FlatList
            contentContainerStyle={styles.list}
            data={dataInDay}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ this._renderItem } />;
      } else {
        render = <NoDataFound />;
      }
      
    }

    return (
      
        <View style={styles.container}>
          { render }
          { modal }
          { menuBottom }
          
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
      dataInDay : state.dataInDay
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
      loadDataInDay: (year, month, day, count) => {
        dispatch(Actions.loadDataInDay(year, month, day, count));
      }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Day);
