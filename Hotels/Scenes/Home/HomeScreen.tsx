import React from 'react';

import { NavigationAction, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
  
import IHomeViewModel from './IHomeViewModel';
import HotelsScreen from '../Hotels/HotelsScreen';

interface IState {
    isLoading: boolean
    title: string
    result?: string
}
interface IProps {
    viewModel: IHomeViewModel
}

const MainStack = createNativeStackNavigator();

export default class HomeScreen extends React.Component<IProps, IState> {

    public render() {

        const HotelsScreenComponent = () => (
            <HotelsScreen viewModel={this.props.viewModel.hotelsViewModel} />
        );

        return <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    name="Hotels"
                    component={HotelsScreenComponent}
                    // options={{presentation: "modal"}}
                />
            </MainStack.Navigator>
        </NavigationContainer>        
    }
}
