import * as React from 'react';
import { Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { swipingPage } from './SwipePage.js'
import { suggestionsPage } from './SuggestionsPage.js'

/*
  Imports the image assets from the assets folder
*/
import Home from './assets/home.png'
import LightBulb from './assets/lightbulb.png'
import Settings from './assets/settings.png'

/*
  React wants the image resources as a URI, so we
  convert the imports here into their URI form
  so we can provide them to the <Image> tag later on.
*/
const homeImg = Image.resolveAssetSource(Home).uri;
const lightbulbImg = Image.resolveAssetSource(LightBulb).uri;
const settings = Image.resolveAssetSource(Settings).uri;

const Tab = createBottomTabNavigator();

function settingsScreen()
{
  return (
    <View style = { { flex : 1, alignItems: 'center', justifyContent: 'center' } }>
      <Text>Settings!</Text>
    </View>
  );
}

export function Create()
{
    return (
        <NavigationContainer>
            <Tab.Navigator initialRoute = "Home" screenOptions = {
              {
                tabBarStyle: [
                  {
                    display: "flex",
                    //backgroundColor: "#79e57d"
                  }, null],

                  headerShown: false
              }}>
                <Tab.Screen name = "Home" component = {swipingPage} options = { 
                  {
                    tabBarIcon: ({size, focus, color}) => {
                      return (
                        <Image style = {{ width: size, height: size }}
                               source = {{uri: homeImg}}/>
                      );
                    },

                    tabBarLabel: ({focused, color, size}) => {
                      return(
                        <Text style = { { color: 'black' } }>Swiping</Text>
                      );
                    }
                  }}/>
                <Tab.Screen name = "Suggestions" component = {suggestionsPage} options ={
                  {
                    tabBarIcon: ({size, focus, color}) => {
                      return (
                        <Image style = { { width : size, height: size } }
                               source = { { uri: lightbulbImg } }/>
                      );
                    },

                    tabBarLabel: ({focused, color, size}) => {
                      return(
                        <Text style = { { color: 'black' } }>Suggestions</Text>
                      );
                    }
                  }
                }/>
                <Tab.Screen name = "Settings" component = {settingsScreen} options ={
                  {
                    tabBarIcon: ({size, focus, color}) => {
                      return (
                        <Image style = { { width : size, height: size } }
                               source = { { uri: settings } }/>
                      );
                    },

                    tabBarLabel: ({focused, color, size}) => {
                      return(
                        <Text style = { { color: 'black' } }>Settings</Text>
                      );
                    }
                  }
                }/>
            </Tab.Navigator>
        </NavigationContainer>
    );
}