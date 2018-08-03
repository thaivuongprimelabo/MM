
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

export default class ListItem extends Component<Props> {

  onMoneyIconClick = () => {
    var { name } = this.props;
    this.props.onMoneyIconClick(name);
  }

	render() {

    var { type } = this.props;
    var buttonMoney;
    var moneyInfo;
    var infoDateTime;
    if(type === 0) {

      infoDateTime = <View style={ styles.itemGroupLeft }>
                      <Text style={ styles.itemMonth }>{Constants.MONTH}</Text>
                      <Text style={ styles.itemMonthNumber }>{this.props.name}</Text>
                     </View>;


      moneyInfo = <View style={ styles.itemGroupCenter }>
                    <Text style={styles.itemCode}>{ Constants.BUDGET } { Utils.formatCurrency(this.props.budget, '.', '.') }</Text>
                    <Text style={styles.itemCode}>{ Constants.USED } { Utils.formatCurrency(this.props.used, '.', '.') }</Text>
                    <Text style={styles.itemCode}>{ Constants.REMAIN } { Utils.formatCurrency(this.props.remain, '.', '.') }</Text>
                  </View>;

      buttonMoney = <View  style={ styles.itemGroupRight }>
                      <TouchableOpacity style={ styles.infoMoneyItem } onPress={ this.onMoneyIconClick }>
                        <Image source={ require('../img/money.png') }></Image>
                      </TouchableOpacity>
                    </View>;
    } else {

      infoDateTime = <View style={ styles.itemGroupLeft }>
                      <Text style={ styles.itemMonth }>{this.props.dayOfWeek}</Text>
                      <Text style={ styles.itemMonthNumber }>{this.props.name}</Text>
                     </View>;


      moneyInfo = <View style={ styles.itemGroupCenter }>
                    <Text style={styles.itemCode}>{ Constants.BUDGET } { Utils.formatCurrency(this.props.budget, '.', '.') }</Text>
                    <Text style={styles.itemCode}>{ Constants.USED } { Utils.formatCurrency(this.props.used, '.', '.') }</Text>
                    <Text style={styles.itemCode}>{ Constants.REMAIN } { Utils.formatCurrency(this.props.remain, '.', '.') }</Text>
                  </View>;
      
    }
    
		return (
        <View style={{
            flex: 1,
            backgroundColor: '#ffffff',
            marginBottom:15,
            elevation: 3,
            position: 'relative',
            flexDirection: 'row'
          }}>
          { infoDateTime }
          { moneyInfo }
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