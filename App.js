import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthNavigator from './apps/navigation/AuthNavigator';
import AppNavigator from './apps/navigation/AppNavigator';
import navigationTheme from './apps/navigation/navigationTheme';
import OfflineNotice from './apps/components/OfflineNotice';
import AuthContext from './apps/auth/context';
import authStorage from './apps/auth/storage';
import authApi from './apps/api/auth';

// Remove or comment out this line - it's calling login immediately when app loads
// authApi.login('admin', 'password');

export default function App() {
  const [user, setUser] = useState();

  const restoreUser = async() => {
    const user = await authStorage.getUser();
    if (user) 
      setUser(user);
  }

  useEffect(() => {
    restoreUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthContext.Provider value={{ user, setUser }}>
        <OfflineNotice />
        <NavigationContainer theme={navigationTheme}>
          {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}