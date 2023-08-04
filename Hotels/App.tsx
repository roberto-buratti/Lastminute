/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';


import ServiceFactory from './Services/ServiceFactory';
import HotelsScreen from './Scenes/Hotels/HotelsScreen';
import HomeScreen from './Scenes/Home/HomeScreen';

class App extends React.Component {
  private _serviceFactory = new ServiceFactory();
  private _viewModel = this._serviceFactory.appViewModel();

  public render() {
    return (
      <SafeAreaView>
        <View style={{width:'100%', height:'100%'}}>
          <HomeScreen viewModel={this._viewModel.homeViewModel}/>
        </View>
      </SafeAreaView>
    );
  } 
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
