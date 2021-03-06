
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';
import Swipeout from 'react-native-swipeout';
import TrashButton from './TrashButton';
import EditButton from './EditButton';

class ActionItem extends Component<Props> {

  onMoneyIconClick = () => {
    this.props.onMoneyIconClick();

  }

  componentDidMount() {

  }

  _del() {

    var { dataInDay, index } = this.props;

    var action = dataInDay[index];

    action['index'] = index;

    this.props.onDelAction(action);
  }

	render() {

    var { dataInDay, index } = this.props;
    var action = dataInDay[index];

    var infoDateTime = <View style={ styles.itemGroupLeft }>
                    <Image style={{width: 50, height: 50}} source={{ uri: action.icon }} />
                   </View>;


    var moneyInfo = <View style={ styles.itemGroupCenter }>
                  <Text style={styles.itemCode}><Image source={ require('../img/action.png') } style={{width: 40, height: 40}} /> { action.name } </Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/clock.png') } style={{width: 40, height: 40}} /> { action.created_at } </Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/location.png') } style={{width: 40, height: 40}} /> { action.location }</Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/price.png') } style={{width: 40, height: 40}} /> { Utils.formatCurrency(action.cost, '.', '.') }</Text>
                </View>;

    var status_sync;
    if(action.is_sync === Constants.IS_SYNC) {
      var status_sync = <View style={ styles.itemGroupRight }><Image source={ require('../img/icon-check.png') } /></View>;
    }
    

    const swipeSetting = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {

      },
      onOpen: (secId, rowId, direction) => {

      },
      right: [
        {
          onPress: () => {
            Alert.alert(
              Constants.ALERT_TITLE_INFO,
              Constants.TXT_CONFIRM_DEL,
              [
                {text: Constants.TXT_BUTTON_CANCEL, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: Constants.TXT_BUTTON_OK, onPress: () => { this._del() } },
              ],
              { cancelable: false }
            )
            
          },
          component: <TrashButton />, type: 'delete'
        },
        {
          onPress: () => {
            this.props.openEditModal(index);
          },
          component: <EditButton /> , type: 'edit'
        }
      ],
      rowId: this.props.index,
      sectionId: 1,
      style: {

      }
    }
    
		return (
        
          <View style={{
              flex: 1,
              marginTop:15
            }}>
            <Swipeout {...swipeSetting}>
              <View style={{ flex:1, backgroundColor: '#ffffff', flexDirection: 'row'}}>
                { infoDateTime }
                { moneyInfo }
                { status_sync }
              </View>
            </Swipeout>
          </View>
        
		)
	}
}

const styles = StyleSheet.create({
  itemGroupLeft: {
    flex:0.3, 
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
  },
  itemGroupCenter: {
    flex:0.5, 
    flexDirection: 'column'
  },
  itemGroupRight: {
    flex:0.2,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems:'center'
  },
  infoMoneyItem: {
    width: 44,
    height: 44,
    borderRadius: 44/2,
    justifyContent:'center',
    alignItems: 'center',
    elevation: 2,
    flexDirection: 'column'
  },
  itemMonth: {
    
  },
  itemMonthNumber: {
    fontSize:40,
    color: '#5F6A74',
  },
  itemName: {
    color: '#333333',
    fontWeight: '800',
    padding: 4,
    fontSize: 16
  },
  itemCode: {
    color: '#333333',
    padding: 4,
    fontSize: 16
  }
});

const mapStateToProps = (state) => {
  return {
    dataInDay: state.dataInDay
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    onDelAction: (action) => {
      dispatch(Actions.delAction(action));
    },
    onUpdateSendDataCount: (count) => {
      dispatch(Actions.updateSendDataCount(count));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(ActionItem);