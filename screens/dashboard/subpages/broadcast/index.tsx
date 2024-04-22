import { View, Text, StyleSheet, ScrollView } from "react-native";
import Constants from 'expo-constants';
import React from "react";
import useWebSocket from 'react-use-websocket';

const paybillInstructions: string[] = [
    "Go to paybill 706915 - FEDHALY LTD",
    "For account number, enter BANK ACCOUNT of the organization, e.g NBK-01134567889704",
    "Then for amount, enter exactly Ksh. 1. \nThis is non refundable.",
    "Finally, enter your PIN and submit"
];

interface IBroadcastMessage {
    balance: string
    trans_id: string
    first_name: string
    other_names: string
    airtime_amount: string
    bank_code: string
    bank_name: string
    commission: string
}

const BroadcastMessageView: React.FC<IBroadcastMessage> = (message) => {
    return (
        <View>
            <Text>{message.airtime_amount} has been deposited to {message.bank_name} by {[message.first_name, message.other_names].filter(u => u).join(' ')}</Text>
        </View>
    )
}

const MessageBroadcast: React.FC<{
    channel: string
}> = ({ channel }) => {
    const [broadcastedMessages, setBroadcastedMessages] = React.useState<IBroadcastMessage[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    // TODO: add .env keys later
    const { lastMessage } = useWebSocket(`wss://fedhaly-airtime.fly.dev/topup_broadcast/${channel}/websocket`, {
        shouldReconnect: event => true,
        reconnectInterval: 30000, // to avoid timeouts
        queryParams: {
            authToken: '' // we will get the token later
        },
        onError: error => {
            // @ts-ignore
            setError(error.message)
        }
    });

    // we are only interested in getting messages | not sending them
    React.useEffect(() => {
        if (lastMessage !== null) {
            // the message is base64 encoded, we need to decode it
            setBroadcastedMessages(
                old => [...old, JSON.parse(atob(lastMessage.data)) as IBroadcastMessage]
            );
        }
    }, [lastMessage]);


    return (
        // now show the messages
        <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
            {
                broadcastedMessages.map((message, position) => {
                    return <BroadcastMessageView key={position} {...message}/>
                })
            }
        </ScrollView>
    )
}

const NoBroadcastMessages = () => {
    return (
        <>
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
        </>
    )
}

const BroadcastScreen = () => {
    return (
        <View style={styles.container}>
            <View style={{
                backgroundColor: "#efefef",
                borderRadius: 5,
                padding: 20
            }}>
                {/* <NoBroadcastMessages/> */}
                <MessageBroadcast channel="254728043275"/>
            </View>
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

        justifyContent: "center"
    },

    signin_text: {
        color: "orange"
    },

    instructions: {

    }
})

export default BroadcastScreen;