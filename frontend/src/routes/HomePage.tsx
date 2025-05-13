// 3rd party libraries & components
import { Alert, Paper, Stack, Text, Title } from "@mantine/core";
import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';


// 1st party components
import MakeReservationContent from "../components/MakeReservationContent";
import { useTranslation } from "react-i18next";
import { IconMoodHappy } from "@tabler/icons-react";

// ROUTE: Homepage
export default function HomePage() {
  const { i18n } = useTranslation();
  /**
   * 1. user picks day & group size
   * 2. check the reservations for open times
   * 3. OPTIONAL: only necessary if we're checking available tables
   *   - if a table is booked at the open time, exclude the table
   * 4. show open times, user selects time, continue to complete reservation
   */

  return (
    <Stack mt="3em" gap="lg">
      <Paper
        withBorder
        shadow="sm"
        p="sm"
        mx="auto"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack align="center">
          <Title size="lg">
            {i18n.t("homepage.welcome")}
          </Title>
          <Alert icon={<IconMoodHappy />}>
            {i18n.t("homepage.greeting")}
          </Alert>
          <Text size="xs">
            {i18n.t("homepage.service")}
          </Text>
        </Stack>
      </Paper>
      
      <Paper shadow="sm" p="sm" bd="2px solid gray">
        <MakeReservationContent title={i18n.t("reservations.make-reservation")} />
      </Paper>
      
      {/* New Carousel Section */}
      <Paper>
        <Carousel
          withIndicators
          height={200}
          slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
          slideGap={{ base: 0, sm: 'md' }}
          loop
        >
          <Carousel.Slide>
            <img 
              src="/images/burger.jpg" 
              alt="Slide 1" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img 
              src="/images/chicken.jpg" 
              alt="Slide 2" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img 
              src="/images/pork.jpg" 
              alt="Slide 3" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img 
              src="/images/shrimp.jpg" 
              alt="Slide 4" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <img 
              src="/images/cake.jpg" 
              alt="Slide 5" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </Carousel.Slide>
        </Carousel>
      </Paper>
    </Stack>
  );
}
