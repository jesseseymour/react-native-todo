import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import DraggableFlatList from "react-native-draggable-flatlist";
import Icon from "react-native-vector-icons/Feather";
import Task from "./Task";
import TaskObject from "./TaskObject";

const App = () => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(Date.now());
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    getTasks()
      .then(data => JSON.parse(data))
      .then(json => {
        if (json) setTodos([...json]);
      });
  }, []);

  useEffect(() => {
    storeTasks(todos);
  }, [todos]);
  const getTasks = async () => {
    const data = await AsyncStorage.getItem("tasks");
    return data;
  };

  const storeTasks = async tasks => {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const handleAddTodo = () => {
    if (value.length > 0) {
      const tasks = [
        ...todos,
        new TaskObject({ text: value, timestamp: date })
      ];
      storeTasks(tasks).then(() => {
      setTodos(tasks);
      setValue("");
    }
  };

  const handleDeleteTodo = id => {
    const tasks = todos.filter(task => task.key !== id);
    setTodos(tasks);
  };

  const handleCheck = id => {
    const tasks = todos.map(task =>
      task.key === id
        ? {
            ...task,
            checked: !task.checked
          }
        : task
    );
    setTodos(tasks);
  };

  const handleDateChange = (direction = 0, timestamp = null) => {
    const dateObj = new Date(date);
    setDate(dateObj.setDate(dateObj.getDate() + direction));
  };

  const handleDragEnd = data => {
    const updatedTasks = [...todos];
    data.forEach((task, i) => {
      updatedTasks[
        updatedTasks.findIndex(_task => task.key === _task.key)
      ].order = i;
    });
    
    setTodos(updatedTasks);
  };

  const getTodoList = () => {
    const dateString = new Date(date).toDateString();
    const filteredList = todos
      .filter(todo => new Date(todo.timestamp).toDateString() === dateString)
      .sort((a, b) => a.order - b.order);

    return (
      <DraggableFlatList
        data={filteredList}
        renderItem={renderTask}
        keyExtractor={item => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => handleDragEnd(data)}
      />
    );
  };

  const renderTask = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity onLongPress={drag}>
        <Task
          text={item.text}
          key={item.key}
          checked={item.checked}
          delete={() => handleDeleteTodo(item.key)}
          check={() => handleCheck(item.key)}
        />
      </TouchableOpacity>
    );
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
        <Text style={{ fontSize: 16, color: "white" }}>
          {new Date(date).toLocaleDateString(undefined, {
            weekday: "short",
            month: "long",
            day: "numeric"
          })}
        </Text>
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
      {/* <ScrollView style={{ width: "100%" }}>{getTodoList()}</ScrollView> */}
      {getTodoList()}
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
