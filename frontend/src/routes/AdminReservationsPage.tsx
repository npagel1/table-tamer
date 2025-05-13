import { useState, useEffect, useContext } from 'react';
import { Text, Button, Accordion, Modal, Box, Group, Stack, Paper, Divider, Tabs, TextInput, ActionIcon, em, DEFAULT_THEME, Badge } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCancel, IconChecks, IconCircleDashedCheck, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ReservationType } from '../components/MakeReservationContent';
import { useMediaQuery } from '@mantine/hooks';
import { AppContext } from '../PageLayout';

export default function AdminReservationsPage() {
  const { i18n } = useTranslation();
  const [allReservations, setAllReservations] = useState<ReservationType[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("confirmed");
  const [filterValue, setFilterValue] = useState<"date" | "name" | null>(null);
  const [dateFilterValue, setDateFilterValue] = useState<Date | null>(null);
  const [nameFilterValue, setNameFilterValue] = useState<string>("");
  const isTablet = useMediaQuery(`(min-width: ${em(750)})`);
  const isDesktop = useMediaQuery(`(min-width: ${em(1024)})`);
  const { cancelReservation } = useContext(AppContext);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeReservation, setActiveReservation] = useState<ReservationType>();

  useEffect(() => {
    if (allReservations.length === 0) {
      getAllReservations();
    }
  }, []);

  async function getAllReservations() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reservations");
      const data = await response.json();

      setAllReservations(data);
    } catch (error) {
      console.error('ERROR:', error);
    }
  }

  let filteredReservations = allReservations;

  if (filterValue === "date") {
    filteredReservations = filteredReservations.filter((res: ReservationType) => {
      const formattedFilterDate = dayjs(dateFilterValue).format("YYYY-MM-DD");
      return res.reservation_date === formattedFilterDate;
    });
  }

  if (filterValue === "name") {
    filteredReservations = filteredReservations.filter((res: ReservationType) => {
      return res.customer_name.includes(nameFilterValue);
    });
  }

  const AccordionItem = ({ reservation }: { reservation: ReservationType }) => {
    const dateTime = `${reservation.reservation_date} ${reservation.time_slot}`;
    const formattedTime = dayjs(dateTime, 'YYYY-MM-DD HH:mm:ss').format('h:mm A');

    return (
      <Accordion.Item key={reservation.reservation_id} value={String(reservation.reservation_id)}>
        <Paper shadow="xs">
          <Accordion.Control>
            <Group align="flex-start">
              <Stack gap={0}>
                <Group>
                  <Text fw="bold">{dayjs(reservation.reservation_date).format("MM-DD-YY")}</Text>
                  <Badge variant="outline">#{reservation.reservation_id}</Badge>
                </Group>
                <Text fz="sm">{formattedTime}</Text>
              </Stack>
              <Text m="0 auto" fw="bold" style={{ alignSelf: "flex-start" }}>
                {reservation.customer_name}
              </Text>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Group>
              {reservation.status === "Confirmed" &&
                <Button
                  color="red"
                  variant="light"
                  size="compact-sm"
                  onClick={() => {
                    const foundIndex = filteredReservations.findIndex((res: ReservationType) => {
                      return res.status === "Confirmed" && res.reservation_id === Number(activeItem);
                    });
                    setActiveReservation(filteredReservations[foundIndex]);
                    setModalOpened(true);
                  }}
                >
                  Cancel
                </Button>
              }
              {reservation.status === "Confirmed" &&
                <Badge m="0 auto" color="green" rightSection={<IconCircleDashedCheck size={17} />}>
                  {reservation.status}
                </Badge>
              }
              {reservation.status === "Completed" &&
                <Badge m="0 auto" color="gray" rightSection={<IconChecks size={17} />}>
                  {reservation.status}
                </Badge>
              }
              {reservation.status === "Cancelled" &&
                <Badge m="0 auto" color="tomato" rightSection={<IconCancel size={17} />}>
                  {reservation.status}
                </Badge>
              }
            </Group>
          </Accordion.Panel>
        </Paper>
      </Accordion.Item>
    );
  };

  return (
    <>
      <Box  mt="3em">
        <Tabs
          variant="pills"
          value={activeTab}
          onChange={newTab => newTab && setActiveTab(newTab)}
        >
          <Tabs.List>
            <Tabs.Tab value="confirmed">
              {i18n.t("reservations.confirmed")}
            </Tabs.Tab>
            <Tabs.Tab value="completed">
              {i18n.t("reservations.completed")}
            </Tabs.Tab>
            <Tabs.Tab value="cancelled">
              {i18n.t("reservations.cancelled")}
            </Tabs.Tab>
          </Tabs.List>
          <Divider mt="xs" />
          <Stack gap="xs" mt="sm">
            {/* Filter buttons & input wrap */}
            <Group>
              <Text>Filter by:</Text>
              <Button
                size="compact-md"
                radius="xl"
                variant={filterValue === "date" ? "filled" : "outline"}
                rightSection={filterValue === "date" ? <IconX size={15} /> : null}
                onClick={() => {
                  if (filterValue !== "date") {
                    setFilterValue("date");
                  } else {
                    setFilterValue(null);
                  }
                }}
              >
                {i18n.t("reservations.date")}
              </Button>
              <Button
                size="compact-md"
                radius="xl"
                variant={filterValue === "name" ? "filled" : "outline"}
                rightSection={filterValue === "name" ? <IconX size={15} /> : null}
                onClick={() => {
                  if (filterValue !== "name") {
                    setFilterValue("name");
                  } else {
                    setFilterValue(null);
                  }
                }}
              >
                {i18n.t("credentials.name")}
              </Button>
              {/* Input & close button wrap */}
              <Group
                w={(!isTablet && !isDesktop) ? "100%" : "auto"}
                ml={(!isTablet && !isDesktop) ? "unset" : "auto"}
              >
                {filterValue === "date" &&
                  <DateInput
                    placeholder="Select a date"
                    clearable
                    value={dateFilterValue}
                    style={{ flex: "1 0 auto" }}
                    maw="100%"
                    onChange={(value: Date | null) => setDateFilterValue(value)}
                  />
                }
                {filterValue === "name" &&
                  <TextInput
                    placeholder="Type a customer name"
                    value={nameFilterValue}
                    onChange={event => setNameFilterValue(event?.target.value)}
                    style={{ flex: "1 0 auto" }}
                    maw="100%"
                    rightSection={nameFilterValue.length > 0
                      ?
                      <ActionIcon variant="subtle" onClick={() => setNameFilterValue("")}>
                        <IconX color={DEFAULT_THEME.colors.gray[8]} size={15} />
                      </ActionIcon>
                      :
                      null
                    }
                  />
                }
              </Group>
            </Group>
            <Divider />
            <Tabs.Panel value="confirmed">
              <Accordion variant="separated" radius="md" value={activeItem} onChange={setActiveItem}>
                <>
                  {filteredReservations.length === 0 &&
                    <Text>No reservations found with the set filter.</Text>
                  }
                  {filteredReservations.length > 0 &&
                    filteredReservations
                      .filter((res: ReservationType) => res.status === "Confirmed")
                      .map((res: ReservationType) => <AccordionItem key={res.reservation_id} reservation={res} />)
                  }
                </>
              </Accordion>
            </Tabs.Panel>
            <Tabs.Panel value="completed">
              <Accordion variant="separated" radius="md">
                <>
                  {filteredReservations.length === 0 &&
                    <Text>No reservations found with the set filter.</Text>
                  }
                  {filteredReservations.length > 0 &&
                    filteredReservations
                      .filter((res: ReservationType) => res.status === "Completed")
                      .map((res: ReservationType) => <AccordionItem key={res.reservation_id} reservation={res} />)
                  }
                </>
              </Accordion>
            </Tabs.Panel>
            <Tabs.Panel value="cancelled">
              <Accordion variant="separated" radius="md">
                <>
                  {filteredReservations.length === 0 &&
                    <Text>No reservations found with the set filter.</Text>
                  }
                  {filteredReservations.length > 0 &&
                    filteredReservations
                      .filter((res: ReservationType) => res.status === "Cancelled")
                      .map((res: ReservationType) => <AccordionItem key={res.reservation_id} reservation={res} />)
                  }
                </>
              </Accordion>
            </Tabs.Panel>
          </Stack>
        </Tabs>
      </Box>
      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Cancel Reservation" centered>
        <Text mb="sm">
          Are you sure you want to cancel reservation {activeReservation?.reservation_id} on {dayjs(activeReservation?.reservation_date).format("MM-DD-YYYY")}?
        </Text>
        <Group justify="flex-end">
          <Button color="gray" onClick={() => setModalOpened(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              await cancelReservation(activeReservation);
              await getAllReservations();
              setModalOpened(false);
            }}
          >Confirm</Button>
        </Group>
      </Modal>
    </>
  );
}