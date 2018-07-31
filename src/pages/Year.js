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
  AsyncStorage,
  Image
} from 'react-native';

import { connect } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';

import ListItem from '../components/ListItem';
import Loading from '../components/Loading';
import MenuBottom from '../components/MenuBottom';
import AddModal from '../components/AddModal';
import AddLocation from '../components/AddLocation';
import AddType from '../components/AddType';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';

import Utils from '../constants/Utils';

type Props = {};

class Year extends Component<Props> {

  constructor(props) {
    super(props);

    var date = new Date();
    var year = date.getFullYear();

    this.state = {
      dataInYear : [],
      year: year,
      user_id: 0,
    }
  }

  componentWillMount() {
    
  }

  componentDidMount() {

    var { navigation  } = this.props;

    this.props.navigation.setParams({ openMenuBottom: this._openMenuBottom });

    

    this.props.loadDataInYear(this.state.year);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInYear, sync_send_data } = nextProps;
    if(dataInYear.length) {
      this.interval = setTimeout(() => {
        this.setState({
          dataInYear : dataInYear
        })
      }, Constants.DEFAULT_TIMEOUT);
    }

    if(sync_send_data.sync_status === Constants.SYNC_SUCCESS ) {
      this.setState({
        dataInYear : dataInYear
      })
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
      headerRight: (
        <TouchableOpacity onPress={ navigation.getParam('openMenuBottom') }  style={{ marginRight:10 }}>
            <Image source={require('../img/icon-menu.png')}  />
        </TouchableOpacity >
      )
    }
      
  };

  onMonthItemClick = (month, budget) => {
    this.props.navigation.navigate(Constants.MONTH_SCREEN, { month: month, year: this.state.year, budget: budget, onBackFromMonth: this._onBackFromMonth });
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

  _openMenuBottom = () => {
    this.refs.showMenuBotton.getWrappedInstance().showActionSheet();
  }

  _onBackFromMonth = () => {
    this.props.loadDataInYear(this.state.year);
  }

  onMoneyIconClick = () => {

  }

  _renderItem = ({item}) => (
      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ () => this.onMonthItemClick(item.id, item.budget) }>
        <ListItem type={0} name={ item.id } budget={ item.budget } used={ item.used } remain={ item.remain } onMoneyIconClick={ this.onMoneyIconClick }  />
      </TouchableOpacity>
  );

  render() {
    
    var { dataInYear } = this.state;
    var { navigation, sync_send_data } = this.props;

    var type_cnt = navigation.getParam('type_cnt');
    var location_cnt = navigation.getParam('location_cnt');

    var modal = <AddModal ref={'addModal'} parentFlatList={this} ymd={ '' } index= { 999 } screen= { Constants.YEAR_SCREEN } location_cnt={ location_cnt } type_cnt={ type_cnt } />
    var typeModal = <AddType ref={'addType'} parentFlatList={this} ymd={ '' } index= { 999 } screen= { Constants.YEAR_SCREEN } />
    var locationModal = <AddLocation ref={'addLocation'} parentFlatList={this} ymd={ '' } index= { 999 } screen= { Constants.YEAR_SCREEN } />

    var user_id = navigation.getParam('user_id');
    

    var render = <Loading />;
    var menuBottom = <MenuBottom ref={'showMenuBotton'} navigation={this.props.navigation} user_id={ user_id } openAddModal={ this._openAddModal } openTypeModal={ this._openAddTypeModal } openLocationModal={ this._openAddLocationModal } />

    if(dataInYear.length) {

      render = <FlatList
                contentContainerStyle={styles.list}
                data={ dataInYear }
                extraData={this.state}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ this._renderItem } />;
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
      dataInYear : state.dataInYear,
      sync_send_data : state.sync_send_data
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