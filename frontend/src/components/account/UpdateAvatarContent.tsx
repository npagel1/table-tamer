import { Button, Center, Collapse, ColorInput, Select, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import NiceAvatar, { AvatarFullConfig, EarSize, EyeBrowStyle, EyeStyle, genConfig, GlassesStyle, HairStyle, HatStyle, MouthStyle, NoseStyle, Sex, ShirtStyle } from 'react-nice-avatar'
import { CustomerType } from "../../PageLayout";

interface UpdateAvatarContentProps {
  activeUser: CustomerType;
  onUpdatePic: (newPic: AvatarFullConfig) => void;
}

export default function UpdateAvatarContent(props: UpdateAvatarContentProps) {
  const [openedCollapse , { toggle }] = useDisclosure(false);
  // const initialConfig: AvatarConfig = props.activeUser?.customer_pic ? JSON.parse(props.activeUser.customer_pic) : {};
  // const initialConfig: AvatarFullConfig = props.activeUser?.customer_pic ? JSON.parse(props.activeUser.customer_pic) : {};
  // console.log('props.activeUser.customer_pic:', props.activeUser.customer_pic)
  // const initialConfig: AvatarFullConfig = props.activeUser?.customer_pic ? JSON.parse(props.activeUser.customer_pic) : {};

  // const [sex, setSex] = useState<Sex>(initialConfig.sex || "woman");
  // const [faceColor, setFaceColor] = useState<string>(initialConfig.faceColor || "royalblue");
  // const [hairColor, setHairColor] = useState<string>(initialConfig.hairColor || "royalblue");
  // const [hairStyle, setHairStyle] = useState<HairStyle>(initialConfig.hairStyle || 'normal');
  // const [hatStyle, setHatStyle] = useState<HatStyle>(initialConfig.hatStyle || "none");
  // const [eyeStyle, setEyeStyle] = useState<EyeStyle>(initialConfig.eyeStyle || "circle");
  // const [glassesStyle, setGlassesStyle] = useState<GlassesStyle>(initialConfig.glassesStyle || "none");
  // const [noseStyle, setNoseStyle] = useState<NoseStyle>(initialConfig.noseStyle || 'short');
  // const [mouthStyle, setMouthStyle] = useState<MouthStyle>(initialConfig.mouthStyle || 'smile');
  // const [shirtStyle, setShirtStyle] = useState<ShirtStyle>(initialConfig.shirtStyle || 'short');
  // const [eyeBrowStyle, setEyeBrowStyle] = useState<EyeBrowStyle>(initialConfig.eyeBrowStyle || 'upWoman');
  // const [earSize, setEarSize] = useState<EarSize>(initialConfig.earSize || 'small');

  const [sex, setSex] = useState<Sex>("woman");
  const [faceColor, setFaceColor] = useState<string>("royalblue");
  const [hairColor, setHairColor] = useState<string>("royalblue");
  const [hairStyle, setHairStyle] = useState<HairStyle>('normal');
  const [hatStyle, setHatStyle] = useState<HatStyle>("none");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>();
  const [glassesStyle, setGlassesStyle] = useState<GlassesStyle>("none");
  const [noseStyle, setNoseStyle] = useState<NoseStyle>('short');
  const [mouthStyle, setMouthStyle] = useState<MouthStyle>('smile');
  const [shirtStyle, setShirtStyle] = useState<ShirtStyle>('short');
  const [eyeBrowStyle, setEyeBrowStyle] = useState<EyeBrowStyle>('up');
  const [earSize, setEarSize] = useState<EarSize>('small');

  const hairStyleOptions = [
    { label: "Normal", value: "normal" },
    { label: "Thick", value: "thick" },
    { label: "Mohawk", value: "mohawk" },
    { label: "WomanLong", value: "womanLong" },
    { label: "WomanShort", value: "womanShort" }
  ];

  const hatStyleOptions = [
    { label: "Beanie", value: "beanie" },
    { label: "Turban", value: "turban" },
    { label: "None", value: "none" }
  ];

  const eyeStyleOptions = [
    { label: "circle", value: "circle" },
    { label: "Oval", value: "oval" },
    { label: "Smile", value: "smile" },
  ];

  const glassesStyleOptions = [
    { label: "Round", value: "round" },
    { label: "Square", value: "square" },
    { label: "None", value: "none" }
  ];

  const noseStyleOptions = [
    { label: "Short", value: "short" },
    { label: "Long", value: "long" },
    { label: "Round", value: "round" }
  ];

  const mouthStyleOptions = [
    { label: "Laugh", value: "laugh" },
    { label: "Smile", value: "smile" },
    { label: "Peace", value: "peace" }
  ];

  const shirtStyleOptions = [
    { label: "Hoody", value: "hoody" },
    { label: "Short", value: "short" },
    { label: "Polo", value: "polo" }
  ];

  const eyeBrowStyleOptions = [
    { label: "Up", value: "up" },
    { label: "Up Woman", value: "upWoman" }
  ];

  const earSizeOptions = [
    { label: "Small", value: "small" },
    { label: "Big", value: "big" },
  ];

  const config: AvatarFullConfig = genConfig({
    // ...configState,
    sex,
    faceColor,
    hairColor,
    hairStyle,
    hatStyle,
    glassesStyle,
    noseStyle, 
    mouthStyle,
    shirtStyle,
    eyeBrowStyle,
    earSize
  });

  const configJson = JSON.stringify(config);

  return (
    <>
      <Stack gap={0}>
        <Button
          style={{ alignSelf: "flex-end" }}
          size="compact-xs"
          variant="subtle"
          onClick={toggle}
        >
          Edit
        </Button>
        <Center>
          <NiceAvatar shape="rounded" style={{ width: '6rem', height: '6rem' }} {...config} />
        </Center>
        <Collapse in={openedCollapse}>
          <Stack>
            <Select
              value={sex}
              label="Woman/Man"
              data={[
                { label: "Woman", value: "woman" }, { label: "Man", value: "man" },
              ]}
              onChange={newValue => newValue && setSex(newValue as Sex)}
            />
            <ColorInput
              value={faceColor}
              size="sm"
              label="Face Color"
              onChange={value => setFaceColor(value)}
            />
            <ColorInput
              value={hairColor}
              size="sm"
              label="Hair Color"
              onChange={value => setHairColor(value)}
            />
            <Select
              value={hairStyle}
              label="Hair Style"
              data={hairStyleOptions}
              onChange={value => value && setHairStyle(value as HairStyle)}
            />
            <Select
              value={hatStyle}
              label="Hat Style"
              data={hatStyleOptions}
              onChange={value => value && setHatStyle(value as HatStyle)}
            />
            <Select
              value={eyeStyle}
              label="Eye Style"
              data={eyeStyleOptions}
              onChange={value => value && setEyeStyle(value as EyeStyle)}
            />
            <Select
              value={glassesStyle}
              label="Glasses Style"
              data={glassesStyleOptions}
              onChange={value => value && setGlassesStyle(value as GlassesStyle)}
            />
            <Select
              value={noseStyle}
              label="Nose Style"
              data={noseStyleOptions}
              onChange={value => value && setNoseStyle(value as NoseStyle)}
            />
            <Select
              value={mouthStyle}
              label="Mouth Style"
              data={mouthStyleOptions}
              onChange={value => value && setMouthStyle(value as MouthStyle)}
            />
            <Select
              value={shirtStyle}
              label="Shirt Style"
              data={shirtStyleOptions}
              onChange={value => value && setShirtStyle(value as ShirtStyle)}
            />
            <Select
              value={eyeBrowStyle}
              label="Eye Brow Style"
              data={eyeBrowStyleOptions}
              onChange={value => value && setEyeBrowStyle(value as EyeBrowStyle)}
            />
            <Select
              value={earSize}
              label="Ear Size"
              data={earSizeOptions}
              onChange={value => value && setEarSize(value as EarSize)}
            />
            <Button
              // onClick={() => props.onUpdatePic(JSON.stringify(config))}
              onClick={() => props.onUpdatePic(config)}
            >
              Save
            </Button>
          </Stack>
        </Collapse>
      </Stack>
      {/* <Modal.Root opened={opened} onClose={close}>
        <Modal.Content>
          <Modal.Body>
            <NiceAvatar shape="rounded" style={{ width: '6rem', height: '6rem' }} {...config} />
            <Fieldset legend="Avatar Settings">
              <Select
                label="Woman/Man"
                data={[
                  { label: "Woman", value: "woman" }, { label: "Man", value: "man" },
                ]}
                onChange={newValue => {
                  if (newValue) {
                    setConfigState(prevState => {
                      return {
                        ...prevState,
                        sex: newValue,
                      };
                    })
                  }
                }}
              />
            </Fieldset>
            <Group justify="flex-end">
              <Button onClick={close}>Cancel</Button>
              <Button
                onClick={() => {
                  close();
                }}
              >
                Update
              </Button>
            </Group>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root> */}
    </>
  )
}