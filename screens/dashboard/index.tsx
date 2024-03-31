import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import BroadcastScreen from './subpages/broadcast';
import HelpScreen from './subpages/help';
import PaymentScreen from './subpages/payments';
import SettingsScreen from './subpages/settings';


const DashboardScreen = () => {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'broadcast', title: 'Broadcast', focusedIcon: 'broadcast' },
        { key: 'help', title: 'Help', focusedIcon: 'help-circle', unfocusedIcon: 'help-circle-outline' },
        { key: 'payments', title: 'My Payments', focusedIcon: 'clipboard-list', unfocusedIcon: 'clipboard-list-outline' },
        { key: 'settings', title: 'Settings', focusedIcon: 'account-cog', unfocusedIcon: 'account-cog-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        broadcast: BroadcastScreen,
        help: HelpScreen,
        payments: PaymentScreen,
        settings: SettingsScreen,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}

export default DashboardScreen;