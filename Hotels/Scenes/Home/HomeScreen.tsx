import React from 'react'

// import {NavigationContainer, DefaultTheme} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
  
import IHomeViewModel from './IHomeViewModel'

import HotelsListScreen from '../HotelsList/HotelsListScreen'
import HotelDetailsScreen from '../HotelDetails/HotelDetailsScreen'

import * as copy from '../../Assets/Copy'
import HotelModel from '../../Models/HotelModel'

interface IProps {
    viewModel: IHomeViewModel
}

interface IState {
}

const MainStack = createNativeStackNavigator();

export default class HomeScreen extends React.Component<IProps, IState> {

    public render() {

        const { viewModel } = this.props

        function HotelsScreenComponent({ route, navigation }) {
            return <HotelsListScreen viewModel={viewModel.hotelsViewModel()} navigation={navigation}/>
        }

        function HotelDetailsScreenComponent({ route, navigation }) {
            const hotel = route.params["hotel"]
            return <HotelDetailsScreen viewModel={viewModel.hotelDetailsViewModel(hotel)} navigation={navigation}/>
        }

        return ( //<NavigationContainer theme={DefaultTheme}>
            <MainStack.Navigator screenOptions={
                {
                    orientation: 'portrait',    // [ROB] disable landscape because the effect isn't pleasant
                    headerBackTitleVisible: false, 
                    headerTintColor: '#DE307C', 
                    headerTitleStyle: { color: 'black' }                    
                }}
            >
                <MainStack.Screen
                    name={"hotels_scene"}
                    component={HotelsScreenComponent}
                    options={{title: copy.getString("hotels_list_scene_title")}}
                />
                <MainStack.Screen
                    name="hotel_details_scene"                
                    component={HotelDetailsScreenComponent}
                    options={({ route }) => { 
                        const params = route.params
                        const hotel = (params as ({ [key: string]: any }))["hotel"] as HotelModel
                        return { title: hotel.name, headerTransparent: true }
                    }}
                />
            </MainStack.Navigator>
        ) //</NavigationContainer>
    }
}
