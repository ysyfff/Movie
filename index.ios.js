/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  NavigatorIOS, //导航
  StyleSheet,
} from 'react-native';

var SearchScreen = require('./ios4/SearchScreen');

class Movie extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Movie',
          component: SearchScreen //外部引用的模块
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

AppRegistry.registerComponent('Movie', () => Movie);

module.exports = Movie;
