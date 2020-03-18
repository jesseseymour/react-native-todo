import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const Task = props => {
  return (
    <View style={styles.taskWrapper}>
      <Icon
        name={props.checked ? "check-square" : "square"}
        size={30}
        color="#900"
        style={{ marginLeft: 15 }}
        onPress={props.check}
      />
      <Text style={{...styles.task, textDecorationLine: `${props.checked ? "line-through" : "none"}`}}>{props.text}</Text>
      <Icon
        name="trash-2"
        size={30}
        color="#900"
        style={{ marginLeft: "auto" }}
        onPress={props.delete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskWrapper: {
    marginTop: "5%",
    flexDirection: "row",
    borderColor: "#FFFFFF",
    borderBottomWidth: 1.5,
    width: "100%",
    alignItems: "stretch",
    minHeight: 40
  },
  task: {
    paddingBottom: 20,
    paddingLeft: 10,
    marginTop: 6,
    borderColor: "#F0F0F0",
    fontSize: 17,
    fontWeight: "bold",
    color: "white"
  }
});

export default Task;
