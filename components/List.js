// List.js
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function List({ isAlarmOn, onToggleAlarm, text }) {
  const handleToggleAlarm = () => {
    onToggleAlarm();
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemText}>{text}</Text>
      </View>
      <TouchableOpacity onPress={handleToggleAlarm}>
        <View style={[
          styles.container,
          isAlarmOn ? styles.alarmOnContainer : styles.alarmOffContainer
        ]}>
          <View style={[
            styles.circular,
            isAlarmOn ? styles.alarmOn : styles.alarmOff,
            isAlarmOn ? styles.slideRight : styles.slideLeft
          ]}></View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  alarmOnContainer: {
    backgroundColor: '#64CCC5',
  },
  alarmOffContainer: {
    backgroundColor: '#4D4D54',
  },
  circular: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignSelf: 'center',
    position: 'absolute',
  },
  slideLeft: {
    left: 0,
  },
  slideRight: {
    left: 30,
  },
  alarmOn: {
    backgroundColor: '#fff',
  },
  alarmOff: {
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '80%',
    color: 'white'
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  item: {
    backgroundColor: '#053B50',
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
