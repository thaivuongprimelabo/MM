
import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { compose } from 'redux';
import { connect } from 'react-redux';

import * as Constants from '../constants/Constants';
import * as Actions from '../actions/index';
import Utils from '../constants/Utils';

import Modal from 'react-native-modalbox';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'test.db', createFromLocation: '~sqliteexample.db'}, this.errorCB, this.successCB);

var screen = Dimensions.get('window');

class BudgetModal extends Component<Props> {

  constructor(props) {
    super(props);

    this.state = {
      budget: Constants.DEFAULT_BUDGET,
      month : 0,
      year : 0
    };
  }

  showBudgetModal = (month, year) => {
    this.setState({
      month : month,
      year : year
    })
    this.refs.myBudgetModal.open();
  }

  _updateBudget = () => {
    var { budget, month, year } = this.state;

    var ym = Utils.formatDateString({ y: year, m: month, d: '', format: 'YYYYMM'});

    var sql = 'INSERT INTO ' + Constants.SETTINGS_TBL + ' VALUES("BUDGET_' + ym + '", "' + budget + '")';

    db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, results) => {
        this.props.loadDataInYear(this.state.year);
      });
    });
  }

	render() {
    var { month } = this.state;

    var title = Constants.TXT_TITLE_BUDGET_MODAL;

    title = title.replace('{0}', month);

		return (
      <Modal ref={'myBudgetModal'}
             style={{ justifyContent: 'center', borderRadius:5, shadowRadius: 10, width: screen.width - 30, height: 250  }} 
             position='center'
             backdrop={true}
             onOpened={() => {

             }}

             onClosed={() => {
             }}
      >

        <Text style={{ fontSize:16, fontWeight: 'bold', textAlign: 'center' }}>{ title }</Text>
        <TextInput 
            style={{ height:40, marginLeft:30, marginRight: 30,marginTop: 20, marginBottom: 10,  }}
            onChangeText={(text) => this.setState({ budget: text })}
            placeholder={ Constants.TXT_BUDGET }
            value={ this.state.budget } />

        <TouchableOpacity onPress={ this._updateBudget } style={{ padding:0, marginLeft: 70, marginRight: 70, height:40, borderRadius: 6, backgroundColor: '#1D2F3C',  justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color:'#f0f0f0' }}>{ Constants.TXT_BUTTON_UPDATE }</Text>
        </TouchableOpacity>

      </Modal>
		)
	}
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadDataInYear : (year) => {
      dispatch(Actions.loadDataInYear(year))
    }
  };
}

export default connect(mapStateToProps,mapDispatchToProps, null, { withRef: true})(BudgetModal);