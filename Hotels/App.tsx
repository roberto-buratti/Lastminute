/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {NavigationContainer, DefaultTheme} from '@react-navigation/native'

import ServiceFactory from './Services/ServiceFactory'
import AppViewModel from './AppViewModel'
import HomeScreen from './Scenes/Home/HomeScreen'

class App extends React.Component {
  private _serviceFactory = new ServiceFactory()
  private _viewModel = new AppViewModel(this._serviceFactory)

  public render() {
    return (
      <NavigationContainer theme={DefaultTheme}>
        <HomeScreen viewModel={this._viewModel.homeViewModel()}/>
      </NavigationContainer>
        // <View style={{width:'100%', height:'100%'}}>
        //   <HomeScreen viewModel={this._viewModel.homeViewModel()}/>
        // </View>
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
