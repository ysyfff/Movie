'use strict';

import React, { Component } from 'react';
import {
    ActivityIndicatorIOS,
    TextInput,
    StyleSheet,
    View,
    Text,
} from 'react-native';

class SearchBar extends Component {
    render() {
        return (
            <View style={styles.searchBar}>
                <View style={styles.input}>
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChange={this.props.onSearchChange}
                        placeholder="Search a movie"
                        onFocus={this.props.onFocus}
                        style={styles.searchBarInput} 
                    />
                </View>
                <ActivityIndicatorIOS
                    animating={this.props.isLoading}
                    style={styles.spinner}
                />
            </View>
        )
    }
};              


const styles = StyleSheet.create({
    searchBar: {
        marginTop: 64,
        padding: 3,
        paddingLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'blue',
    },
    searchBarInput: {
        fontSize: 15,
        flex: 1,
        height: 30,
        width: 200,
    },
    spinner: {
        width: 30,
    },
});

module.exports = SearchBar;
