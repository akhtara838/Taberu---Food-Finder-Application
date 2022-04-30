import React, { Component } from "react";
import { StyleSheet, Modal, Pressable, TouchableHighlight, Text, View, Image, Animated, PanResponder, Dimensions } from "react-native";
import { addToLastCards } from "./global.js"

export class Card extends Component {
    toggleModal(visible) {
        this.setState({ modalVisible: visible });
    }
    toggleModal2(visible) {
        this.setState({ modalVisibleNegative: visible });
    }
    constructor(props) {
        super();
        this.state =
        {
            id: props.id,
            modalVisible: false,
            modalVisibleNegative: false,
            pan: new Animated.ValueXY(),
            image: props.image,
            name: props.name,
            website: props.website,
            hour: props.hour,
            positive: props.positive,
            negative: props.negative,
            canRender: props.canRender,
            removeCard: props.removeCardCallback,
            currentCardIndex: 0
        };

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null,
                {
                    dx: this.state.pan.x,
                    dy: this.state.pan.y
                }], { useNativeDriver: false }),
            onPanResponderRelease: (e, gesture) => {
                const width = Dimensions.get('window').width;
                const half = width / 2.0;
                const thresh = 1.25;

                const x = this.state.pan.__getValue().x;

                if (x > thresh * half) {
                    this.handleSwipeRight();
                    if (this.state.id > 0) {
                        this.setState({ canRender: false });
                        this.state.removeCard(this.state.id);
                    }
                }
                if (x < -thresh * half) {
                    this.handleSwipeLeft();
                    if (this.state.id > 0) {
                        this.setState({ canRender: false });
                        this.state.removeCard(this.state.id);
                    }
                }

                this.state.pan.setValue({ x: 0, y: 0 })
            }
        });

    }

    handleSwipeRight() {
        // TODO: Send stuff to server about liking this place

        /*
            id: 0,
            name: "Lazo Empanadas",
            image: lazos,
            opens: "10:00am",
            closes: "8:00pm",
            address: "303 16th St Mall, Denver, CO 80202",
            url: "https://www.lazoempanadas.com/"
        */


        // TODO: Add in more fields that we can parse from the state
        let cardData =
        {
            id: this.state.id,
            name: this.state.name,
            image: this.state.image,
            website: this.state.website,
            hour: this.state.hour
        };

        addToLastCards(cardData);
    }

    handleSwipeLeft() {
        // TODO: Send stuff to server about disliking this place
    }

    render() {
        var panStyle =
        {
            transform: [{ translateX: this.state.pan.x }, { translateY: 0 }]
        };

        if (this.state.canRender == true) {
            return (

                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[panStyle, cardStyles.cardMaster]}
                >
                    <View style={cardStyles.container}>
                        <View style={cardStyles.imagePreview}>
                            <Image source={{ uri: this.state.image }} style={cardStyles.image} />
                        </View>

                        <View style={cardStyles.title}>
                            <Text style={cardStyles.titleText}>{this.state.name}</Text>
                        </View>

                        <View style={cardStyles.reviewContainer}>
                            <View style={cardStyles.positiveReview}>
                                <Modal animationType={"slide"} transparent={true}
                                    visible={this.state.modalVisible}
                                    onRequestClose={() => { console.log("Modal has been closed.") }}>

                                    <View style={cardStyles.centerModal}>
                                        <View style={cardStyles.modalBackground}>
                                            <Text style={cardStyles.modalText}> {this.state.positive}</Text>

                                            <Pressable onPress={() => {
                                                this.toggleModal(!this.state.modalVisible)
                                            }}
                                                style={[cardStyles.button, cardStyles.buttonCloseforPositive]}
                                            >

                                                <Text style={cardStyles.buttonCloseText}>Close Review</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>

                                <Pressable onPress={() => { this.toggleModal(true) }}
                                    style={[cardStyles.button, cardStyles.buttonOpenforPositive]}>
                                    <Text>Click for Positive Review</Text>
                                </Pressable>
                            </View>

                            <View style={cardStyles.negativeReview}>

                                <Modal animationType={"slide"} transparent={true}
                                    visible={this.state.modalVisibleNegative}
                                    onRequestClose={() => { console.log("Modal has been closed.") }}>

                                    <View style={cardStyles.centerModal}>
                                        <View style={cardStyles.modalBackground}>
                                            <Text style={cardStyles.modalText}> {this.state.negative}</Text>

                                            <Pressable onPress={() => {
                                                this.toggleModal2(!this.state.modalVisibleNegative)
                                            }}
                                                style={[cardStyles.button, cardStyles.buttonCloseforNegative]}
                                            >

                                                <Text style={cardStyles.buttonCloseText}>Close Review</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </Modal>

                                <Pressable onPress={() => { this.toggleModal2(true) }}
                                    style={[cardStyles.button, cardStyles.buttonOpenforNegative]}>
                                    <Text>Click for Negative Review</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            );
        }
        else {
            return null;
        }
    }
}

const cardStyles = StyleSheet.create(
    {
        cardMaster:
        {
            left: "0%",
            position: "absolute",
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        },

        swipeable:
        {
            width: "100%",
            height: "100%",
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },

        container:
        {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#EBEBEB",
            borderColor: "#F45B69DD",
            borderWidth: 5,
            width: "95%",
            height: "75%",
            top: "10%",
            borderRadius: 10
        },

        imagePreview:
        {
            justifyContent: "center",
            alignItems: "center",
            width: "95%",
            height: "65%",
            top: "20%",
            left: "0%",
            borderRadius: 10
        },

        image:
        {
            top: "25%",
            width: "95%",
            height: "80%",
            justifyContent: "center",
            borderRadius: 10
        },

        title:
        {
            left: "2.5%",
            top: "-5%",
            width: "95%",
            height: "80%",
            justifyContent: "center",
            borderRadius: 10
        },

        titleText:
        {
            fontSize: 25,
            fontWeight: "bold"
        },

        reviewContainer:
        {
            left: "0%",
            top: "-41.5%",
            width: "95%",
            height: "35%",
            borderRadius: 10,
            backgroundColor: "#EBEBEB"
        },

        positiveReview:
        {
            position: "relative",
            left: "2.5%",
            top: "5%",
            width: "95%",
            height: "42%",
            backgroundColor: "#c5e9d7",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
        },

        negativeReview:
        {
            position: "relative",
            left: "2.5%",
            top: "15%",
            width: "95%",
            height: "42%",
            backgroundColor: "#fcd5c9",
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
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

        buttonOpenforPositive:
        {
            backgroundColor: "#4CBB17",
        },

        buttonCloseforPositive:
        {
            backgroundColor: "#00A36C",
        },
        buttonOpenforNegative:
        {
            backgroundColor: "#F78F79",
        },

        buttonCloseforNegative:
        {
            backgroundColor: "#E06B52",
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