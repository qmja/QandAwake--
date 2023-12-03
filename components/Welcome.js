import React, { useState, useEffect } from "react";
import { StyleSheet, Modal, Text, View, Switch, ScrollView, Pressable, Alert, TouchableWithoutFeedback, TouchableOpacity, Dimensions } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Calendar from 'expo-calendar';
import AlertMessage from "./alert/AlertMessage";
import Parse from 'parse/react-native';

export default function Welcome({ navigation }) {
  const screenWidth = Dimensions.get('window').width;
  const automaticPadding = screenWidth * 0.35; // Adjust the percentage as needed

  const [alarms, setAlarms] = useState([]);
  const [isAlarmOn, setIsAlarmOn] = useState(false);  
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const showTimePicker = () => setTimePickerVisible(true);

  const hideTimePicker = () => setTimePickerVisible(false);

  const handleTimeConfirm = async (time) => {
    setSelectedTime(time);
    const eventId = await addAlarmToCalendar(time); 
    addAlarm(time, eventId);
    hideTimePicker();
  };

  useEffect(() => {
    // Load alarms from the calendar on component mount
    loadAlarmsFromCalendar();
  }, []);

  // Function to add alarm to Calendar
  const addAlarmToCalendar = async (time) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Calendar permission not granted');
      return null;
    }

    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendar = calendars.find(cal => cal.isPrimary);

    const details = {
      title: 'Alarm',
      startDate: time,
      endDate: time,
      timeZone: 'GMT',
      alarms: [{ relativeOffset: 0 }],
      calendarId: defaultCalendar.id,
    };

    const eventId = await Calendar.createEventAsync(defaultCalendar.id, details);
    return eventId;
  };

  // Function to load alarms from Calendar
  const loadAlarmsFromCalendar = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Calendar permission not granted');
      return;
    }

    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendar = calendars.find(cal => cal.isPrimary);

    const events = await Calendar.getEventsAsync([defaultCalendar.id], new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Load events for the next 30 days

    const loadedAlarms = events.map(event => ({
      id: event.id,
      time: new Date(event.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOn: true, // Since we are loading events, assume alarms are ON
    }));

    setAlarms(loadedAlarms);
  };

  // Function to delete alarm from Calendar
  const deleteAlarmFromCalendar = async (eventId) => {
    await Calendar.deleteEventAsync(eventId, { futureEvents: false });
  };

  // Delete alarm when user confirms deletion
  const confirmDeleteAlarm = (alarmId, eventId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this alarm?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // Remove the alarm from state and call the delete function
            const updatedAlarms = alarms.filter(alarm => alarm.id !== alarmId);
            setAlarms(updatedAlarms);
            deleteAlarmFromCalendar(eventId);
          },
        },
      ],
      { cancelable: false },
    );
  };

  // Function to add alarm to Backend
  const addAlarmToBackend = (time, isOn) => {
    if (time) {
      const Alarm = new Parse.Object("Alarm");
      Alarm.set("userId", Parse.User.current());
      Alarm.set("time", time);
      Alarm.set("isOn", isOn);
      Alarm.save().then(alarm => {
        // If successful, update state with new alarm
        setAlarms([...alarms, {
          id: alarm.id,
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOn: isOn,
        }]);
        Alert.alert('Success', 'Alarm has been set.');
      }).catch(error => {
        console.error('Error saving alarm', error);
      });
    }
  };

  // Add alarm when a time is picked in DateTimePicker
  const addAlarm = (time, eventId) => {
    const isAlarmOn = true; // by default when adding an alarm, we can set it to be ON
    addAlarmToBackend(time, isAlarmOn);
  };

  const toggleAlarm = (index) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[index].isOn = !updatedAlarms[index].isOn;
    setAlarms(updatedAlarms);
  };

  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);

  const closeModal = () => {
    setModal1Visible(false);
    setModal2Visible(false);
  };

  const okmodal = () => {
    Alert.alert('Alarm Saved', 'Changes have been saved successfully.');
    setModal2Visible(false);
  };

  const handleContinue = () => {
    setModal2Visible(false);
  };

  const handleCancel = () => {
    console.log('Canceled...');
  };

  const onPressButton = () => {
    AlertMessage(handleContinue, handleCancel);
  };

  return (
    <View style={styles.container}>
      <Modal // modal 1: for settings and view analytics
        animationType="none"
        transparent={true}
        visible={modal1Visible}
        onRequestClose={() => {
          setModal1Visible(!modal1Visible);
        }}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate("Settings")}>
                <Text style={styles.textStyle}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button1]}
                onPress={() => navigation.navigate("Analytics")}>
                <Text style={styles.textStyle}>View Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <Modal // modal 2: to modify alarm and questionnaires -------------------------------------
        animationType="none"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => {
          setModal2Visible(!modal2Visible);
        }}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView2}>
            <View style={styles.modalView2}>
              <TouchableOpacity>
              {alarms.map((alarm, index) => (
          <View key={index} style={styles.alarmItem2}>
            <Text style={styles.alarmTime2}>{alarm.time}</Text>
          </View>
        ))}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button2]}
                onPress={() => navigation.navigate("Questions")}>
                <Text style={styles.textStyle2}>Add a Question</Text>
              </TouchableOpacity>
              <View style={styles.view}>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={onPressButton}>
                <Text style={styles.textStyle2}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.okButton]}
                onPress={okmodal}>
                <Text style={styles.textStyle2}>OK</Text>
              </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <View style={styles.option}>
        <TouchableOpacity onPress={() => setModal1Visible(!modal1Visible)}>
          <Icon name="menu" style={[styles.menuIcon, { paddingLeft: automaticPadding }]} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Alarm</Text>
      <ScrollView style={styles.alarmsContainer}>
        {alarms.map((alarm, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setModal2Visible(!modal2Visible)}
            onLongPress={() => confirmDeleteAlarm(alarm.id)} // Add this line
          >
            <View style={styles.alarmItem}>
              <Text style={styles.alarmTime}>{alarm.time}</Text>
              <Switch
                value={alarm.isOn}
                onValueChange={() => toggleAlarm(index)}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Pressable style={styles.addAlarmContainer} onPress={showTimePicker}>
        <Icon name="add" style={styles.addIcon} />
      </Pressable>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#485613",
    padding: 20,
  },
  view:{
    flexDirection: 'row',
    paddingLeft: 120,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  alarmsContainer: {
    flex: 1,
    backgroundColor: '#788F25',
    borderRadius: 20
  },

  alarmItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#b07c3b",
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginVertical: 5,
    marginHorizontal: 10
  },

  alarmTime: {
    fontSize: 24,
    color: "white",
  },

  alarmItem2: { // for modal 2222222222222222222222222222222222222222222222
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginVertical: 5,
    marginHorizontal: 10
  },

  alarmTime2: { // for modal 2222222222222222222222222222222222222222222222
    fontSize: 60,
    color: "#6b4406",
    fontWeight: "bold",
  },

  addAlarmContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    width: 50, 
    height: 50, 
    borderRadius: 50, 
    backgroundColor: "#b07c3b"
  },

  addIcon: {
    fontSize: 30,
    color: "black",
  },

  centeredView: {
    flex: 1,
    paddingLeft: 85,
        paddingTop:  80,
    alignItems: 'center',
    marginTop: 30,
  },
  centeredView2: { // for modal 2222222222222222222222222222222222222222222222
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  modalView: {
    margin: 20,
    justifyContent: "space-between",
    borderRadius: 20,
    padding:15,
    alignItems: 'center',
  },
  modalView2: { // for modal 2222222222222222222222222222222222222222222222
  margin: 20,
  width: 380,
  height: 550,
  marginTop: 170,
  backgroundColor: '#fff8d6',
  justifyContent: "space-between",
  borderRadius: 20,
  padding:15,
  alignItems: 'center',
  },
  button: {
    backgroundColor: "#fff8d6",
    paddingVertical: 10,
    paddingHorizontal: 30,
    paddingLeft: 10,
    borderColor: '#fff8d6',
    borderRadius: 15,
    paddingRight: 160,
    borderWidth:2,
    marginTop: 5,
  },
  cancelButton: {// for modal 2222222222222222222222222222222222222222222222
    backgroundColor: "#6b4406",
    paddingVertical: 10,
    width: 110,
    paddingHorizontal: 30,
    borderColor: '#fff8d6',
    borderRadius: 15,
    borderWidth:2,
    alignItems: 'center',
    marginTop: 5,
  },
  okButton: {// for modal 2222222222222222222222222222222222222222222222
    backgroundColor: "#b07c3b",
    paddingVertical: 10,
    width: 110,
    paddingHorizontal: 30,
    borderColor: '#fff8d6',
    borderRadius: 15,
    borderWidth:2,
    alignItems: 'center',
    marginTop: 5,
  },
  button1: {
    backgroundColor: "#fff8d6",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderColor: '#fff8d6',
    borderRadius: 15,
    borderWidth:2,
    paddingLeft: 10,
    paddingRight: 120,
    marginTop: 5,
  },
  button2: {// for modal 2222222222222222222222222222222222222222222222
    backgroundColor: "#788f25",
    paddingVertical: 10,
    width: 220,
    paddingHorizontal: 30,
    borderColor: '#fff8d6',
    borderRadius: 15,
    borderWidth:2,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonOpen: {
    color: '#fff8d6',
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    color: '#fff8d6',
    backgroundColor: '#2196F3',
  },
  textStyle2: { // for modal 2222222222222222222222222222222222222222222222
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  option: {
    paddingLeft: 150,
    flexDirection: "row",
  },
  optionStyle: {
    paddingLeft: 120,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  menuIcon: {
    fontSize: 40,
    color: "white",
  
  },
});
