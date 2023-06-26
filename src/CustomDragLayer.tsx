import React from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { Column } from "./Column";
import { CustomDragLayerContainer } from "./styles";
import { DragItem } from "./DragItem";
import { Card } from "./Card";

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: "none"
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

export const CustomDragLayer = () => {
  const { isDragging, currentOffset, item } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
    item: monitor.getItem() as DragItem
  }));

  return isDragging ? (
    <CustomDragLayerContainer>
      <div style={getItemStyles(currentOffset)}>
        {item.type === "COLUMN" ? (
          <Column
            id={item.id}
            text={item.text}
            index={item.index}
            isPreview={true}
          />
        ) : (
          <Card
            id={item.id}
            text={item.text}
            columnId={item.columnId}
            index={0}
            isPreview={true}
          />
        )}
      </div>
    </CustomDragLayerContainer>
  ) : null;
};
