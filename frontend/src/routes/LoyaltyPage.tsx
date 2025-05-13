import { IconStar } from "@tabler/icons-react";
import { Text, List, Box, Paper, Group, Title, Avatar, em } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { Progress, Stack } from "@mantine/core";
import { AppContext } from "../PageLayout";
import { ReservationType } from "../components/MakeReservationContent";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@mantine/hooks";

function PerksList(props: { perks: string[] }) {
  return (
    <List>
      {props.perks.map((perkItem: string) => {
        return (
          <List.Item key={perkItem}>
            {perkItem}
          </List.Item>
        )
      })}
    </List>
  );
}

export default function LoyaltyPage() {
  const { i18n } = useTranslation();
  const { activeUser } = useContext(AppContext) ?? {};
  const [allReservations, setAllReservations] = useState<ReservationType[]>([]);
  const isTablet = useMediaQuery(`(min-width: ${em(750)})`);
  
  const silverTierPerks = [
    i18n.t("loyalty.complimentary"),
    i18n.t("loyalty.free-appetizer"),
    i18n.t("loyalty.20-off")
  ];

  const goldTierPerks = [
    i18n.t("loyalty.complimentary"),
    i18n.t("loyalty.10-discount"),
    i18n.t("loyalty.vip-seating"),
    i18n.t("loyalty.exclusive"),
    i18n.t("loyalty.free-dessert")
  ];

  const completedReservations = allReservations.filter(
    res => res.status === "Completed" || res.status === "Confirmed");
  const isGoldTier = completedReservations.length >= 10;

  useEffect(() => {
    if (activeUser) {
      fetchCompletedReservations(activeUser.customer_id);
    }
  }, [activeUser]);

  async function fetchCompletedReservations(cust_id: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reservations/customer/${cust_id}`);
      const data = await response.json();
      setAllReservations(data);
    } catch (error) {
      console.error("Error loading reservations", error);
    }
  }

  return (
    <Stack p="xl" gap="xl" align="center">
      {/* Tier Badge */}
        {/* <IconStar
          style={{ marginTop: DEFAULT_THEME.spacing.md }}
          size={99}
          color={isGoldTier ? "gold" : "gray"}
        /> */}
      {/* Silver Tier Perks */}
      {!isGoldTier && (
        <>
          <Paper
            withBorder
            shadow="md"
            w={isTablet ? "60%" : "100%"}
            style={{ background: "silver" }}
          >
            <Group justify="space-between" p="xs">
              <Stack gap={0}>
                <Text c="black">Status:</Text>
                <Title order={3} c="black">Silver Tier</Title>
              </Stack>
              <Avatar size="lg">
                <IconStar size={40} color="white" />
              </Avatar>
            </Group>
          </Paper>
          <Box
            w={250}
            bg="#e0e0e0"
            p="md"
            mx="auto"
            style={{
              borderRadius: 6,
              border: "2px solid gray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="xl" fw={900} c="black">
              {i18n.t("loyalty.silver-perks")}
            </Text>
          </Box>

          <Box
            bg="#e0e0e0"
            p="md"
            mx="auto"
            c="black"
            style={{
              borderRadius: 6,
              border: "2px solid gray",
              padding: "20px 50px",
            }}
          >
            <PerksList perks={silverTierPerks} />
          </Box>

          {/* Progress Tracker */}
          <Stack align="center" mt="sm">
            <Text size="md" fw={700} style={{ color: "#d6b332" }}>{i18n.t("loyalty.road-to-gold")}</Text>
            <Progress
              radius="xs"
              size="xl"
              value={(completedReservations.length / 10) * 100}
              striped
              animated
              color="blue"
              w="80%"
            />
            <Text size="sm" fw={500}>
              {completedReservations.length} / 10 Reservations Completed
            </Text>
          </Stack>
        </>
      )}

      {/* Gold Tier Perks */}
      {isGoldTier && (
        <>
          <Paper
            withBorder
            shadow="md"
            w={isTablet ? "60%" : "100%"}
            style={{ background: "gold" }}
          >
            <Group justify="space-between" p="xs">
              <Stack gap={0}>
                <Text c="black">Status:</Text>
                <Title order={3} c="black">Gold Tier</Title>
              </Stack>
              <Avatar size="lg">
                <IconStar size={40} color="white" />
              </Avatar>
            </Group>
          </Paper>
          <Box
            w={250}
            bg="#fff8d6"
            p="md"
            mx="auto"
            style={{
              borderRadius: 8,
              textAlign: "center",
              border: "2px solid gold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="xl" fw={900} style={{ color: "#000" }}>
              {i18n.t("loyalty.gold-perks")}
            </Text>
          </Box>

          <Box
            bg="#fff8d6"
            p="md"
            mx="auto"
            c="black"
            style={{
              borderRadius: 8,
              border: "2px solid gold",
              minWidth: '320px',
              marginTop: 10,
            }}
          >
            <PerksList perks={goldTierPerks} />
          </Box>
        </>
      )}
    </Stack>
  );
}