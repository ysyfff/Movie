import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView, //提高渲染性能的
} from 'react-native';

//搜索栏
let SearchBar = require('./SearchBar');
let MovieCell = require('./MovieCell');

//静态变量
const API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/';
const API_KEYS = [
  '7waqfqbprs7pajbz28mqf6vz',// 'y4vwv8m33hed9ety83jmv52f', Fallback api_key
];

var me = null;
var resultCache = {
    dataForQuery: {},
    nextPageNumberForQuery: {},
    totalForQuery: {},
};
var LOADING = {};
//入口函数
class SearchScreen extends Component {
    constructor(props){
        super(props);   //这一句不能省略，照抄即可
        this.state = {
            isLoading: false,
            isLoadingTail: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            filter: '',
            queryNumber: 0,
        };
        this.timeoutID = null;
        me = this;
    }
    render() {
        var content = this.state.dataSource.getRowCount() === 0 ?
            <NoMovie
                filter={this.state.filter}
                isLoading={this.state.isLoading}
            /> :
            <ListView
                ref="listview"
                renderSeparator={this.renderSeparator}
                dataSource={this.state.dataSource}
                renderFooter={this.renderFooter}
                renderRow={this.renderRow}
                onEndReached={this.onEndReached}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps={true}
                showsVerticalScrollIndicator={false}
            />;
        return (
            <View style={[styles.container, styles.centerText]}>
                <SearchBar
                    onSearchChange={this.onSearchChange}
                    searchMovies={this.searchMovies}
                    isLoading={this.state.isLoading}
                    onFocus={() =>
                        this.refs.listview && this.refs.listview.getScrollResponder().scrollTo({x: 0, y: 0})
                    }
                    isLoading={this.state.isLoading}
                    
                />
                {content}
            </View>
        )
    }
    _urlForQueryAndPage(query: string, pageNumber: number): string {
        var apiKey = API_KEYS[me.state.queryNumber % API_KEYS.length];

        if(query) {
            return (
                API_URL + 'movies.json?apikey=' + apiKey + '&q=' +
                encodeURIComponent(query) + '&page_limit=20&page=' + pageNumber
            );
        }else{
            return (
                API_URL + 'lists/movies/in_theaters.json?apikey=' + apiKey +
                '&page_limit=20&page=' + pageNumber
            )
        }
    }

    //获取电影数据
    getDataSource(movies: Array<any>): ListView.DataSource{
        return me.state.dataSource.cloneWithRows(movies);
    }
    onSearchChange(event) { //相当于是一个节流函数
        var filter = event.nativeEvent.text.toLowerCase();

        clearTimeout(me.timeoutID);
        me.timeoutID = setTimeout(() => me.searchMovies(filter), 100)
    }
    searchMovies(query: string) {
        me.timeoutID = null;
        me.setState({filter: query}); //react-native 自带setState, 每当调用setSate的时候就会触发me.render方法
        
        var cachedResultForQuery = resultCache.dataForQuery[query];
        if(cachedResultForQuery) {
            if(!LOADING[query]) {
                me.setState({
                    dataSource: me.getDataSource(cachedResultForQuery),
                    isLoading: false
                });
            }else{
                me.setState({isLoading: true});
            }
            return;
        }
        LOADING[query] = true;
        resultCache.dataForQuery[query] = null;
        me.setState({
            isLoading: true,
            queryNumber: me.state.queryNumber + 1,
            isLoadingTail: false,
        });

        fetch(this._urlForQueryAndPage(query, 1))
            .then((response) =>  response.json())
            .catch((error) => {
                LOADING[query] = false;
                resultCache.dataForQuery[query] = void 0;

                me.setState({
                    dataSource: me.getDataSource([]),
                    isLoading: false
                })
            })
            .then((responseData) => {
                LOADING[query] = false;
                resultCache.totalForQuery[query] = responseData.total;
                resultCache.dataForQuery[query] = responseData.movies;
                resultCache.nextPageNumberForQuery[query] = 2;

                if(me.state.filter !== query) {
                    return;
                }

                me.setState({
                    isLoading: false,
                    dataSource: me.getDataSource(responseData.movies),
                })
            })
            .done();
    }

    //渲染电影
    renderRow(
        movie: Object,
        sectionID: number | string,
        rowID: number | string,
        highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void
    ) {
        return (
            <MovieCell
                key={movie.id}
                onSelect={() => this.selectMovie(movie)}
                onHighlight={() => highlightRowFunc(sectionID, rowID)}
                onUnhighlight={() => highlightRowFunc(null, null)}
                movie={movie}
            />
        )
    }
};



//没有movie的渲染，创建了<NoMovie>标签
class NoMovie extends Component {
    render() {
        var text = '';
        if(this.props.filter) {
            text = `No results for "${this.props.filter}"`;
        }else{
            text = 'No movies found'
        }
        return (
            <View style={[styles.container, styles.centerText]}>
                <Text style={styles.noMoviesText}>{text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
    },
    centerText: {
        alignItems: 'center',
    },
    noMoviesText: {
        marginTop: 80,
        color: '#888888',
    },
});

module.exports = SearchScreen;