import { View, Text, StyleSheet, ScrollView } from "react-native";
import Constants from 'expo-constants';
import React from "react";
import useWebSocket from 'react-use-websocket';
import {decode as atob, encode as btoa} from 'base-64';

const paybillInstructions: string[] = [
    "Go to paybill 706915 - FEDHALY LTD",
    "For account number, enter BANK ACCOUNT of the organization, e.g NBK-01134567889704",
    "Then for amount, enter exactly Ksh. 1. \nThis is non refundable.",
    "Finally, enter your PIN and submit"
];

function parse_date_timestamp(time: string): Date {
    const year = parseInt(time.substr(0, 4), 10);
    const month = parseInt(time.substr(4, 2), 10) - 1; // Months are 0-indexed in JavaScript
    const day = parseInt(time.substr(6, 2), 10);
    const hour = parseInt(time.substr(8, 2), 10);
    const minute = parseInt(time.substr(10, 2), 10);
    const second = parseInt(time.substr(12, 2), 10);

    return new Date(year, month, day, hour, minute, second);
}

interface IBroadcastMessage {
    balance: string
    trans_id: string
    first_name: string
    other_names: string
    trans_time: string
    account_number: string
    airtime_amount: string
    bank_code: string
    bank_name: string
    commission: string
}

enum ErrorTypes {
    NOT_SUBSCRIBED = 1,
    BASE_WEBSOCKET_ERROR = 2
}

interface IBroadcastMessageError {
    message: string;
    errorType: ErrorTypes;
}

const BroadcastMessageView: React.FC<IBroadcastMessage> = (message) => {
    return (
        <View style={{
            padding: 10,
            backgroundColor: "#efefef",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 10
        }}>
            <Text>{parse_date_timestamp(message.trans_time).toLocaleDateString()}</Text>
            <Text>{[message.first_name, message.other_names].filter(u => u).join(' ')} has contributed Ksh. {message.airtime_amount}</Text>
            <Text>The new balance is Ksh. {message.balance}</Text>
            <Text>Mpesa Transaction ID: {message.trans_id}</Text>
            <Text>Bank Account Number: {message.account_number}</Text>
            <Text>Bank Name: {message.bank_name}</Text>
        </View>
    )
}

const NoBroadcastMessages = () => {
    return (
        <View style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}>
            <View style={{
                backgroundColor: "#efefef",
                borderRadius: 5,
                padding: 20
            }}>
                <Text style={{
                    fontWeight: "700",
                    paddingBottom: 8
                }}>
                    How to join an account
                </Text>

                {
                    paybillInstructions.map((instruction, position) => {
                        return (
                            <View >
                                <Text style={{
                                    fontWeight: "700"
                                }}>
                                    Step {position + 1}
                                </Text>
                                <Text key={position} style={{
                                    paddingVertical: 5
                                }}>
                                    {instruction}
                                </Text>
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}

const MessageBroadcast: React.FC<{
    channel: string
}> = ({ channel }) => {
    const [broadcastedMessages, setBroadcastedMessages] = React.useState<IBroadcastMessage[]>([]);
    const [error, setError] = React.useState<IBroadcastMessageError | null>(null);

    // TODO: add .env keys later
    const { lastMessage } = useWebSocket(`wss://fedhaly-airtime.fly.dev/topup_broadcast/${channel}/websocket`, {
        shouldReconnect: event => true,
        reconnectInterval: 5000, // to avoid timeouts

        onError: error => {
            setError({
                errorType: ErrorTypes.BASE_WEBSOCKET_ERROR,

                // @ts-ignore
                message: error.message
            })
        }
    });

    // we are only interested in getting messages | not sending them
    React.useEffect(() => {
        if (lastMessage !== null) {
            // the message is base64 encoded, we need to decode it
            const parsed_response = JSON.parse(atob(lastMessage.data));

            if ('errorType' in parsed_response) {
                setError(parsed_response as IBroadcastMessageError)
            } else {
                setBroadcastedMessages(
                    old => [...old, parsed_response as IBroadcastMessage]
                );
            }
        }
    }, [lastMessage]);


    return (
        // now show the messages
        <>
            {
                error && error.errorType === ErrorTypes.NOT_SUBSCRIBED ? <NoBroadcastMessages/> : <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{
                        height: "100%",
                        backgroundColor: "transparent"
                    }}
                >
                    {
                        broadcastedMessages.map((message, position) => {
                            return <BroadcastMessageView key={position} {...message}/>
                        })
                    }
                </ScrollView>
            }
        </>
    )
}

const BroadcastScreen = () => {
    return (
        <View style={styles.container}>
            <View style={{
                height: 80,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#d3d3d3",
                borderRadius: 5
            }}>
                <Text style={{
                    fontSize: 32,
                    fontWeight: "bold"
                }}>Ksh. 600</Text>
            </View>
            <MessageBroadcast channel="254728043275"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        gap: 20,
        padding: 10,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#fff",

        // justifyContent: "center"
    },

    signin_text: {
        color: "orange"
    },

    instructions: {

    }
})

export default BroadcastScreen;