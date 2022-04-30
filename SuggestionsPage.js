import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, Pressable, Text, View, Image, FlatList, ImageBackground } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { getLastCards } from "./global.js";

import SuggestionGradient from "./assets/backgroundGradient.jpg"
import ImageNotFound from "./assets/imageNotFound.jpeg"

const grad = Image.resolveAssetSource(SuggestionGradient);
const imageNotFound = Image.resolveAssetSource(ImageNotFound);


const copyToClipboard = (name) => {
    Clipboard.setString(name)
    alert("Copied: " + name);
}


const Suggestion = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={{ flex: 1, marginBottom: "65%" }}>
            <View style={suggestionsStyle.suggestion}>
                <Image source={{ uri: props.image }} style={suggestionsStyle.image} />
                <View style={suggestionsStyle.suggestionInfo}>
                    <View style=
                        {
                            {
                                position: "relative",
                                backgroundColor: "#FFFFFF",
                                left: "2.5%",
                                top: "10%",
                                borderRadius: 20,
                                width: "95%",
                                height: "20%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#F45B69DD",
                                borderWidth: 2
                            }
                        }>

                        <Text>{props.name}</Text>
                    </View>

                    <View style=
                        {
                            {
                                position: "relative",
                                backgroundColor: "#FFFFFF",
                                left: "2.5%",
                                top: "27.5%",
                                borderRadius: 20,
                                width: "95%",
                                height: "20%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#F45B69DD",
                                borderWidth: 2
                            }
                        }>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={suggestionsStyle.centerModal}>
                                <View style={suggestionsStyle.modalBackground}>
                                    <Text style={suggestionsStyle.modalText}> {props.hour} </Text>
                                    <Pressable
                                        style={[suggestionsStyle.button, suggestionsStyle.buttonClose]}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={suggestionsStyle.buttonCloseText}>Hide Hours</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                        <Pressable
                            style={[suggestionsStyle.button, suggestionsStyle.buttonOpen]}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text>View Hours</Text>
                        </Pressable>
                    </View>

                    <View style=
                        {
                            {
                                position: "relative",
                                backgroundColor: "#FFFFFF",
                                left: "2.5%",
                                top: "45%",
                                borderRadius: 20,
                                width: "95%",
                                height: "20%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: "#F45B69DD",
                                borderWidth: 2
                            }
                        }>
                        <Text onPress={() => { copyToClipboard(props.realAddress); }}>
                            {props.realAddress}

                        </Text>
                    </View>
                </View>

                <View style=
                    {
                        {
                            position: "relative",
                            width: "35%",
                            height: "15%",
                            left: "5%",
                            top: "-57.5%",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 20,
                            backgroundColor: "#FFFFFFBB",
                            borderColor: "#F45B69DD",
                            borderWidth: 2
                        }
                    }>
                    <Text onPress=
                        {
                            () => props.website != undefined ? Linking.openURL(props.website) : ""
                        }
                    >

                        Visit Site
                    </Text>
                </View>
            </View>
        </View>
    );
}

export function suggestionsPage() {
    // TODO: Load in suggestions from back end
    const [suggestions, setSuggestions] = useState([]);
    const [isRefreshing, setRefreshingStatus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    //let suggestions = getLastCards();

    useEffect(() => {
        setSuggestions(getLastCards());
    });

    function getCardData() {
        setSuggestions(getLastCards());
        setRefreshingStatus(false);
    }

    function onRefresh() {
        setRefreshingStatus(true);
        getCardData();
    }


    /*
        Below are the examples of what it looked like before I changed it to load in
        data from the cards
    */
    /*
    let suggestions = [
        {
            id: 0,
            name: "Lazo Empanadas",
            image: lazos,
            opens: "10:00am",
            closes: "8:00pm",
            address: "303 16th St Mall, Denver, CO 80202",
            url: "https://www.lazoempanadas.com/"
        },

        {
            id: 1,
            name: "Liang's Thai Food",
            image: thai,
            opens: "11:00am",
            closes: "7:00pm",
            address: "California St &, 16th St Mall, Denver, CO 80202"
        },
        {id: 2, name: "Suggestion 3"},
        {id: 3, name: "Suggestion 4"},
        {id: 4, name: "Suggestion 5"},
        {id: 5, name: "Suggestion 6"},
        {id: 6, name: "Suggestion 7"},
        {id: 7, name: "Suggestion 8"},
        {id: 8, name: "Suggestion 9"},
        {id: 9, name: "Suggestion 10"},
    ];
    */

    let processedSuggestions = [];
    for (let index = 0; index < suggestions.length; index++) {
        let _id = suggestions[index].id;
        let _name = suggestions[index].name;
        let _image = suggestions[index].image;
        let _hour = suggestions[index].hour;
        let _address = suggestions[index].address;
        let _realAddress = suggestions[index].realAddress;
        let _url = suggestions[index].url;
        let _website = suggestions[index].website;

        //console.log(suggestions[index].name);
        //console.log(suggestions[index].address);
        //console.log(suggestions[index].realAddress);
        if (_address != undefined) {
            if (_address.length > 20) {
                _address = "Copy Address";
            }
        }

        processedSuggestions.push({
            id: _id,
            name: _name,
            image: _image,
            hour: _hour,
            address: _address,
            realAddress: _realAddress,
            url: _url,
            website: _website
        });
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <ImageBackground style={suggestionsStyle.gradient} source={grad}></ImageBackground>
            <View style={suggestionsStyle.header}>
                <Text style={suggestionsStyle.headerText}>Suggestions</Text>
            </View>


            <View style={{ flex: 1, top: "5%" }}>
                <FlatList
                    style={{ zIndex: 1 }}
                    data={processedSuggestions}
                    keyExtractor={({ id }) => id}
                    onRefresh={() => onRefresh()}
                    refreshing={isRefreshing}
                    renderItem={({ item }) =>
                        <Suggestion
                            name=
                            {
                                item.name != undefined ? item.name : "N/A"
                            }

                            image=
                            {
                                item.image != undefined ? item.image : imageNotFound
                            }

                            hour=
                            {
                                item.hour != undefined ? item.hour : "N/A"
                            }

                            address=
                            {
                                item.address != undefined ? item.address : "N/A"
                            }

                            website=
                            {
                                item.website
                            }

                            realAddress=
                            {
                                item.realAddress != undefined ? item.realAddress : ""
                            }
                        />
                    }
                />
            </View>
        </View>
    );
}

const suggestionsStyle = StyleSheet.create(
    {
        gradient:
        {
            position: "absolute",
            top: "15%",
            flex: 1,
            width: "100%",
            height: "100%",
            zIndex: 0
        },

        master:
        {
            flex: 1,
            width: "100%"
        },

        header:
        {
            top: "5%",
            width: "100%",
            height: "10%",
            justifyContent: "center",
            alignItems: "center"
        },

        headerText:
        {
            fontSize: 25,
            fontWeight: "bold"
        },

        scroll:
        {
            height: "100%",
            width: "100%"
        },

        suggestion:
        {
            left: "2.5%",
            width: "95%",
            height: "300%",
            maxHeight: "300%",
            marginTop: "5%",
            backgroundColor: "#ebebeb",
            borderRadius: 20,
            marginTop: "3%",
            borderColor: "#F45B69DD",
            borderWidth: 5
        },

        suggestionInfo:
        {
            position: "relative",
            left: "50%",
            top: "-46.5%",
            width: "45%",
            height: "75%"
        },

        image:
        {
            position: "relative",
            left: "5%",
            top: "10%",
            width: "40%",
            height: "50%",
            borderRadius: 20,
            borderColor: "black",
            borderWidth: 1
        },

        centerModal: 
        {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },

        modalBackground: 
        {
            margin: 20,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
        },

        button: 
        {
            borderRadius: 12,
            padding: 10,
            elevation: 2
        },

        buttonOpen: 
        {
            backgroundColor: "coral",
        },

        buttonClose: 
        {
            backgroundColor: "red",
        },

        buttonCloseText: 
        {
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        },

        modalText: 
        {
            marginBottom: 15,
            textAlign: "center"
        }
    });