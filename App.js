import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Keyboard,
  TouchableOpacity,
  TextInput
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { FloatingAction } from "react-native-floating-action";
import Header from "./Header";
import List from "./List";
import Icon from "react-native-vector-icons/MaterialIcons";
import TaskObject from "./TaskObject";

import {
  primaryColor,
  primaryLightColor,
  primaryDarkColor,
  primaryTextColor,
  backgroundColor
} from "./Colors";

/* 
  class App extends React.Component {
    constructor() {
      super();
      this.state = {
        opacity: new Animated.Value(0)
      };
    }
    componentDidMount() {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500
      }).start();
    }
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Animated.View
              style={{
                ...styles.textInputContainer,
                opacity: this.state.opacity
              }}
            ></Animated.View>
          </View>
        </View>
      );
    }
  } 
*/

const App = () => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(Date.now());
  const [todos, setTodos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getDate = async () => {
      const data = await AsyncStorage.getItem("date");
      return data;
    };
    getDate().then(data => {
      if (!Number.isNaN(data) && data !== "NaN") {
        data && setDate(data.toString());
      }
    });

    getTasks()
      .then(data => JSON.parse(data))
      .then(json => {
        if (json) setTodos([...json]);
      });
  }, []);

  useEffect(() => {
    storeTasks(todos);
  }, [todos]);

  useEffect(() => {
    storeDate(date);
  }, [date]);

  useEffect(() => {
    if(isAdding) this.textInput.focus();
    Animated.timing(translateY, {
      toValue: isAdding ? -300 : 0,
      duration: 500
    }).start();
  }, [isAdding]);

  /* useEffect(() => {
    Animated.timing(
      opacity,
      {
        toValue: opacityValue,
        duration: 500
      }
    ).start();
  }, [opacityValue]) */

  const getTasks = async () => {
    const data = await AsyncStorage.getItem("tasks");
    return data;
  };

  const storeTasks = async tasks => {
    await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const storeDate = async date => {
    await AsyncStorage.setItem("date", date.toString());
  };

  const handleAddTodo = () => {
    if (value.length > 0) {
      Keyboard.dismiss();
      const tasks = [
        new TaskObject({ text: value, timestamp: date }),
        ...todos
      ];
      setTodos(tasks);
      setValue("");
    }
    setIsAdding(false);
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
    const dateObj = new Date(parseInt(date));
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

  const handleFloatingAction = () => {
    setOpacityValue(opacityValue === 1 ? 0 : 1);
  };

  const toggleInput = () => {
    setIsAdding(!isAdding);
  };

  return (
    <View style={styles.container}>
      <View style={{ zIndex: 0, display: "flex", flex: 1, width: "100%" }}>
        <Header date={date} />
        <Animated.View
          style={{ ...styles.textInputContainer, transform: [{ translateY }] }}
        >
          <TextInput
            ref={(input) => { this.textInput = input; }}
            style={styles.textInput}
            multiline
            placeholder={"What do you need to do?"}
            placeholderTextColor={primaryColor}
            onChangeText={value => setValue(value)}
            value={value}
            // onSubmitEditing={() => handleAddTodo()}
          />
          <TouchableOpacity onPress={() => handleAddTodo()}>
            <Icon name="add" size={30} color={primaryTextColor} />
          </TouchableOpacity>
        </Animated.View>
        <List
          todos={todos}
          backgroundColor={backgroundColor}
          handleDeleteTodo={handleDeleteTodo}
          handleCheck={handleCheck}
          handleDragEnd={handleDragEnd}
        />
      </View>
      <FloatingAction
        onPressMain={() => {
          if(isAdding) {
            setValue("")
            Keyboard.dismiss()
          }
          toggleInput();
        }}
        showBackground={false}
        onPressItem={name => {
          if (name === "done") handleAddTodo();
        }}
        color={primaryColor}
        actions={[
          {
            name: "done",
            icon: <Icon name="done" color={primaryTextColor} size={25} />,
            buttonSize: 56,
            margin: 0
          }
        ]}
      />
      {/* <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={() => toggleInput()}
      >
        <Icon
          name={`${isAdding ? "check-circle" : "add-circle"}`}
          size={50}
          color={primaryLightColor}
        />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    alignItems: "center",
    justifyContent: "flex-start"
    // paddingTop: "5%",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingRight: 10,
    paddingBottom: 5,
    position: "absolute",
    top: "100%",
    width: "100%",
    height: "100%",
    zIndex: 1,
    backgroundColor: primaryTextColor
  },
  textInput: {
    // height: 20,
    flex: 1,
    minHeight: 20,
    // marginTop: "5%",
    // padding: 0,
    fontSize: 20,
    fontWeight: "100",
    color: primaryColor
    // paddingLeft: 10
  },
  floatingActionButton: {
    borderRadius: 100,
    position: "absolute",
    right: 20,
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 120
  }
});

export default App;
