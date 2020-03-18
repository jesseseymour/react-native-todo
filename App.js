import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import data from "./data.json";
import Task from "./Task";

const App = () => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(Date.now());
  const [todos, setTodos] = useState([...data.tasks]);

  useEffect(() => {
    async function storeInitialData() {
      await AsyncStorage.multiSet([["tasks", JSON.stringify(todos)], ["init", "true"]]);
    }
    checkInitialLoad().then(loaded => {
      if(!loaded) {
        storeInitialData().then(getData());
      }else{
        getAllData().then(data => console.log(data));
      }
    });
    
  });

  const checkInitialLoad = async () => {
    const value = await AsyncStorage.getItem("init");
    return value ? true : false;
  };

  const getData = async () => {
    const value = await AsyncStorage.getItem("tasks");
    //value && console.log(value)
  };

  const getAllData = async () => {
    const value = await AsyncStorage.getAllKeys();
    return value;
  };

  const handleAddTodo = () => {
    if (value.length > 0) {
      setTodos([...todos, { text: value, key: Date.now(), checked: false }]);
      setValue("");
    }
  };

  const handleDeleteTodo = id => {
    setTodos(todos.filter(task => task.key !== id));
  };

  const handleCheck = id => {
    setTodos(
      todos.map(task =>
        task.key === id
          ? {
              ...task,
              checked: !task.checked
            }
          : task
      )
    );
  };

  const handleDateChange = (direction = 0, timestamp = null) => {
    const dateObj = new Date(date);
    setDate(dateObj.setDate(dateObj.getDate() + direction));
  };

  const getTodoList = () => {
    const dateString = new Date(date).toDateString();
    const filteredList = todos.filter(
      todo => new Date(todo.timestamp).toDateString() === dateString
    );

    return filteredList.map(task => (
      <Task
        text={task.text}
        key={task.key}
        checked={task.checked}
        delete={() => handleDeleteTodo(task.key)}
        check={() => handleCheck(task.key)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="chevrons-left"
          size={30}
          color="#900"
          onPress={() => handleDateChange(-1)}
        />
        <Text style={{ fontSize: 16, color: "white" }}>Today</Text>
        <Icon
          name="chevrons-right"
          size={30}
          color="#900"
          onPress={() => handleDateChange(1)}
        />
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder={"What do you need to do?"}
          placeholderTextColor="white"
          onChangeText={value => setValue(value)}
          value={value}
        />
        <TouchableOpacity onPress={() => handleAddTodo()}>
          <Icon name="plus" size={30} color="#900" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: "100%" }}>{getTodoList()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "15%"
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    borderColor: "rgb(222,222,222)",
    borderBottomWidth: 1,
    paddingRight: 10,
    paddingBottom: 5
  },
  textInput: {
    // height: 20,
    flex: 1,
    minHeight: 20,
    // marginTop: "5%",
    // padding: 0,
    fontSize: 20,
    // fontWeight: "bold",
    color: "white"
    // paddingLeft: 10
  },
  header: {
    display: "flex",
    flexDirection: "row"
  }
});

export default App;
