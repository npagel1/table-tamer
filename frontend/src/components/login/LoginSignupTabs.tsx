import { Tabs, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { CustomerType, StaffType } from "../../PageLayout";

interface LoginSignupTabsProps {
  activeTab: string;
  customers: CustomerType[];
  noUserMessage: string | undefined;
  onSetActiveTab: (value: string) => void;
  onSetUsernameValue: (value: string) => void;
  staff: StaffType[];
  usernameValue: string;
}

export default function LoginSignupTabs(props: LoginSignupTabsProps) {
  const { i18n } = useTranslation();

  return (
    <Tabs
      value={props.activeTab}
      onChange={newTab => {
        newTab && props.onSetActiveTab(newTab);
        props.onSetUsernameValue("");
      }}
      variant="outline">
      <Tabs.List grow mb="lg">
        <Tabs.Tab value="customer">
          {i18n.t("login.customer-login")}
        </Tabs.Tab>
        <Tabs.Tab value="staff">
        {i18n.t("login.staff-login")}
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="customer">
        <TextInput
          label={i18n.t("credentials.username")}
          value={props.usernameValue}
          onChange={event => props.onSetUsernameValue(event.currentTarget.value)}
          error={props.noUserMessage}
        />
      </Tabs.Panel>
      <Tabs.Panel value="staff">
        <TextInput
          label={i18n.t("credentials.username")}
          value={props.usernameValue}
          onChange={event => props.onSetUsernameValue(event.currentTarget.value)}
        />
      </Tabs.Panel>
    </Tabs>
  )
}