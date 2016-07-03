'use strict';

import React, {Component} from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    View
} from 'react-native';

var getStyleFromScore = require('./getStyleFromScore');
var getImageSource = require('./getImageSource');
var getTextFromScore = require('./getTextFromScore');

class MovieCell extends Component {
    render() {
        var criticsScore = this.props.movie.ratings.critics_score;
        var TouchableElement = TouchableHighlight;
        if(Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }

        return (
            <View>
                <TouchableElement
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                onHideUnderlay={this.props.onUnhighlight}>
                <View style={styles.row}>
                    <Image
                    source={getImageSource(this.props.movie, 'det')}
                    style={styles.cellImage}
                    />
                    <View style={styles.textContainer}>
                    <Text style={styles.movieTitle} numberOfLines={2}>
                        {this.props.movie.title}
                    </Text>
                    <Text style={styles.movieYear} numberOfLines={1}>
                        {this.props.movie.year}
                        {' '}&bull;{' '}
                        <Text style={getStyleFromScore(criticsScore)}>
                        Critics {getTextFromScore(criticsScore)}
                        </Text>
                    </Text>
                    </View>
                </View>
                </TouchableElement>
            </View>
        )
    }
};

var styles = StyleSheet.create({
  textContainer: {
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  movieYear: {
    color: '#999999',
    fontSize: 12,
  },
  row: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  cellImage: {
    backgroundColor: '#dddddd',
    height: 93,
    marginRight: 10,
    width: 60,
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
});

module.exports = MovieCell;