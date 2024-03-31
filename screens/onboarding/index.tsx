import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";


export const ClickableText: React.FC<{
    text: string,
    action: () => void
}> = ({ text, action }) => {
    return (
        <TouchableOpacity
            onPress={action}
        >
            <Text style={styles.signin_text}>{text}</Text>
        </TouchableOpacity>
    )
}

const paybillInstructions: string[] = [
    "Go to paybill 706915 - FEDHALY LTD",
    "For account number, enter the word REGISTER",
    "Then for amount, enter exactly Ksh. 1. \nThis is non refundable.",
    "Finally, enter your PIN and submit"
];

const OnboardingScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={{
                flex: 6,
                display: "flex",
                gap: 20,
            }}>
                <Text style={{
                    fontWeight: "700",
                    fontSize: 20,
                    marginTop: 20,
                    textAlign: "center"
                }}>Link Mpesa Number</Text>

                <View style={{
                    backgroundColor: "#efefef",
                    borderRadius: 5,
                    padding: 20
                }}>

                    <Text style={{
                        fontWeight: "700",
                        paddingBottom: 8
                    }}>
                        How to get mpesa payment code
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

                <TextInput
                    placeholder="Phone Number"
                    mode="outlined"
                    inputMode="tel"
                />

                <TextInput
                    placeholder="Mpesa code"
                    mode="outlined"
                />

                <View style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end"
                }}>
                    <Text style={{
                        fontSize: 12,
                        fontStyle: "italic"
                    }}>Find instructions above</Text>
                </View>
            </View>

            <Button mode="contained" style={{
                borderRadius: 10,
                backgroundColor: "blue",
                height: 50,
                display: "flex",
                justifyContent: "center"
            }} onPress={() => {
                // @ts-ignore
                navigation.navigate('dashboard', { replace: true })
            }}>
                Verify Mpesa Number
            </Button>
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
        backgroundColor: "#fff"
    },

    signin_text: {
        color: "orange"
    },

    instructions: {

    }
})

export default OnboardingScreen;