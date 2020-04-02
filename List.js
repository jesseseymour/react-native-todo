import React from "react";
import { TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Task from "./Task";

const List = props => {
  const {
    todos,
    backgroundColor,
    handleDeleteTodo,
    handleCheck,
    handleDragEnd
  } = props;

  //const dateString = new Date(parseInt(date)).toDateString();
  const filteredList = todos
    //.filter(todo => new Date(todo.timestamp).toDateString() === dateString)
    .sort((a, b) => a.order - b.order);
  return (
    <DraggableFlatList
      style={{ backgroundColor: backgroundColor }}
      data={filteredList}
      renderItem={({ item, index, drag, isActive }) => {
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
      }}
      keyExtractor={item => `draggable-item-${item.key}`}
      onDragEnd={({ data }) => handleDragEnd(data)}
    />
  );
};

export default List;
