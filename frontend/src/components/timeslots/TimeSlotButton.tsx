import { Button } from "@mantine/core";

interface TimeSlotButtonProps {
  onClick: () => void;
  timeSlot: string;
}

// Buttons to display for the time slots
export default function TimeSlotButtons(props: TimeSlotButtonProps) {
  return (
    <Button
      fullWidth
      onClick={props.onClick}
      style={{ flex: "1 0 35%" }}
    >
      {props.timeSlot}
    </Button>
  );
}