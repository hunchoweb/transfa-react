import React, { useCallback } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import AuthSuccess from '@/components/source-auth/auth-success';
import { AppStackParamList } from '@/navigation/AppStack';

type Navigation = NativeStackNavigationProp<AppStackParamList, 'PinSetupSuccess'>;

const PinSetupSuccessScreen = () => {
  const navigation = useNavigation<Navigation>();

  const goHome = useCallback(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AppTabs' }],
      })
    );
  }, [navigation]);

  return <AuthSuccess title="Success!" subtitle="PIN created successfully." onComplete={goHome} />;
};

export default PinSetupSuccessScreen;
