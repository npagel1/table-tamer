import { useContext, useEffect, useState } from "react";
import { BackgroundImage, Box, Button, Center, LoadingOverlay, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure, useToggle } from "@mantine/hooks";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

import LoginContent from "../components/login/LoginContent";
import SignupContent from "../components/login/SignupContent";
import { AuthContext } from "../contexts/AuthContext";
import { CustomerType, StaffType } from "../PageLayout";


// ROUTE: Login page for customers or staff
export default function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [toggleValue, toggle] = useToggle(["login", "signup"]);
  const [opened, { /* open, close */  }] = useDisclosure(true);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [staff, setStaff] = useState<StaffType[]>([]);
  const [loginSuccessful, setLoginSuccessful] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const imageUrl = "/images/restaurant.jpg";

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setIsImageLoaded(true);
      setIsLoading(false);
    }

    img.onerror = () => {
      setIsImageLoaded(true);
      setIsLoading(false);
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  function handlePasswordError(error: string) {
    setPasswordError(error);
  }
  
   // Gets all the customers & stores the result in a stare variable
  function getCustomers() {
    fetch("http://127.0.0.1:8000/api/customers")
      .then(response => response.json())
      .then(response => setCustomers(response))
      .catch(error => console.error('ERROR:', error));
  }

  // Gets all the staff & stores the result in a state variable
  function getStaff() {
    fetch("http://127.0.0.1:8000/api/staff")
      .then(response => response.json())
      .then(response => setStaff(response))
      .catch(error => console.error('ERROR:', error));
  }

  useEffect(() => {
      if (opened && customers.length === 0 && staff.length === 0) {
      getStaff();
      getCustomers();
    }
  }, [opened, customers, staff]);

  /**
   * Handless the login & checks password validity
   * @param userParam The user object to login
   * @param password User's password input
   */
  function handleLogin(userParam: CustomerType | StaffType, password: string) {
    if (password === userParam?.password_hash) {
      login(userParam);
      setLoginSuccessful(true);
      navigate("/home");
    } else {
      setPasswordError(i18n.t("login.incorrect-password"));
    }
  }

  // Handles signing up a customer & adding them to the database
  async function handleSignup(custInfo: CustomerType) {
    let newCustomerId: number | null = null;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/customers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          created_at: custInfo.created_at,
          customer_name: custInfo.customer_name,
          email: custInfo.email,
          password_hash: custInfo.password_hash,
          phone: custInfo.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        notifications.show({
          title: i18n.t("success"),
          message: i18n.t("signup.created"),
        });
        newCustomerId = data.id;
      } else {
        // Handle validation errors
        if (response.status === 422) {
          const errorMessages = data.detail.map((err: any) => err.msg).join(", ");
          setPasswordError(errorMessages); // Pass the error message to SignupContent
        } else {
          notifications.show({
            title: i18n.t("error"),
            message: data.detail || i18n.t("signup.error"),
          });
        }
        return; // Stop further execution if there's an error
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: i18n.t("error"),
        message: i18n.t("signup.error"),
      });
    }

    if (newCustomerId) {
      // Fetch the newly created customer and log them in
      const response = await fetch("http://127.0.0.1:8000/api/customers/");
      const newCustomerList = await response.json();
      const foundCust = newCustomerList.find(
        (cust: CustomerType) => cust.customer_id === newCustomerId
      );

      login(foundCust);
      navigate("/home");
    }
  }

  console.log('%cWe could probably export the background image into its own file but it\'s not necessary', 'color:turquoise')

  if (showLandingPage) {
    return (
      <Box>
        <LoadingOverlay visible={isLoading} zIndex={1000} loaderProps={{ type: "dots" }} />
        {isImageLoaded &&
          <BackgroundImage
            src="/images/restaurant.jpg"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <Center h="100%" style={{ display: "flex", flexDirection: "column" }}>
              <Title
                bd="5px solid rgb(19, 139, 236)"
                c="white"
                order={1}
                bg="black"
                p="md"
                style={{ borderRadius: "10px" }}
              >
                {i18n.t("login.title")}  
              </Title>
              <Button size="md" mt="lg" onClick={() => setShowLandingPage(false)}>
                {i18n.t("login.button")}
              </Button>
            </Center>
            <Box
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text size="xs">{i18n.t("login.copyright")}</Text>
            </Box>
          </BackgroundImage>
        }
      </Box>
    );
  }

  return (
    <Modal.Root opened={!loginSuccessful} onClose={() => {}}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {toggleValue === "login" ? <>{i18n.t("login.login")}</> : <>{i18n.t("signup.signup")}</>}
            {toggleValue === "signup" &&
              <Text mt="xs" display="block" span size="xs">{i18n.t("signup.customer-accounts")}</Text>
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap="sm">
            {toggleValue === "login" &&
              <LoginContent
                customers={customers}
                staff={staff}
                passwordError={passwordError}
                handlePasswordError={handlePasswordError}
                onLoginClick={(userparam: CustomerType | StaffType | undefined, password: string) => {
                  userparam && handleLogin(userparam, password);
                }}
                onToggle={toggle}
              />
            }
            {toggleValue === "signup" &&
              <SignupContent
                onSignupClick={(custInfo: CustomerType) => handleSignup(custInfo)}
                onToggle={toggle}
              />
            }
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
