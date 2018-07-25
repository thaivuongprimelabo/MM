
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import { connect } from 'react-redux';

import Logo from '../components/Logo';
import Form from '../components/Form';


class Test extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      text: '9999'
    }
  }

  componentDidMount() {
    this.setState({
      text: '4444'
    });
  }

  componentWillReceiveProps(nextProps) {

  }

	render() {

    var { text } = this.state;

		return (
				<View style={ styles.container }>
          <Text>{ text }</Text>
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

const mapStateToProps = (state) => {
    return {
      dataInDay : state.dataInDay
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);