import { useEffect, useState } from "react";
import { Avatar, Button, Center, DEFAULT_THEME, Group, Image, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconCircleX, IconUpload } from "@tabler/icons-react";
import '@mantine/dropzone/styles.css';

import { CustomerType } from "../../PageLayout";
import { useTranslation } from "react-i18next";

interface AvatarContentProps {
  activeUser: CustomerType;
  onUpdatePic: (newPic: string | null) => void;
  userImage: string | undefined;
}

export default function AvatarContent(props: AvatarContentProps) {
  const { i18n } = useTranslation();
  const [opened, { open, close }] = useDisclosure(false);
  const [imageFile, setImageFile] = useState<FileWithPath | null>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const newUrl = URL.createObjectURL(imageFile);
      setImageUrl(newUrl);
      convertToBase64(imageFile);
      return () => URL.revokeObjectURL(newUrl);
    } else {
      setImageUrl(null);
      setBase64String(null);
    }
  }, [imageFile]);

  const convertToBase64 = (file: FileWithPath) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result as string);
    };
    reader.onerror = (error) => {
      console.error("Error converting to Base64:", error);
      setBase64String(null);
      // if (onSaveError) {
      //   onSaveError(error);
      // }
    };
    reader.readAsDataURL(file);
  };

  const avatarName = !props.activeUser?.customer_pic ? props.activeUser?.customer_name : "";

  return (
    <>
      <Stack>
        <Button
          style={{ alignSelf: "flex-end" }}
          size="compact-xs"
          variant="subtle"
          onClick={open}
        >
          {i18n.t("account.edit")}
        </Button>
        <Stack align="center" gap="xs">
          <Avatar
            size="xl"
            name={avatarName}
            src={props.activeUser?.customer_pic || null}
            alt={i18n.t("account.customer-pic")}
          />
          <Text>{props.activeUser?.customer_name ?? "User"}</Text>
        </Stack>
      </Stack>
      <Modal
        opened={opened}
        onClose={() => {
          setImageFile(null);
          close();
        }}
        withCloseButton={false}
      >
        <Dropzone
          bd={imageFile
            ? `1px solid ${DEFAULT_THEME.colors.blue[9]}`
            : "1px solid transparent"
          }
          onDrop={files => setImageFile(files[0])}
        >
          <Group justify="center">
            <Dropzone.Accept>
              Accept
            </Dropzone.Accept>
            <Dropzone.Reject>
              Reject
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconUpload size={40} />
            </Dropzone.Idle>
            <Text size="md">{i18n.t("account.drop-image")}</Text>
          </Group>
          {imageFile &&
            <Center mt="md">
              <Image
                style={{ maxHeight: "300px", width: "auto" }}
                src={imageUrl}
              />
            </Center>
          }
        </Dropzone>
        {imageFile &&
          <Stack mt="md" align="center">
            <Group justify="center">
              <Button
                bg="tomato"
                leftSection={<IconCircleX />}
                onClick={() => setImageFile(null)}
              >
                {i18n.t("account.remove")}
              </Button>
              <Button
                leftSection={<IconUpload />}
                onClick={() => {
                  base64String && props.onUpdatePic(base64String);
                  close();
                }}
              >
                {i18n.t("account.upload")}
              </Button>
            </Group>
          </Stack>
        }
        {(props.activeUser.customer_pic && !imageFile) &&
          <Stack mt="md" align="center">
            <Avatar
              size="xl"
              src={props.userImage}
              alt={i18n.t("account.customer-pic")}
            />
            <Button
              size="xs"
              bg="tomato"
              leftSection={<IconCircleX />}
              onClick={() => {
                props.onUpdatePic(null);
                close();
              }}
            >
              {i18n.t("account.delete")}
            </Button>
          </Stack>
        }
      </Modal>
    </>
  );
}