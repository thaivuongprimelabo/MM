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
import AddLocation from '../components/AddLocation';
import AddType from '../components/AddType';
import MenuBottom from '../components/MenuBottom';
import SelectTypeModal from '../components/SelectTypeModal';
import SelectLocationModal from '../components/SelectLocationModal';

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
    var ymd = Utils.formatDateString({ y: year, m: month, d: day, format: 'YYYYMMDD' });

    this.setState({
      year : year,
      month : month,
      day: day,
      ymd: ymd,
      index: 999
    })
    this.props.loadDataInDay(year, month, day);
  }

  componentWillReceiveProps(nextProps) {
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

  _openAddTypeModal = () => {
    this.refs.addType.getWrappedInstance().showAddTypeModal();
  }

  _openAddLocationModal = () => {
    this.refs.addLocation.getWrappedInstance().showAddLocationModal();
  }

  _openSelectTypeModal = () => {
    this.refs.openSelectType.getWrappedInstance().showSelectTypeModal();
  }

  _openSelectLocationModal = () => {
    this.refs.openSelectLocation.getWrappedInstance().showSelectLocationModal();
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
    var { year, month, day, ymd, index } = this.state;
    var { sync_send_data, dataInDay, loading } = this.props;
    var render;
    var modal = <AddModal ref={'addModal'} parentFlatList={this} ymd={ ymd } index={ index }  screen={ Constants.DAY_SCREEN } openTypeModal={ this._openAddTypeModal } openLocationModal={ this._openAddLocationModal } openSelectTypeModal={ this._openSelectTypeModal } openSelectLocationModal={ this._openSelectLocationModal }  />
    var typeModal = <AddType ref={'addType'} parentFlatList={this} ymd={ '' } index= { 999 } screen= { Constants.YEAR_SCREEN } />
    var locationModal = <AddLocation ref={'addLocation'} parentFlatList={this} ymd={ '' } index= { 999 } screen= { Constants.YEAR_SCREEN } />
    var selectTypeModal = <SelectTypeModal ref={'openSelectType'} parentFlatList={this} />;
    var selectLocationModal = <SelectLocationModal ref={'openSelectLocation'} parentFlatList={this} />;
    var menuBottom = <MenuBottom ref={'showMenuBotton'} screen={'DayScreen'} navigation={this.props.navigation} screen={ Constants.DAY_SCREEN } year= { this.state.year} month= { this.state.month } day={ this.state.day }  openAddModal={ this._openAddModal } openTypeModal={ this._openAddTypeModal } openLocationModal={ this._openAddLocationModal } />

    if(loading.status === Constants.LOADING_WAITING) {

      render = <Loading />;

    } else {

      if(dataInDay.length) {
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

    if(sync_send_data.sync_status === Constants.SYNC_WAITING) {
      render = <Loading sync={Constants.SYNC_WAITING} />;
    }

    return (
      
        <View style={styles.container}>
          { render }
          { modal }
          { typeModal }
          { locationModal }
          { selectTypeModal }
          { selectLocationModal }
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
      dataInDay : state.dataInDay,
      types: state.types,
      locations: state.locations,
      sync_send_data : state.sync_send_data,
      loading : state.loading
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
      loadDataInDay: (year, month, day) => {
        dispatch(Actions.loadDataInDay(year, month, day));
      },
      onUpdateLoadingStatus: (status) => {
        dispatch(Actions.updateLoadingStatus(status));
      }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Day);
