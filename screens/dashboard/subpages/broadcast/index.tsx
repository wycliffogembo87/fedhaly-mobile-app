import { View, Text, StyleSheet } from "react-native";
import Constants from 'expo-constants';

const paybillInstructions: string[] = [
    "Go to paybill 706915 - FEDHALY LTD",
    "For account number, enter BANK ACCOUNT of the organization, e.g NBK-01134567889704",
    "Then for amount, enter exactly Ksh. 1. \nThis is non refundable.",
    "Finally, enter your PIN and submit"
];

const BroadcastScreen = () => {
    return (
        <View style={styles.container}>
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