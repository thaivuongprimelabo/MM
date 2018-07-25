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
      count : 0
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
      headerRight: (
        <TouchableOpacity onPress={ navigation.getParam('openMenuBottom') }  style={{ marginRight:10 }}>
            <Image source={require('../img/icon-menu.png')}  />
        </TouchableOpacity >
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ openMenuBottom: this._openMenuBottom });
    var { navigation  } = this.props;

    var year = navigation.getParam('year');
    var month = navigation.getParam('month');
    var day = navigation.getParam('day');
    var count = navigation.getParam('count');
    this.setState({
      year : year,
      month : month,
      day: day,
      count: count,
    })
    this.props.loadDataInDay(year, month, day, count);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInDay } = nextProps;
    if(dataInDay.length) {
      if(dataInDay[0].id != 99) {
        this.interval = setTimeout(() => {
          this.setState({
            dataInDay : dataInDay
          });
        }, Constants.DEFAULT_TIMEOUT);
      } else {
        console.log('componentWillReceiveProps');
        this.setState({
          nodatafound : true
        });
      }
      
    }
  }

  _openMenuBottom = () => {
    this.refs.showMenuBotton.showActionSheet();
  }

  _openAddModal = () => {
    this.refs.addModal.getWrappedInstance().showAddModal();
  }

  onActionClick = () => {
    this._openAddModal();
  }

  openEditModal = () => {
    this._openAddModal();
  }

  _renderItem = ({item, index}) => (

      <ActionItem index={index} icon={ item.icon } action_id={ item.id } action_name={ item.name } time={ item.time } location={ item.location } price={ item.price } openEditModal={ this.openEditModal } />
  );

  addAction = (action) => {
    console.log(action);
  }

  render() {
    var { dataInDay, count, year, month, day } = this.state;

    var render = <Loading />;
    var modal = <AddModal ref={'addModal'} parentFlatList={this} addAction={ this.addAction } ymd={ ymd } />
    var menuBottom = <MenuBottom ref={'showMenuBotton'} screen={'DayScreen'} navigation={this.props.navigation} openAddModal={ this._openAddModal } />

    if(dataInDay.length) {
      render = <FlatList
            contentContainerStyle={styles.list}
            data={dataInDay}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ this._renderItem } />;
    }

    if(!count) {
      render = <NoDataFound />
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
