import React from 'react'

import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
  
import IHomeViewModel from './IHomeViewModel'

import HotelsScreen from '../Hotels/HotelsScreen'
import HotelDetailsScreen from '../HotelDetails/HotelDetails'
import IHotelDetailsViewModel from '../HotelDetails/IHotelDetailsViewModel'

interface IProps {
    viewModel: IHomeViewModel
}

interface IState {
}

const MainStack = createNativeStackNavigator();

export default class HomeScreen extends React.Component<IProps, IState> {

    public render() {

        const { viewModel } = this.props
        const homeViewModel = viewModel

        function HotelsScreenComponent({ route, navigation }) {
            // console.log(`*** HomeScreen:HotelDetailsScreenComponent: route=${JSON.stringify(route)}`)
            return <HotelsScreen viewModel={homeViewModel.hotelsViewModel} navigation={navigation}/>
        }

        function HotelDetailsScreenComponent({ route, navigation }) {
            console.log(`*** HomeScreen:HotelDetailsScreenComponent: route=${JSON.stringify(route)}`)            
            const uuid = route.params["viewModel"]
            const viewModel = homeViewModel.popViewModel(uuid) as IHotelDetailsViewModel
            console.log(`*** HomeScreen:HotelDetailsScreenComponent: viewModel=${JSON.stringify(viewModel)}`)            
            return <HotelDetailsScreen viewModel={viewModel} navigation={navigation}/>
        }

        return <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    name="Hotels"
                    component={HotelsScreenComponent}
                    // options={{presentation: "modal"}}
                />
                <MainStack.Screen
                    name="HotelDetails"
                    component={HotelDetailsScreenComponent}
                />
            </MainStack.Navigator>
        </NavigationContainer>        
    }
}
