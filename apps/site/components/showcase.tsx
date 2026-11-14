"use client";

import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Chips,
  Field,
  Input,
  Label,
  Message,
  Progress,
  Slider,
  Spinner,
  StatCard,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Transcript,
  toast,
  useConfirm,
} from "wixzel-ui";
import { ArrowRightIcon, MagnifyingGlassIcon, PhoneCallIcon, TrashIcon } from "wixzel-ui/icons";
import { cn } from "wixzel-ui/utils";

function Tile({ caption, className, children }: { caption: string; className?: string; children: React.ReactNode }) {
  return (
    <Card className={cn("flex flex-col justify-between gap-6 p-5", className)}>
      <div className="flex flex-col gap-4">{children}</div>
      <p className="text-caption text-fg-subtle">{caption}</p>
    </Card>
  );
}

/** The library, live: everything here is the real component, ready to press. */
export function Showcase() {
  const confirm = useConfirm();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Tile caption="Press and hold: buttons shrink to 96% and ease back. Loading keeps the width.">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" iconEnd={<ArrowRightIcon />} onClick={() => toast.success("Saved")}>
            Save changes
          </Button>
          <Button>Preview</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button loading>Deploying</Button>
          <Button
            variant="danger"
            iconStart={<TrashIcon />}
            onClick={async () => {
              if (await confirm({ title: "Delete this agent?", description: "Its calls and recordings go with it.", tone: "danger", confirmLabel: "Delete" }))
                toast("Deleted");
            }}
          >
            Delete
          </Button>
        </div>
      </Tile>

      <Tile caption="Fields are filled, not outlined. Focus is a solid edge in the accent, never a glow.">
        <Field label="Agent name" hint="Callers hear this name.">
          <Input placeholder="Front desk" />
        </Field>
        <Input leading={<MagnifyingGlassIcon />} placeholder="Search calls" />
      </Tile>

      <Tile caption="Checks draw themselves in. The switch thumb stretches while you hold it.">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="sc-record">Record calls</Label>
          <Switch id="sc-record" defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="sc-transcribe">Send transcripts by email</Label>
          <Checkbox id="sc-transcribe" defaultChecked />
        </div>
        <Slider defaultValue={[64]} aria-label="Volume" />
      </Tile>

      <Tile caption="Selection is ink: a solid block of text colour. The ink slides between tabs.">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="missed">Missed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" />
          <TabsContent value="live" />
          <TabsContent value="missed" />
        </Tabs>
        <Chips type="multiple" defaultValue={["inbound"]}>
          <Chip value="inbound" count={128}>Inbound</Chip>
          <Chip value="outbound" count={42}>Outbound</Chip>
          <Chip value="voicemail">Voicemail</Chip>
        </Chips>
      </Tile>

      <Tile caption="Numbers are tabular. A delta is green when the move is good, whichever way it goes.">
        <StatCard label="Calls answered" icon={<PhoneCallIcon />} value="1,284" delta={12.4} trend={[8, 11, 9, 14, 13, 17, 21]} />
      </Tile>

      <Tile caption="Status colours are never the accent, and the accent never means success.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success" dot pulse>On a call</Badge>
          <Badge tone="warning">Low balance</Badge>
          <Badge tone="danger" appearance="solid">Failed</Badge>
          <Badge tone="accent">New</Badge>
        </div>
        <Alert tone="info" title="Carrier connected">Calls to +1 numbers now go out over your own trunk.</Alert>
      </Tile>

      <Tile caption="Agent on the start side, the person on the end side. Streaming text ends in a block caret." className="lg:col-span-2">
        <Transcript>
          <Message from="agent" name="Front desk">Thanks for calling. Would you like the 3 pm slot or the 4 pm one?</Message>
          <Message from="person" name="Priya">Four works.</Message>
          <Message from="agent" name="Front desk" streaming>Booked for 4 pm. You&apos;ll get a text with the</Message>
        </Transcript>
      </Tile>

      <Tile caption="Initials on a soft gradient. Groups fan out on hover. The spinner is a ring.">
        <div className="flex items-center justify-between gap-4">
          <AvatarGroup>
            <Avatar name="Priya Nair" status="online" />
            <Avatar name="Omar Haddad" />
            <Avatar name="Lena Park" />
            <Avatar name="Sam Okafor" />
          </AvatarGroup>
          <Spinner />
        </div>
        <Progress value={72} label="Monthly minutes" showValue />
      </Tile>
    </div>
  );
}
