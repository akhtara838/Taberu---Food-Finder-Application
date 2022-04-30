import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import axios from "axios";
import { Card } from "./Card";
import * as Location from 'expo-location';

/*
    Imports the image assets from the root directory
    of the project folder.
*/
import SuggestionGradient from "./assets/backgroundGradient.jpg";
import HeartLike from "./assets/like.png";
import XDislike from "./assets/dislike.png";
import SearchGradient from "./assets/searchingGradient.jpg";

/*
    Below I load in the images from the assets folder in the
    root directory of the project. These are the static icons
    that are used throughout the program lifetime:

    Background gradient,
    Like button,
    Dislike button,
    Search background gradient
*/
const grad = Image.resolveAssetSource(SuggestionGradient);
const like = Image.resolveAssetSource(HeartLike);
const dislike = Image.resolveAssetSource(XDislike);
const searchGradeint = Image.resolveAssetSource(SearchGradient);

let renderCount = 0;
const RENDER_CAP = 1;


/*
    This is the card that marks the end of the data.
    It shouldn't change, and thus is const.

    It tells us that there is likely an internet connection
    issue and that the user should check their connection.

    Note that the ID 0 is used ONLY for this card.
    0 indicates to the Card class that this card is not
    swipeable. It can still be moved like any other card,
    but it can never be fully swiped away.
*/
const StaticCard = 
{
    name: "",
    canRender: true,
    image: searchGradeint.uri,
    id: 0,
    positive: "Please check your internet connection"
};

/*
    This is needed to access the Yelp Fusion API. It gives us 5000
    calls a day.
*/
const yelpKey = "F7EVi36hOxqwk0qrvb5EQc9gaU0o2okG0ZcCWZ3TocMdRTzAqRuXJM4J7D_O-3b_axj1GRW-33Vf3Omh8RTz2BavZWixqK6FC79UnG7OZtPRjb8HW-ENL3ZbCcNMYnYx";

/*
    This is the global cards array. The first thing in it is always
    the StaticCard. Everything else is pushed in front of it, ensuring
    that it is always the last element in the stack.
*/
let cards = [StaticCard];


/*
    Below is the stylesheet for the cards. Change at your own risk....
    (Please make a copy before you make changes!)
*/
const cardStyles = StyleSheet.create(
{
    gradient:
    {
        position: "absolute",
        top: "7.5%",
        flex: 1,
        width: "100%",
        height: "100%",
        zIndex: 0
    },

    buttonContainer:
    {
        position: "absolute",
        top: "85%",
        left: "2.5%",
        width: "95%",
        height: "12.5%",
        borderRadius: 10

    },

    leftButton:
    {
        left: "-5%",
        top: "-27.5%",
        width: "50%",
        height: "50%",
        justifyContent: "center",
        borderRadius: 10
    },

    rightButton:
    {
        left: "55%",
        top: "20%",
        width: "50%",
        height: "50%",
        justifyContent: "center",
        borderRadius: 10
    },

    yesNoButton: 
    {
        top: "10%",
        flex: 1,
        width: null,
        height: null,
        resizeMode: "contain"
    }
});

/**
 * @description
 *  This function will remove a card from the list of cards.
 * 
 * @pre
 *  This assumes that there are cards to remove. It is
 *  only ever operates on removeable cards (id > 0),
 *  so you never have to worry about it removing the
 *  StaticCard.
 * @post
 *  After this function is called the card the user just swiped on
 *  will be removed from the list.
 * 
 * @param {int} idToRemove
 *  This is the ID of the card that is going to be removed.
 * 
 * @returns
 *  Notihing.
 */
function removeCard(idToRemove)
{
    if (idToRemove != 0) // Checks against the StaticCard
    {
        cards = cards.slice(1, idToRemove); // Slices the element out of the list
    }
}

/**
 * @description
 *  This function takes in the JSON data
 *  from the Taberu back end API query to the
 *  /local route and then parses out
 *  the important fields from the JSON object.
 *  It converts the data to lists and then returns
 *  the data.
 * 
 * @pre
 *  This assumes that the JSON data passed in is valid,
 *  which should automatically be done by the .json function call
 *  in the fetch call to get the data.
 * 
 * @post
 *  This function has no postconditions.
 * 
 * @param {JSON Object} responseData
 *  This is the JSON object that we get from the fetch call
 *  to the Taberu back end when we query the /local route.
 * 
 *  @returns {JSON object}
 *   This is a different JSON object. The difference between the
 *   value returned from this function and the one passed in (responseData)
 *   is that I have shortened the object down to contain lists of the data.
 * 
 *   For exmaple:
 *      responseData Structure:
 *          {
 *              {
 *                  name: abc
 *                  fsid: sdfhsj2334HH__
 *                  image: https://someURL.jpg
 *                  address: some place St., 80234, Westminster, CO
 *              },
 *              {
 *                  name: def
 *                  fsid: dfdsfsdfasdf&&&$E78w4_
 *                  image: https://someURL2.jpg
 *                  address: some place 2 St., 80234, Westminster, CO
 *              },
 *              etc...
 *          }
 * 
 *      Returned JSON Object Structure:
 *          {
 *              names: [abc, def, ...]
 *              fsids: [sdfhsj2334HH__, dfdsfsdfasdf&&&$E78w4_, ...]
 *              images: [https://someURL.jpg, https://someURL2.jpg, ...]
 *              addresses: [some place St., 80234, Westminster, CO, some place 2 St., 80234, Westminster, CO, ...]
 *          }
 * 
 */

function parseLocalResponse(responseData)
{
    let names = responseData.map(d => d.name); // Creates array of just names
    let fsids = responseData.map(d => d.fsid); // Creates array of just fsids
    let photos = responseData.map(d => d.img); // Creates array of just photos
    let address = responseData.map(d => d.address); // Creates array of just addresses
    let hours = responseData.map(d => d.hours); // Create array of just the open / close / day of week times
    let websites = responseData.map(d => d.website); // Stores the website from the data

    
    /*
        Returns the JSON object that is described in the @return section
        of the Javadoc comments above.
    */
    return (
    {
        names: names,
        fsids: fsids,
        photos: photos,
        address: address,
        hours: hours,
        websites: websites
    });
}

/**
 * @description
 *  This function will parse the reviews from the Yelp Fusion
 *  API call. It takes all the reviews and it will find
 *  the one with the highest rating score and the lowest rating
 *  score and pack them into a JSON object that is eventually
 *  returned with the name that the reviews correspond to.
 * 
 * @pre
 *  This function assumes that you already have made a call to /local
 *  to extract the information from the back end API in order to get
 *  the names of the places to query on the Yelp Fusion API.
 * 
 *  It also assumes that the data coming in comes directly from the Yelp Fusion
 *  API call, and that no preprocessing at all has been done on it.
 * 
 * @post
 *  This function will have processed the query from the Yelp Fusion API
 *  and it will have constructed an object containing the reviews that will
 *  be returned.
 * 
 * @param {String} name 
 *  This is the name of the restautant that is being queried for
 *  a review.
 * 
 * @param {JSON Object} response 
 *  This is the JSON object that contains the information directly
 *  from the Yelp Fusion API call.
 * 
 * @returns {JSON Object} review
 *  This is the JSON Object that contains the positive and negative review
 *  for the corresponding restaurant that was just queried.
 * 
 *  Structure:
 *      {
 *          name: "Some name"
 *          positive: "This place is great!"
 *          negative: "This place sucks!"
 *      }
 */
function getYelpReviews(name, response)
{
    var review; // The eventual review to be returned
    let ratings = response.data.reviews.map(d => d.rating); // Creates a list of the ratings
    let allReviews = response.data.reviews.map(d => d.text); // Creates a list of the review text

    /*
        In order to get the best/worst reviews we need to keep track of
        the index of where we saw the best/worst review, in addition to
        the actual ratings themselves so we can extract them from the list
        of text reviews (allReviews) later on.

    */

    let minIndex = 6; // Sets to a value outside of the index range
    let maxIndex = -1; // Sets to a value outside of the index range

    let minVal = 6; // Sets to a value outside of the rating range
    let maxVal = -1; // Sets to a value outside of the rating range

    /*
        Loops through each of the ratings to
        find the largest / smallest ones.
    */
    for (let j = 0; j < ratings.length; j++)
    {
        let rating = ratings[j]; // extracts current rating
        if (rating <= minVal) // is the rating less than the current smallest known?
        {
            minVal = rating; // If so, keep track of the value
            minIndex = j; // Keep track of where we saw it in the list
        }
        else if (rating >= maxVal) // Is the rating more than the current largest known?
        {
            maxVal = rating; // If so, keep track of the value
            maxIndex = j; // Keep track of where we saw it in the list
        }
    }

    let goodReview = allReviews[maxIndex]; // Extracts the good review from the text array
    let badReview = allReviews[minIndex]; // Extracts the bad review from the text array

    /*
        Constructs the JSON object for us to return
    */
    review = {
        name: name,
        positive: goodReview,
        negative: badReview
    }
    return review; // Returns the JSON object
}

/**
 * @description
 *  This function takes in a list of Cards
 *  and the Yelp Fusion ID of a given place.
 *  It then checks against the list of cards
 *  to see if the ID is already in the list of
 *  cards. If so, then it will not re add it to the list.
 * 
 *  There was an issue with the fetch call getting the
 *  same places multiple times, so this is just a quick
 *  way to get around that, at the expense of checking
 *  every card each time we want to add a new one.
 * 
 *  Since the number of cards stored at any given time
 *  is relatively small (between 1 and 15 I'd assume),
 *  even though it's technically O(n) to check each card,
 *  it won't be that slow in practice.
 * 
 * @pre
 *  This function assumes that the ID passed in is a valid
 *  Yelp Fusion ID for a place, and that it actually
 *  came from the API call.
 * 
 * @post
 *  After this function has been called it will validate if
 *  a given restaurant has already been in our list.
 * 
 *  TODO: This function should also check against a history of
 *  cards to make sure that we don't present the user with
 *  the same cards every time the app is reloaded.
 * 
 * @param {List<JSON Object>} cards
 *  This is the list of already existing cards. The cards
 *  are stored as a JSON object, and we pass in a list of them
 *  to this functionc call.
 * 
 *  The only field we care about in this method is the
 *  yelpID field of the card. This is what is checked against
 *  inside of the call.
 * 
 * @param {String} id 
 *  This is the Yelp Fusion ID of the Restaurant
 *  that we would like to add to our list of cards.
 * 
 * @returns {bool}
 *  This function returns true if the card already exists
 *  in the list. It returns false if the card doesn't already
 *  exist in the list.
 */
function isAlreadyInList(cards, id)
{
    /*
        Loops through each card in the list
        of existing cards.
    */
    for (let i = 0; i < cards.length; i++)
    {
        if (cards.yelpID == id) // Checks if any of the cards has the same ID as the new entry
        {
            return true; // If so, it's already in the list, so return true
        }
    }
    return false; // Otherwise, it wasn't in the list
}

/**
 * @description
 *  This function is the main swiping page functional component.
 *  It does a few things:
 *      1) Gets the Longitude and Latitude from the phone's GPS
 * 
 *      2) Makes the API calls to the Taberu back end and the Yelp Fusion API
 *          a) Taberu back end calls are to get the FourSquare ID's and the images
 *          b) Yelp Fusion API calls are to get the reviews for each place.
 *      3) Creates the card components from the API calls that we make.
 * 
 * @pre
 *  There are no preconditions. This function is called automatically
 *  when the Swiping page is first loaded.
 * 
 * @post
 *  The cards variable will be populated with a list of restaurants around
 *  the end user, along with the appropriate reviews for each place as well.
 * 
 *  The main interface will have the cards rendered after the list is populated
 *  as the cards are attached to a state hook.
 *  
 * @returns {React-Native renderable views}
 *  This functional component returns the entire Card view.
 *  It is essentially the entire interface for the swiping page
 *  that is returned from the aggregation of the API calls.
 */
export function swipingPage()
{
    const [location, setLocation] = useState(null); // State hook for the location
    const [errorMsg, setErrorMsg] = useState(null); // State hook for if the location services fail

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    /*
        This is a function that is called internally by the
        react native API. It allows you to link your state hooks
        to the react native API and it tells it what to do
        after components have been rendered.
    */
    useEffect(() => 
    {
        /*
            This function below gets a request from the user's permissions,
            providing that it hasn't already been granted access already,
            and it will let us know if the access was granted or not. It will
            alert us if the user denies us, or if the phone's permissions
            are not allowing our app to track their location.
        */
        (async () => 
        {
          let { status } = await Location.requestForegroundPermissionsAsync(); // Gets the request for location
          if (status !== 'granted') // Checks if the access was granted
          {
            setErrorMsg('Permission to access location was denied'); // If not, then we alert
            return; // Returns nothing, since we can't know what is around.
          }
    
          let location = await Location.getCurrentPositionAsync({}); // Otherewise, we have permission to get the location
          setLocation(location); // Sets the location using the State hook
        })();
    }, []);

    if (errorMsg) // If there was an error with the GPS location
    {
        alert("Cannot use GPS. Please check permissions"); // Tells the user that we can't get their location
    } 
    else if (location) // If we got a valid location
    {
        let lat = location.coords.latitude; // Extract the latitude
        let long = location.coords.longitude; // Extract the longitude
        /*
            Now we make a call to the back end API to get the things around us.
        */
        fetch("http://taberu.frp.ryanbuxton.com/local?ll=" + lat + "," + long,
        {
            method: 'GET'
        }).
        then(response => response.json()). // Decodes the JSON data
        then((responseData) =>
        {
            let data = parseLocalResponse(responseData); // Calls the function that parses out the data from the call
            
            /*
                We'll have to talk about this a little bit because we usually get
                10-15 places, however if we want to get reviews for all of them from
                the Yelp Fusion API we can only do about 5 at once without getting
                rate-limited by the Yelp Fusion API.

                TODO:
                    Look into a way to load in all the restaurants + reviews
                    from the Yelp Fusion API without getting rate-limited.
            */
            for (let i = 0; i < 5; i++) // Loops through only 5 of the places provided from the Taberu API call
            {
                //console.log(data.website[i])
                //let pres = (data.hours[i]);

                //var arr1=JSON.stringify(pres);
                //var arr2=JSON.parse(arr1);
                //console.log(arr2[i].close);
                //console.log(arr2[i].day);
                //let presVar = JSON.stringify(data.hours[i]);
                //console.log(presVar[i].close);
                /*
                    We need to build a config dictionary in order to provide it to the
                    Yelp Fusion API in order to get it to provide us with
                    the data. We need to construct it each time for a new restaurant
                    because it can only search for one place at a time, so we need to
                    edit the "term" field of the dictionary below with the current name
                    each time.
                */
                const config = 
                {
                    /*
                        Below we add the Authorization key that we
                        got from the Yelp Fusion API.

                        Note that we are unforunately limited
                        to about 5000 API calls a day...

                        (We may have to cache some of the Yelp Reviews
                            if we are allowed to by their terms of service... )
                    */
                    headers:
                    {
                        Authorization: `Bearer ${yelpKey}`
                    },

                    params: 
                    {
                        term: data.names[i], // Gives the current restautant to the config dictionary
                        radius: 5000, // Radius away from current location in meters (Cap 25 miles)
                        latitude: lat, // Provides current latitude
                        longitude: long, // Provides current longitude
                        sort_by: "distance", // Sorts by how close they are to use
                        limit: 1,
                    },
                };
                
                /*
                    Below we make a call to the Yelp Fusion API to get the buisnesses around
                    us based on the config dictionary.
                    
                    Note that the config dictionary has the current name of the place
                    that was provided by the Taberu back end API call. That means that the
                    Yelp Fusion API call is looking for reviews for that current place when
                    we make this call.

                    This outer call is just used to turn the name we get from the
                    Taberu API into a Yelp Fusion ID, which is different than the
                    FourSquare ID. Maybe we can cache the Yelp Fusion IDs in order
                    to get rid of this outer API call, but I can't be bothered to do it
                    now.

                    TODO:
                        Cache the Yelp Fusion IDs so that way if we already have looked this place
                        up before we don't have to search the name and waste some of our
                        precious 5000 api calls a day on just converting between the FSID
                        and the Yelp Fusion ID.
                */
                if (renderCount < RENDER_CAP)
                {
                    axios.get("https://api.yelp.com/v3/businesses/search", config).then(response => 
                    {
                        let total = response.data.total; // Gets the total number of responses
                        
                        /*
                            The call will just return an empty array if nothing is returned,
                            so in order to prevent us from trying to parse out an empty array,
                            and also to prevent us from making API calls that aren't needed,
                            we check if the total number of responses returned was at least 1.
                        */
                        if (total >= 1)
                        {
                            /*
                                Note that we searched a buisness name. This means
                                that there are possibly MANY places returned as the Yelp
                                Fusion API will do a search for all complete matches, but
                                also partial matches as well. This will actually
                                cause an issue where we get the same place mutliple times.

                                For example:
                                    You search Qdoba, but it gives you 10 Qdobas near you
                                    along with other Mexican food places.

                                In order to account for this, the config variable
                                sorts things by distance, ensuring that the closest place
                                to us is at the front of the list. It will make
                                sure that the most complete match that is closest to us
                                is used if we extract element 0 from that list.
                            */
                            let id = response.data.businesses.map(d => d.id)[0]; // Gets the most relevant restaurant ID
                            
                            /*
                                Below we provide the ID of the place we want to query for
                                reviews and then construct the card now that we have all the information.
                            */
                            axios.get("https://api.yelp.com/v3/businesses/" + id + "/reviews", config).then(response =>
                            {
                                let review = getYelpReviews(data.names[i], response); // Parses the reviews
                                if (!isAlreadyInList(cards, id)) // If we don't already have this card in our list
                                {
                                    if(review.positive !== undefined) { // if no positive reviews found
                                    }
                                    else { review.positive = "No positive reviews found"; } 
                                    if(review.negative !== undefined) { // if no negative reviews found
                                    }
                                    else{ review.negative = "No negative reviews found";}
                                    
                                    // Adds a new card (FINALLY!!!)

                                    //console.log(data.addresses[i]);
                                    //console.log(data.names[i]);
                                    //console.log(data.websites[i]);
                                    //console.log(data.hours[i].display);
                                    let cardData = {
                                        id: i + 1,
                                        name: data.names[i],
                                        key: i + 1,
                                        image: data.photos[i],
                                        website: data.websites[i],
                                        hour: data.hours[i].display,
                                        canRender: true,
                                        removeCardCallback: { removeCard },
                                        positive: review.positive,
                                        negative: review.negative,
                                        yelpID: id
                                    };
                                    cards.push(cardData);
                                    renderCount++;
                                    forceUpdate();
                                }

                            }).catch((error) => // Handles error from the call to /reviews (Yelp Fusion)
                            {
                                console.log("YELP API ERROR!!!!!!!");
                                console.log(error);
                            });
                        }

                    }).catch((error) => // Handles error from the call to /buisnesses (Yelp Fusion)
                    {
                        console.log("YELP API ERROR!!!!!!!");
                        console.log(error);
                    });
                }
            }
            
        }).catch((error) => // Handles error from the call to /local (Taberu/FourSquare)
        {
            console.log("TABERU/FS API ERROR!!!!!!!");
            console.error(error);
        });
    }
    /*
        Below we load in the cards and return the card view.
        This can actually take about 30 seconds to load in all
        the data from the cards since we have to make so many
        API calls.... Still working on fixing that issue...

        TODO:
            Make the cards load quicker or add some kind of a loading
            screen so that way we aren't looking at nothing
            happening for almost 30 seconds.
    */
    return (
        <View style = {{height: "100%", backgroundColor: "#000000"}}>
            <ImageBackground style = {cardStyles.gradient} source = {grad}></ImageBackground>
            {
                cards.map((prop) =>
                {
                    return (
                        <Card
                            id = { prop.id }
                            name = { prop.name }
                            key = { prop.id }
                            image = { prop.image }
                            website = { prop.website }
                            hour = { prop.hour }
                            canRender = { prop.canRender }
                            removeCardCallback = { removeCard }
                            positive = { prop.positive }
                            negative = { prop.negative }
                        />
                    );
                })
            }
            <View style = {cardStyles.buttonContainer}>

                <TouchableOpacity style = {cardStyles.rightButton} onPress = {function() {handleSwipeLeft()}}>
                    <Image source = { like } style = {cardStyles.yesNoButton}/>
                </TouchableOpacity>

                <TouchableOpacity style = {cardStyles.leftButton} onPress = {function() {handleSwipeRight()}}>
                    <Image source = { dislike } style = {cardStyles.yesNoButton}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}