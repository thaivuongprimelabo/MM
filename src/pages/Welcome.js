
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  InteractionManager
} from 'react-native';

import TimerMixin from 'react-timer-mixin';

mixins: [TimerMixin];

export default class Welcome extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      time : 0
    }
  }

	static navigationOptions = {
    	header: null
  };

  componentWillMount() {
    //console.log('componentWillMount');
    //setTimeout(() => { alert('Five Seconds') }, 5000);
  }

  

  componentDidMount() {
    this.interval = setInterval(() => {
      console.log(this.state.time);
        if(this.state.time > 1) {
          clearInterval(this.interval);
          this.props.navigation.navigate('YearScreen');
        }
        if(this.state.time === 0 || this.state.time === 1) {
          this.setState({
            time: this.state.time + 1
          })
        }
    }, 3000);
  }

  onSubmitLogin = () => {
    this.props.navigation.navigate('YearScreen');
  }

	render() {
		return (
				<View style={ styles.container }>
					<Text>Loading...</Text>
				</View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#455a64',
  },
});