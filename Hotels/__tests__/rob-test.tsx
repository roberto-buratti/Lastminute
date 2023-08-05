import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import { Alert } from 'react-native';

import IServiceFactory from '../Services/Interfaces/IServiceFactory';
import IServiceManager from '../Services/Interfaces/IServiceManager';

import UserModel from '../Models/HotelModel';

import IAppViewModel from '../IAppViewModel';
import IHomeViewModel from '../Scenes/HotelsList/IHotelsListViewModel';
import IWelcomeViewModel from '../Scenes/Welcome/IWelcomeViewModel';
import ILoginViewModel from '../Scenes/Login/ILoginViewModel';

import LoginScreen, { ILoginProps } from '../Scenes/Login/LoginScreen';

class FakeServiceFactory implements IServiceFactory {
    public get serviceManager(): IServiceManager {
        throw "Not implemented";
    }

    public appViewModel(): IAppViewModel {
        throw "Not implemented";
    }

    public homeViewModel(): IHomeViewModel {
        throw "Not implemented";
    }

    public welcomeViewModel(): IWelcomeViewModel {
        throw "Not implemented";
    }

    public loginViewModel(): ILoginViewModel {
        return new FakeLoginViewModel(this);
    }
}

class FakeLoginViewModel implements ILoginViewModel {
    private _serviceFactory: IServiceFactory;
    public didTapLoginButtonHasBeenCalled = false;

    constructor(serviceFactory: IServiceFactory) {
        this._serviceFactory = serviceFactory;
    }

    didTapLoginButton(username: string, password: string, callback: (result?: UserModel | undefined, error?: Error | undefined) => void): void {
        this.didTapLoginButtonHasBeenCalled = true;
        callback(undefined, Error("fake"))
    }
} 

const spy = jest.spyOn(Alert, 'alert');

it('Login Screen', () => {
    const serviceFactory = new FakeServiceFactory();
    const viewModel = serviceFactory.loginViewModel()
    const navigation = {};
    
    const login = renderer.create(<LoginScreen viewModel={viewModel} navigation={navigation} />);
    const button = login.root.find((x) => { return x.props["title"] == "Login" });
    button.props.onPress();
    expect((viewModel as FakeLoginViewModel).didTapLoginButtonHasBeenCalled).toBeTruthy();
    expect(spy).toHaveBeenCalledWith('Login Failed',"fake");
});