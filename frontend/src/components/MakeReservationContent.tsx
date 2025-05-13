// 3rd party libraries & components
import { useContext, useEffect, useState } from "react";
import { Button, Group, Select, Title } from "@mantine/core";
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import { DateInput } from "@mantine/dates";
import { IconCalendarMonthFilled, IconUsersGroup } from "@tabler/icons-react";

// 1st party libraries & components
import { AppContext } from "../PageLayout";
import TimeSlotsContainer from "./timeslots/TimeSlotsContainer";
import { useTranslation } from "react-i18next";

// Handles making a reservation, showing times, confirming reservation
interface MakeReservationContentProps {
  reservationAction?: "Create" | "Update";
  reservationToUpdate?: ReservationType;
  /**
   * Title of the card component
   */
  title?: string | undefined;
}

export type AvailableTimeType = {
  is_available: boolean;
  slot_id: number;
  time_slot: string;
}

export type ReservationType = {
  customer_id: number;
  reservation_date: string;
  reservation_id: number;
  slot_id: number;
  status: "Confirmed" | "Completed" | "Cancelled";
  time_slot: string;
  customer_name: string;
}

export default function MakeReservationContent(props: MakeReservationContentProps) {
  const { i18n } = useTranslation();

  const { createReservation, updateReservation } = useContext(AppContext) ?? {};
  const groupSizes = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // State variables for the times
  const [availableTimes, setAvailableTimes] = useState<AvailableTimeType[] | []>([]);

  const [showTimeSlots, setShowTimeSlots] = useState<boolean>(false);
  const [allTimeSlots, setAllTimeSlots] = useState<AvailableTimeType[]>([]);

  // State variables for the day, & group size inputs
  const [dayValue, setDayValue] = useState<Date | null>(null);
  const [dayValueError, setDayValueError] = useState<string>("");
  const [groupSize, setGroupSize] = useState<string | null>(null);
  const [groupSizeError, setGroupSizeError] = useState<string>("");

  useEffect(() => {
    if (allTimeSlots.length === 0) {
      getAllTimeSlots();
    }
  }, [allTimeSlots]);

  function validateDateInput() {
    if (dayValue === null) setDayValueError(i18n.t("reservations.date-empty"));
  }

  function validateGroupInput() {
    if (groupSize === null) setGroupSizeError(i18n.t("reservations.group-empty"));
  }

  async function getAllTimeSlots() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/time_slots/");
      const data = await res.json();
      setAllTimeSlots(data);
    } catch(error) {
      console.error("Error:", error);
    }
  }

  async function getAvailableTimes(day: string) {
    // get all reservations for a filter to show only those on a specific day
    // of that day, filter the time slots that aren't in a reservation
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reservations/");
      const data = await response.json();

      // Get reservations on day provided
      const reservationsThatDay = data.filter((item: ReservationType) => {
        return item.reservation_date === day;
      });

      // Get all times slots that are only amongst the reservations already made
      const openTimes = allTimeSlots.filter((timeSlot: AvailableTimeType) => {
        return !reservationsThatDay.some((res: ReservationType) => {
          return res.slot_id === timeSlot.slot_id;
        })
      });
      
      setAvailableTimes(openTimes.reverse());
      setShowTimeSlots(true);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <>
      {props.title && <Title mb="sm" order={4}>{props.title}</Title>}
      <Group gap="xs" mb="sm" wrap="nowrap">
        <DateInput
          label={i18n.t("reservations.date")}
          clearable
          value={dayValue}
          placeholder={i18n.t("reservations.date")}
          leftSection={<IconCalendarMonthFilled />}
          onChange={newValue => {
            setDayValue(newValue);
            if (dayValueError) setDayValueError("");
          }}
          required
          style={{ flexGrow: 1 }}
          valueFormat="MMM DD"
          error={dayValueError}
          locale={i18n.language}
        />
        <Select
          label={i18n.t("reservations.guests")}
          data={groupSizes}
          leftSection={<IconUsersGroup />}
          onChange={value => {
            setGroupSize(value);
            if (groupSizeError) setGroupSizeError("");
          }}
          required
          style={{ flexBasis: "50%" }}
          error={groupSizeError}
        />
      </Group>
      <Button
        fullWidth
        onClick={() => {
          if (dayValue === null || groupSize === null) {
            validateDateInput();
            validateGroupInput();
            return;
          }
          
          const dateISOString: string = dayValue?.toISOString().split("T")[0];
          getAvailableTimes(dateISOString);
        }}
        // use mantine's use-fetch hook here
      >
        {i18n.t("reservations.search")}
      </Button>
      {showTimeSlots &&
        <TimeSlotsContainer
          reservationAction={props.reservationAction}
          selectedDay={dayValue}
          timeSlots={availableTimes}
          onCreateReservation={(time: string) => {
            if (dayValue) {
              const dateISOString: string = dayValue?.toISOString().split("T")[0];
              return createReservation(time, dateISOString);
            }
          }}
          onUpdateReservation={(time: string) => {
            if (dayValue && props.reservationToUpdate) {
              const dateISOString: string = dayValue?.toISOString().split("T")[0];
              return updateReservation(props.reservationToUpdate, time, dateISOString); 
            }
          }}
        />
      }
    </>
  )
}
