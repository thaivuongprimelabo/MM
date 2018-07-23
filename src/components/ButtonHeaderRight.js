
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class ButtonHeaderRight extends Component<Props> {
	render() {

    var { screen } = this.props;
       
     var buttonRight = <TouchableOpacity  onPress={ navigation.getParam('openAddModal') }>
                        <Image source={require('../img/icon-add.png')}  />
                        </TouchableOpacity>;

     if(screen === 'YearScreen') {

     }
       
		return (

			 
       { buttonRight }
		)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },

  logoText: {
    fontSize: 16,
    color: '#C0C0C0'
  }
});