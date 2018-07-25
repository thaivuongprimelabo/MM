
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

import * as Constants from '../constants/Constants';
import Utils from '../constants/Utils';
import Swipeout from 'react-native-swipeout';
import TrashButton from './TrashButton';
import EditButton from './EditButton';

export default class ActionItem extends Component<Props> {

  onMoneyIconClick = () => {
    this.props.onMoneyIconClick();
  }

	render() {

    var { action_name, time, location, price, icon } = this.props;
    var buttonMoney;
    var moneyInfo;
    var infoDateTime;
    infoDateTime = <View style={ styles.itemGroupLeft }>
                    <Image style={{width: 50, height: 50}} source={{ uri: icon }} />
                   </View>;


    moneyInfo = <View style={ styles.itemGroupCenter }>
                  <Text style={styles.itemCode}><Image source={ require('../img/action.png') } style={{width: 40, height: 40}} /> { action_name } </Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/clock.png') } style={{width: 40, height: 40}} /> { time } </Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/location.png') } style={{width: 40, height: 40}} /> { location }</Text>
                  <Text style={styles.itemCode}><Image source={ require('../img/price.png') } style={{width: 40, height: 40}} /> { Utils.formatCurrency(price, '.', '.') }</Text>
                </View>;

    const swipeSetting = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {

      },
      onOpen: (secId, rowId, direction) => {

      },
      right: [
        {
          onPress: () => {

          },
          component: <TrashButton />, type: 'delete'
        },
        {
          onPress: () => {
            this.props.openEditModal();
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
    flex: 0.2,
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
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