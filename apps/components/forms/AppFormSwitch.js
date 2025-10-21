import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useFormikContext } from 'formik';
import colors from '../../config/colors';

const AppFormSwitch = ({ name, label, style }) => {
  const { values, setFieldValue } = useFormikContext();
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={!!values[name]}
        onValueChange={value => setFieldValue(name, value)}
        trackColor={{ false: '#ccc', true: colors.primary }}
        thumbColor={values[name] ? colors.primary : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: colors.dark,
    fontWeight: '500',
  },
});

export default AppFormSwitch;
