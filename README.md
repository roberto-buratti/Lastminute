# Lastminute
## Mobile Coding Exercise

### General Description

The app has been implemented using react-native and tested on iOS & Android (on physical devices).

The app has been implement using the **MVVM** design pattern, so each page delegates all the business logic to it `viewModel`.

The `viewModel` is always declared as an interface and is injected from outside, so every scene is unit-testable. I'm aware that it was not requested but this is the way I normally work.

I reused somewhere code I wrote for other apps but most of the code if fresh new.  
What is not new is the app architecture, since I always use the same design patterns (...when I can choose).

There are 3 important services that implement the interaction with the server:

1. `ServiceFactory` 

It is just responsible for the creation of and the access to the `ServiceManager` (or other global managers, for example, `UserManager` or `NotificationsManager`) .  
It is created at the launch and it is injected in every view model (as an interface).

2. `ServiceManager`

It is the global Facade that implements all the services the app needs to call. 

> Just one, in this case:  
> `getHotels(): Promise<HotelModel[]>`. 

Every view model that needs to interact with the server can get the instance of the service manager from the (injected) service factory.

Both `ServiceFactory` & `ServiceManager` are always declared as interfaces (in the name of unit-testing).

`ServiceManager` is normally a singleton but this is not mandatory.  
It should be used ***exclusively*** by view models, never by views or models.

3. `NetworkManager`. 

It is just responsible for actually doing the calls via http.  
It doesn't know anything about models and data structures used by the app.  
It just knows about HTTP, REST, status codes etc...  
It handles timeout and validates the status code of the response.

It has not been declared as an interface because it must be used ***solely*** by the `ServiceManager` (if you need to mock the service manager for testing purpouses, you won't need to access the network manager).

### Screens & Use cases

The app support localisation for 6 languages: `en`, `it`, `fr`, `de`, `es`, `pr`.  
If a different language is detected, `en` translation is used by default.  
At the moment, translations are available just for `en` & `it`.

The app has just two screens: 

- `Hotels List`: The list of the hotels 
- `Hotel Details`: The details of the selected hotel

#### Hotels List

I have done it more complex than it is.

Instead of a simple list of hotels you have a interactive map and a list inside a parallax view, so you can see just the map, just the list or both.

The map pins are touchable and shows a callout with the same `HotelListItem` present in the list.

The list header shows 3 buttons:

##### 1. Filter & Sorting

Instead of a simple modal dialog (like www.lastminute.come), I decided to implemented a dynamic height view: IMHO it seems nicer inside an app.  
...With some more time, it would interesting to try some slide animations but it is not so easy to fluidly animate an object that changes size inside a scrolling view... 😇

***CAVE***: The filter on "Stars" acts on a `not-less-than` basis, instead of `equal-to`. IMHO it is more useful this way.

***CAVE***: Actually the server returns all the prices in EUR (€).  
I randomly changed some hotel to use GBP (£) or USD ($) just to let the user to be able to experiment the `Currency` filter.

##### 2. **Reverse Sort**

It just reverses the order of sorting (if not specified, the list is ordered as it is received from the server). 

Probably (from a UX POV) it would have been better to separate sorting criteria from filters and to show them (in the same way filters are shown) at the tap on this button... but I realised it too late. OK, next version... 😇

##### 3. **Refresh**

This button, just refresh the list from the server and redraws anything (I noticed that randomly the server stops responding... I'm sure this is wanted 😉).

***Important***: Normally, the server call is really fast (obviously, since it is mocked!). I added 1000ms delay just to let the user see the visual effects. An activity indicator is shown while refreshing and all the interactors are disabled.

#### Hotel Details

This screen shows

- Image gallery (inside a carousel)
- Hotel name and stars
- Full addrees (the button on the left opens `map`)
- User Rating, Price & Check-in/Check-out times
- Phone number (the button on the left starts a `phone call`)
- Mail address (the button on the left sends an `email`)

At the bottom there is a big ***Book Now*** button that opens https://www.it.lastminute.com.  
>I tried to jump directly to the hotel page but it seems a little bit awkward to do without more info.

### Notes

Any tappable interactor has tintColor '#DE307C' (like lastminute.com). It doesn't seem so nice... but it is just a coding challenge.

Inside the code, relevant comments are marked with a leading  
`// [ROB]`

Some gallery URL responds 404.  
In this case the app shows a static `image_not_available` image.

### Known Issues

> The `TextInput` element, on Android, seems to (randomly!) ignore horizontal padding. Needs to investigate.

> The map (react-native-map) has some issues on Android: 
Sometimes (better, often 😡), images inside pins or callouts are not shown. (see https://github.com/react-native-maps/react-native-maps/issues/2633). It seems there is no easy solution so far.

> react-native-reanimated@3.4.1 causes the app to crash. I downgraded it to 3.3.0
(see: https://github.com/software-mansion/react-native-reanimated/issues/4836)

