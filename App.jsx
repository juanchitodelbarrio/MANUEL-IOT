import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import  {Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'
import { I18n } from 'aws-amplify';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View } from 'react-native';


I18n.setLanguage('es');


Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    //identityPoolId: 'us-east-2:20c0de2b-4680-47b6-bbd7-aafc068874d7',
    region: 'us-east-2',
    userPoolId: 'us-east-2_vpbas54w2',
    userPoolWebClientId: '690d0u2p928c22e7s7q1hsdst7',
    authenticationFlowType: 'USER_SRP_AUTH',
    /*mandatorySignIn : true*/
  },
  API:{
    graphql_endpoint: 'https://rwzrgla3zzf2pofknokucbrdtm.appsync-api.us-east-2.amazonaws.com/graphql',
    region: 'us-east-2',
    authenticationType: 'AWS_IAM',
    graphql_headers: async () => ({
      'x-api-key': 'da2-hzvwbl2ovzbflprvejzip5pwym'
    })
}
})


const currentConfig = Auth.configure();



function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (

      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>

      
  
    );
  }
}

export default withAuthenticator(App)
