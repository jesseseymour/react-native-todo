import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { primaryTextColor, primaryLightColor, primaryColor } from "./Colors";

const Task = props => {
  return (
    <View style={styles.taskWrapper}>
      <Icon
        name={props.checked ? "check-box" : "check-box-outline-blank"}
        size={30}
        color={primaryColor}
        style={{ marginLeft: 15 }}
        onPress={props.check}
      />
      <Text
        style={{
          ...styles.task,
          textDecorationLine: `${props.checked ? "line-through" : "none"}`
        }}
      >
        {props.text}
      </Text>
      <Icon
        name="delete"
        size={30}
        color={primaryColor}
        style={{ marginLeft: "auto", marginRight: 15 }}
        onPress={props.delete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  taskWrapper: {
    marginTop: "5%",
    flexDirection: "row",
    borderColor: primaryLightColor,
    borderBottomWidth: 1.5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
    display: "flex",
    paddingBottom: 20
  },
  task: {
    paddingBottom: 3,
    paddingLeft: 10,
    // marginTop: 6,
    borderColor: primaryLightColor,
    fontSize: 17,
    fontWeight: "bold",
    color: primaryColor,
    flex: 1
  }
});

export default Task;
