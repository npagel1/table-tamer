import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { IconCancel, IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ReservationType } from "../MakeReservationContent";
import { useTranslation } from "react-i18next";

interface ReservationItemProps {
  /**
   * Customer name to display in reservation
   */
  customer: string;
  /**
   * Can the reservation be cancelled, updated, or deleted
   */
  isMutable: boolean;
  /**
   * Handles cancelling, updating, or deleting a reservation in the modal based on the action parameter
   * @param res_id ID of the reservation
   * @param action Determines which action to execute in the modal
   */
  onOpenModal: (res_id: number, action: "Cancel" | "Delete" | "Update") => void;
  /**
   * The reservation object
   */
  reservation: ReservationType;
}

// An individual reservation item to go in a reservation list
export default function ReservationItem(props: ReservationItemProps) {
  const { i18n } = useTranslation();
  const { reservation_date, reservation_id, time_slot } = props.reservation;

  // Formats the reservation date to an actual Date type
  // This is needed to be able to get the time so we can then strip it
  const formattedDate = dayjs(reservation_date).format('MM/DD/YYYY');
  // Gets the time and adds it as to the date
  const dateTime = `${formattedDate} ${time_slot}`;
  // Strips just the time from the date/time string
  const formattedTime = dayjs(dateTime).format("hh:mm A");

  return (
    <>
      <Paper withBorder p="xs" shadow="xs">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Group gap="xs">  
              <Text fw="bold">{dayjs(reservation_date).format("MM-DD-YY")}</Text>
              <Badge variant="outline">#{reservation_id}</Badge>
            </Group>
            <Text size="sm">{formattedTime}</Text>
          </Stack>
          <Text fw="bold">{props.customer}</Text>
          <Button.Group>
            {props.isMutable &&
              <>
                <Button
                  size="xs"
                  variant="light"
                  rightSection={<IconEdit color="#228be6" size={15} />}
                  onClick={() => props.onOpenModal(reservation_id, "Update")}
                >
                  Edit
                </Button>
                <Button
                  size="xs"
                  variant="default"
                  rightSection={<IconCancel color="tomato" size={15} />}
                  onClick={() => props.onOpenModal(reservation_id, "Cancel")}
                >
                  Cancel
                </Button>
              </>
            }
          </Button.Group>
        </Group>
      </Paper>
    </>
  );
}