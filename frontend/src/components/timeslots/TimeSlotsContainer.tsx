import React, { useState } from "react";
import { Button, Divider, em, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import dayjs from "dayjs";

import TimeSlotButton from "./TimeSlotButton";
import { AvailableTimeType } from "../MakeReservationContent";

interface TimeSlotsContainerProps {
  reservationAction?: "Create" | "Update";
  /**
   * Handles creating the reservation
   * @param time Time value to display
   */
  onCreateReservation: (time: string) => Promise<Record<string, any>>;
  onUpdateReservation: (time: string) => Promise<Record<string, any>>;
  /**
   * Date selected by user
   */
  selectedDay: Date | null;
  /**
   * All the time individual time slot objects
   */
  timeSlots: AvailableTimeType[];
}

export default function TimeSlotsContainer(props: TimeSlotsContainerProps) {
  const isTablet = useMediaQuery(`(min-width: ${em(750)})`);

  const [selectedTime, setSelectedTime] = useState<string>();
  const [opened, { open, close  }] = useDisclosure(false);
  const formattedDay = dayjs(props.selectedDay).format("ddd MMM DD YYYY");

  // Opens the modal for displaying more info on potential reservation
  function handleOpenModal(time: string) {
    setSelectedTime(time);
    open();
  }

  return (
    <>
      <Divider mt="sm" mb="sm" />
      <Group
        gap="sm"
        wrap={!isTablet ? "nowrap" : "wrap"}
        style={{ overflowX: "scroll" }}
      >
        {props.timeSlots.map((time: AvailableTimeType) => {
          const dateTime = `${formattedDay} ${time.time_slot}`;
          const formattedTime = dayjs(dateTime).format("hh:mm A"); // Changed to 12-hour format

          return (
            <React.Fragment key={time.time_slot}>
              <TimeSlotButton
                timeSlot={formattedTime}
                onClick={() => {
                  handleOpenModal(time.time_slot);
                }}
              />
            </React.Fragment>
          );
        })}
      </Group>
      <Modal.Root
        opened={opened}
        onClose={close}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            Reservation Info
          </Modal.Header>
          <Modal.Body>
            <Stack gap="xs">
              <Group gap="xs">
                <Text fw="bold">Date:</Text>
                <Text>{props.selectedDay?.toDateString()}</Text>
              </Group>
              <Group gap="xs">
              <Text fw="bold">Time:</Text>
                <Text>
                  {selectedTime
                    ? dayjs(`${formattedDay} ${selectedTime}`, "ddd MMM DD YYYY HH:mm").format("hh:mm A")
                    : ""}
                </Text>
              </Group>
            </Stack>
          </Modal.Body>
          <Modal.Header
            p="xs"
            component={'footer'}
            pos={'sticky'}
            bottom={0}
            style={{
              borderTop: "1px solid var(--mantine-color-default-border)"
            }}
          >
            <Group justify="flex-end" style={{ width: "100%" }}>
              <Button onClick={close}>Cancel</Button>
              <Button
                onClick={() => {
                  if (!selectedTime) return;
                  
                  if (props.reservationAction === "Update") {
                    props.onUpdateReservation(selectedTime);
                  } else {
                    props.onCreateReservation(selectedTime);
                  }

                  close();
                }}
              >
                Confirm
              </Button>
            </Group>
          </Modal.Header>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
