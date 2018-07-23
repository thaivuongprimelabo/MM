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
import ButtonHeaderRight from '../components/ButtonHeaderRight';

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
      nodatafound : false
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
        <TouchableOpacity  onPress={ navigation.getParam('openAddModal') } style={{ marginRight:10 }}>
            <Image source={require('../img/icon-add.png')}  />
        </TouchableOpacity >
      )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ openAddModal: this._openAddModal });
    var { navigation  } = this.props;
    this.setState({
      year : navigation.getParam('year'),
      month : navigation.getParam('month'),
      day: navigation.getParam('day')
    })
    this.props.loadDataInDay(this.state.year, this.state.month, this.state.day);
  }

  componentWillReceiveProps(nextProps) {
    var { dataInDay } = nextProps;
    if(dataInDay.length) {
      if(dataInDay[0].id != 99) {
        this.interval = setTimeout(() => {
          this.setState({
            dataInDay : dataInDay
          });
        }, 1000);
      } else {
        console.log('componentWillReceiveProps');
        this.setState({
          nodatafound : true
        });
      }
      
    }
  }

  _openAddModal = () => {
    this.refs.addModal.showAddModal();
  }

  onActionClick = () => {
    this.refs.addModal.showAddModal();
  }

  openEditModal = () => {
    this._openAddModal();
  }

  _renderItem = ({item, index}) => (
      <ActionItem index={index} action_id={ item.id } action_name={ item.name } time={ item.time } location={ item.location } price={ item.price } openEditModal={ this.openEditModal } />
  );

  addAction = (action) => {
    console.log(action);
  }

  render() {
    var { dataInDay, nodatafound } = this.state;

    var render = <Loading />;
    var modal = <AddModal ref={'addModal'} parentFlatList={this} addAction={ this.addAction } />

    if(dataInDay.length) {
      render = <FlatList
            contentContainerStyle={styles.list}
            data={dataInDay}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            renderItem={ this._renderItem } />;
    }

    if(nodatafound) {
      render = <NoDataFound />
    }

    return (
      
        <View style={styles.container}>
          { render }
          { modal }
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
      loadDataInDay: (year, month, day) => {
        dispatch(Actions.loadDataInDay(year, month, day));
      }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Day);
