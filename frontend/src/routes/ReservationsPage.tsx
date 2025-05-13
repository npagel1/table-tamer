// 3rd party libraries & components
import { useContext, useEffect, useState } from "react"
import { Alert, Button, Group, LoadingOverlay, Modal, Stack, Tabs, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

// 1st party libraries & components
import { AppContext } from "../PageLayout";
import ReservationItem from "../components/reservations/ReservationItem";
import MakeReservationContent, { ReservationType } from "../components/MakeReservationContent";
import { useTranslation } from "react-i18next";

// ROUTE: Page to show all the reservations
export default function ReservationsPage() {
  const { i18n } = useTranslation();
  const {
    activeUser,
    cancelReservation,
  } = useContext(AppContext) ?? {};
  const [opened, { open, close }] = useDisclosure(false);
  const [allReservations, setAllReservations] = useState<ReservationType[]>([]);
  const [modalAction, setModalAction] = useState<"Cancel" | "Delete" | "Update" | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<ReservationType>();

  // Filter to only confirmated reservations
  const confirmedReservations = allReservations?.filter(res => res.status === "Confirmed")
    .sort((a, b) => {
      const dateA = new Date(a.reservation_date).getTime();
      const dateB = new Date(b.reservation_date).getTime();
      return dateA - dateB;
    });
    
  // Filter to only completed reservations
  const completedReservations = allReservations?.filter(res => res.status === "Completed")
    .sort((a, b) => {
      const dateA = new Date(a.reservation_date).getTime();
      const dateB = new Date(b.reservation_date).getTime();
      return dateA - dateB;
    });

  // Combine Confirmed and Completed reservations
  // const confirmedAndCompletedReservations = allReservations
  //   ?.filter(res => res.status === "Confirmed" || res.status === "Completed")
  //   .sort((a, b) => {
  //     const dateA = new Date(a.reservation_date).getTime();
  //     const dateB = new Date(b.reservation_date).getTime();
  //     return dateA - dateB;
  //   });

  useEffect(() => {
    if (activeUser) {
      getCustReservations(activeUser.customer_id);
    }
  }, [activeUser]);

  /**
   * Get all reservations for specific customer
   * @param cust_id Customer ID
   */
  async function getCustReservations(cust_id: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/customer/${cust_id}`);
      const data = await response.json() ?? [];

      setAllReservations(data);
    } catch(error) {
      console.error("Error fetching reservations:", error); 
    }
  }

  // Handles opening modal & executing parameter action
  function openModal(selectedResId: number, action: "Cancel" | "Delete" | "Update") {
    open();
    setModalAction(action);

    const foundReservationIndex = confirmedReservations?.findIndex(res => {
      return res.reservation_id === selectedResId;
    }) ?? -1;

    if (foundReservationIndex !== -1) {
      setSelectedReservation(confirmedReservations?.[foundReservationIndex]);
    }
  }

  if (!activeUser) {
    return <LoadingOverlay visible={true} overlayProps={{ blur: 6 }} />;
  }

  const [activeTab, setActiveTab] = useState<string>("confirmed");

  return (
    <>
      <Stack mt="3em">
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
          </Tabs.List>
          <Tabs.Panel value="confirmed" pt="md">
            {/* Confirmed Reservations Section */}
            {confirmedReservations && confirmedReservations.length > 0 &&
              <>
                {/* <Title order={6}>{i18n.t("reservations.confirmed")}</Title> */}
                <Stack mb="lg">
                  {confirmedReservations.map((reservation: ReservationType) => {
                    return (
                      <ReservationItem
                        key={reservation.reservation_id}
                        customer={activeUser.customer_name}
                        isMutable={true} // Allow actions for Confirmed reservations
                        onOpenModal={(res_id: number, action: "Cancel" | "Delete" | "Update") => {
                          openModal(res_id, action);
                        }}
                        reservation={reservation}
                      />
                    )
                  })}
                </Stack>
              </>
            }
          </Tabs.Panel>
          <Tabs.Panel value="completed" pt="md">
            {/* Completed Reservations Section */}
            {completedReservations && completedReservations.length > 0 &&
              <>
                {/* <Title order={6}>{i18n.t("reservations.completed")}</Title> */}
                <Stack mb="lg">
                  {completedReservations.map((reservation: ReservationType) => {
                    return (
                      <ReservationItem
                        key={reservation.reservation_id}
                        customer={activeUser.customer_name}
                        isMutable={false} // No actions for Completed reservations
                        onOpenModal={(res_id: number, action: "Cancel" | "Delete" | "Update") => {
                          openModal(res_id, action);
                        }}
                        reservation={reservation}
                      />
                    )
                  })}
                </Stack>
              </>
            }
          </Tabs.Panel>
        </Tabs>
        {!allReservations
          ?
          <LoadingOverlay visible={true} overlayProps={{ blur: 6 }} />
          :
          (allReservations.length === 0 || confirmedReservations.length === 0 || completedReservations.length === 0) &&
            <Alert title={i18n.t("reservations.uh-oh")}>{i18n.t("reservations.no-reservations")}</Alert> 
        }

        {/* Confirmed Reservations Section */}
        {/* {confirmedReservations && confirmedReservations.length > 0 &&
          <>
            <Title order={6}>{i18n.t("reservations.confirmed")}</Title>
            <Stack mb="lg">
              {confirmedReservations.map((reservation: ReservationType) => {
                return (
                  <ReservationItem
                    key={reservation.reservation_id}
                    customer={activeUser.customer_name}
                    isMutable={true} // Allow actions for Confirmed reservations
                    onOpenModal={(res_id: number, action: "Cancel" | "Delete" | "Update") => {
                      openModal(res_id, action);
                    }}
                    reservation={reservation}
                  />
                )
              })}
            </Stack>
          </>
        } */}

        {/* Completed Reservations Section */}
        {/* {completedReservations && completedReservations.length > 0 &&
          <>
            <Title order={6}>{i18n.t("reservations.completed")}</Title>
            <Stack mb="lg">
              {completedReservations.map((reservation: ReservationType) => {
                return (
                  <ReservationItem
                    key={reservation.reservation_id}
                    customer={activeUser.customer_name}
                    isMutable={false} // No actions for Completed reservations
                    onOpenModal={(res_id: number, action: "Cancel" | "Delete" | "Update") => {
                      openModal(res_id, action);
                    }}
                    reservation={reservation}
                  />
                )
              })}
            </Stack>
          </>
        } */}
      </Stack>

      <Modal.Root opened={opened} onClose={close}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            {modalAction === "Update" && <>{i18n.t("reservations.update")}</>}
            {modalAction === "Cancel" && <>{i18n.t("reservations.reservation")}: #{selectedReservation?.reservation_id}</>}
          </Modal.Header>
          <Modal.Body>
            {modalAction === "Update" &&
              <MakeReservationContent reservationAction="Update" reservationToUpdate={selectedReservation} />
            }
            {modalAction === "Cancel" &&
              <>
                {i18n.t("reservations.are-you-sure-cancel")}
              </>
            }
          </Modal.Body>
          {modalAction !== "Update" &&
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
                <Button color="gray" onClick={close}>{i18n.t("cancel")}</Button>
                <Button
                  onClick={() => {
                    if (modalAction === "Cancel") {
                      selectedReservation && cancelReservation(selectedReservation);
                    };
                    close();
                  }}
                >
                  {i18n.t("confirm")}
                </Button>
              </Group>
            </Modal.Header>
          }
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
