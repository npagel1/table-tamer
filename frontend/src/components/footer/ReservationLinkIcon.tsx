import { ActionIcon, Indicator } from "@mantine/core";
import { IconBowlSpoon, IconBowlSpoonFilled } from "@tabler/icons-react";
import { useContext } from "react";

import { AppContext } from "../../PageLayout";

/**
 * This component gets the current reservations for the customer.
 * If they have "Confirmed" reservations an indicator is displayed in mobile menu
 * @param props current path to check if route is active
 */
export default function ReservationLinkIcon(props: { pathname: string }) {
  const { reservationCount } = useContext(AppContext);

  return (
    <Indicator
      label={reservationCount}
      color="red"
      size={16}
      disabled={reservationCount ? reservationCount.length === 0 : true}
    >
      <ActionIcon size="lg" variant="subtle">
        {props.pathname === "/reservations" ? <IconBowlSpoonFilled /> : <IconBowlSpoon />}
      </ActionIcon>
    </Indicator>
  )
}