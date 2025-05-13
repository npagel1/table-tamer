// 3rd party libraries & components
import { createContext, useEffect, useState } from "react";
import { Box, Container, DEFAULT_THEME, em, Group } from "@mantine/core";
import { readLocalStorageValue, useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router";
import { notifications } from "@mantine/notifications";

// 1st party libraries & components
import Navbar from "./components/Navbar";
import MobileHeader from "./components/header/MobileHeader";
import DesktopHeader from "./components/header/DesktopHeader";
import MobileBottomBar from "./components/footer/MobileBottomBar";
import DesktopFooter from "./components/footer/DesktopFooter";
import { ReservationType } from "./components/MakeReservationContent";
import { useTranslation } from "react-i18next";

export const AppContext = createContext<Record<string, any>>({});
const AppContextProvider = AppContext.Provider;

export type CustomerType = {
  type?: "customer";
  created_at: string;
  customer_id?: number;
  customer_name: string;
  customer_pic?: string;
  email: string;
  language?: string;
  password_hash: string;
  phone: string;
};

export type StaffType = {
  type?: "staff";
  email: string;
  password_hash: string;
  phone: string;
  staff_id: number;
  staff_name: string;
  staff_role: string;
  staff_pic?: string | null;
  language?: string;
};

/**
 * Layout of the app
 * - Conditionally displays content based on window size, user, etc
 * - Gives app "AppContext" Provider
 *   - The rest of the child components have access to the
 *     properties in the "value" object of the return statement
 */
export default function PageLayout() {
  const { i18n } = useTranslation();
  // Gets active user local storage
  const activeUser = JSON.parse(readLocalStorageValue({ key: 'activeUser' }));
  // Determines if page is mobile or not
  const isTablet = useMediaQuery(`(min-width: ${em(750)})`);
  const isDesktop = useMediaQuery(`(min-width: ${em(1024)})`);
  const [hasReservation, setHasReservation] = useState<boolean>(false);
  const [reservationCount, setReservationCount] = useState<number | null>(null);
  const isStaff = activeUser.hasOwnProperty("staff_role");

  useEffect(() => {
    if (activeUser && !activeUser.hasOwnProperty("staff_role")) {
      updateCustomerHasReservation(activeUser.customer_id);
      updateCustomerReservationCount(activeUser.customer_id);
    }
  }, [activeUser]);

  // Method to create a reservation
  async function createReservation(time: string, date: string) {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reservations/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: `${activeUser.customer_id}`,
          slot_id: 10,
          time_slot: time,
          reservation_date: date,
          status: "Confirmed",
          customer_name: `${activeUser.customer_name}`
        })
      });

      const data = await response.json();

      let notificationTitle = "";
      let notificationMessage = "";

      if (response.ok) {
        notificationTitle = i18n.t("reservations.confirmed") + "!";
        notificationMessage = i18n.t("reservations.created");
      } else {
        notificationTitle = i18n.t("error");
        notificationMessage = data.detail;
      }

      notifications.show({
        title: notificationTitle,
        message: notificationMessage,
      });

      return data;
    } catch(error) {
      console.error('ERROR:', error);
    } finally {
      await updateCustomerHasReservation(activeUser.customer_id);
      await updateCustomerReservationCount(activeUser.customer_id);
    }
  }

  async function updateReservation(res: ReservationType, time: string, date: string) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/${res.reservation_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: `${activeUser.customer_id}`,
          table_id: 102,
          slot_id: res.slot_id,
          time_slot: time,
          reservation_date: date,
          status: res.status,
          customer_name: `${activeUser.customer_name}`
        })
      });

      const data = await response.json();

      let notificationTitle = "";
      let notificationMessage = "";

      if (response.ok) {
        notificationTitle = i18n.t("success");
        notificationMessage = data.message;
      } else {
        notificationTitle = i18n.t("error");
        notificationMessage = data.detail;
      }

      notifications.show({
        title: notificationTitle,
        message: notificationMessage,
      });
      return data;
    } catch(error) {
      console.error("ERROR:", error);
    } finally {
      await updateCustomerReservationCount(activeUser.customer_id);
    }
  }

  async function cancelReservation(res: ReservationType) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/${res.reservation_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer_id: `${res.customer_id}`,
          table_id: 102,
          slot_id: res.slot_id,
          time_slot: res.time_slot,
          reservation_date: res.reservation_date,
          status: "Cancelled",
          customer_name: `${res.customer_name}`
        })
      });
  
      const data = await response.json();
  
      let notificationTitle = "";
      let notificationMessage = "";
  
      if (response.ok) {
        notificationTitle = i18n.t("reservations.cancelled");
        notificationMessage = i18n.t("reservations.succesfully-cancelled");
        if (!isStaff) {
          await updateCustomerReservationCount(activeUser.customer_id);
        }
      } else {
        notificationTitle = i18n.t("error");
        notificationMessage = data.detail;
      }
  
      notifications.show({
        title: notificationTitle,
        message: notificationMessage,
      });
    } catch(error) {
      console.error("ERROR:", error);
    }
  }

  // Method to delete a reservation by ID
  async function handleDeleteReservation(res_id: number) {
    try {
      await fetch(`http://127.0.0.1:8000/api/reservations/${res_id}`, {
        method: "DELETE"
      });
      await updateCustomerHasReservation(activeUser.customer_id);
      await updateCustomerReservationCount(activeUser.customer_id);
    } catch(error) {
      console.error('ERROR:', error);
    }
  }

  // Boolean - determines whether customer has reservation
  async function updateCustomerHasReservation(cust_id: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/customers/${cust_id}/has-reservation`);
      const data = await response.json();
      setHasReservation(data.hasReservation);
    } catch(error) {
      console.error('ERROR:', error);
    }
  }

  // Updates the customer reservation count
  async function updateCustomerReservationCount(cust_id: number) {
    if (cust_id !== null) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/customers/${cust_id}/reservation-count`);
        if (!response.ok) {
          notifications.show({
            title: i18n.t("reservations.error-count"),
            message: i18n.t("reservations.issue-count"),
          });
        }
        const data = await response.json();
        setReservationCount(data.reservationCount);
      } catch(error) {
        console.error('ERROR:', error);
      }
    }
  }

  const headerHeight = "46px";
  const footerHeight = "46px";
  let navbarWidth = isDesktop ? "300px" : isTablet ? "85px" : "";
  const mainStyle = {
    paddingLeft: isTablet ? navbarWidth : "unset",
    paddingBottom: `${parseInt(footerHeight) * 2}px`,
    width: "100%",
    background: DEFAULT_THEME.colors.gray[3],
    //height: "100vh",
  };
  const footerStyle = {
    paddingLeft: isTablet ? navbarWidth : "unset",
  }

  return (
    <AppContextProvider
      value={{
        activeUser,
        cancelReservation,
        createReservation,
        updateReservation,
        updateCustomerHasReservation,
        updateCustomerReservationCount,
        handleDeleteReservation,
        hasReservation,
        reservationCount
      }}
    >
      {activeUser && (
        <>
          {!isTablet && <MobileHeader />}
          {isTablet && <DesktopHeader height={headerHeight} />}
          <Group>
            {isTablet &&
              <Navbar headerHeight={headerHeight} footerHeight={footerHeight} width={navbarWidth} />
            }
            <Box component="main" style={mainStyle}>
              <Container style={{ padding: "2em 1em" }}>
                <Outlet />
              </Container>
            </Box>
          </Group>
          {!isTablet && <MobileBottomBar activeUser={activeUser} />}
          {isTablet && <DesktopFooter style={footerStyle} height={footerHeight} />}
        </>
      )}
    </AppContextProvider>
  );
}
