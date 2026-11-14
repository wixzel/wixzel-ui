"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ActionBar,
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  BarList,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  CheckboxCard,
  CheckboxCards,
  Chip,
  Chips,
  ColumnChart,
  Combobox,
  CopyField,
  Delta,
  DescriptionList,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  FileDrop,
  InfoTip,
  Input,
  Kbd,
  Label,
  Message,
  NavTab,
  NavTabs,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioCard,
  RadioCards,
  RadioGroup,
  RadioGroupItem,
  Section,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  SidebarItem,
  SidebarSection,
  SiteSidebar,
  SiteSidebarLink,
  SiteSidebarSection,
  Skeleton,
  Slider,
  Sparkline,
  Spinner,
  SplitBar,
  StatCard,
  Stepper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tile,
  Timeline,
  Tooltip,
  Transcript,
  toast,
  useConfirm,
} from "wixzel-ui";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  CopyIcon,
  CreditCardIcon,
  DotsThreeIcon,
  GearIcon,
  GlobeIcon,
  HouseIcon,
  KeyIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PhoneCallIcon,
  PhoneIcon,
  PlusIcon,
  RobotIcon,
  ShieldCheckIcon,
  TrashIcon,
  UploadSimpleIcon,
  UsersIcon,
  WaveformIcon,
} from "wixzel-ui/icons";
import { CodeBlock } from "./code-block";

interface Entry {
  id: string;
  name: string;
  detail: string;
  code: string;
  demo: React.ComponentType;
  /** Let the preview fill the stage instead of centring a small thing in it. */
  wide?: boolean;
}

interface Group {
  id: string;
  title: string;
  entries: Entry[];
}

// ---------------------------------------------------------------- Demos

function DropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button iconEnd={<DotsThreeIcon />}>Agent</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Front desk</DropdownMenuLabel>
        <DropdownMenuItem>
          <PencilSimpleIcon />
          Rename
          <DropdownMenuShortcut keys={["⌘", "R"]} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CopyIcon />
          Duplicate
          <DropdownMenuShortcut keys={["⌘", "D"]} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">
          <TrashIcon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

function ConfirmDemo() {
  const confirm = useConfirm();
  return (
    <Button
      variant="danger"
      iconStart={<TrashIcon />}
      onClick={async () => {
        const ok = await confirm({
          title: "Delete this agent?",
          description: "Its calls and recordings are deleted with it.",
          tone: "danger",
          confirmLabel: "Delete",
        });
        if (ok) toast("Agent deleted");
      }}
    >
      Delete agent
    </Button>
  );
}

function ActionBarDemo() {
  const [dirty, setDirty] = useState(true);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Field label="Greeting">
        <Input defaultValue="Thanks for calling Acme." onChange={() => setDirty(true)} />
      </Field>
      {dirty ? (
        <ActionBar>
          <span className="text-body-sm text-fg-muted">Unsaved changes</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setDirty(false)}>
              Discard
            </Button>
            <Button size="sm" variant="primary" onClick={() => (setDirty(false), toast.success("Saved"))}>
              Save
            </Button>
          </div>
        </ActionBar>
      ) : (
        <p className="text-caption text-fg-subtle">Type in the field to bring the bar back.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- Catalogue

export const groups: Group[] = [
  {
    id: "actions",
    title: "Actions",
    entries: [
      {
        id: "button",
        name: "Button",
        detail: "Shrinks to 96% on press. Filled buttons keep a darker rim and a top highlight. Loading keeps the width.",
        demo: () => (
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary">Primary</Button>
              <Button>Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button size="sm" iconStart={<PlusIcon />}>New</Button>
              <Button iconEnd={<ArrowRightIcon />}>Continue</Button>
              <Button variant="primary" shortcut="⌘↵">Send</Button>
              <Button loading>Saving</Button>
            </div>
          </div>
        ),
        code: `<Button variant="primary">Primary</Button>
<Button iconEnd={<ArrowRightIcon />}>Continue</Button>
<Button variant="primary" shortcut="⌘↵">Send</Button>
<Button loading>Saving</Button>`,
      },
      {
        id: "icon-button",
        name: "Icon button",
        detail: "The same button, square. Name it with a tooltip; it waits 400ms the first time, then opens instantly.",
        demo: () => (
          <div className="flex gap-2">
            {[
              { icon: <MagnifyingGlassIcon />, label: "Search", keys: ["⌘", "K"] },
              { icon: <BellIcon />, label: "Notifications" },
              { icon: <GearIcon />, label: "Settings", keys: ["⌘", ","] },
            ].map((b) => (
              <Tooltip key={b.label} content={b.label} shortcut={b.keys}>
                <Button size="icon" variant="ghost" aria-label={b.label}>
                  {b.icon}
                </Button>
              </Tooltip>
            ))}
          </div>
        ),
        code: `<Tooltip content="Search" shortcut={["⌘", "K"]}>
  <Button size="icon" variant="ghost" aria-label="Search">
    <MagnifyingGlassIcon />
  </Button>
</Tooltip>`,
      },
      {
        id: "dropdown-menu",
        name: "Dropdown menu",
        detail: "Sharpens out of a blur as it drifts from its trigger. Shortcuts are keycaps, one per key.",
        demo: DropdownDemo,
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild><Button>Agent</Button></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem><PencilSimpleIcon />Rename<DropdownMenuShortcut keys={["⌘", "R"]} /></DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem tone="danger"><TrashIcon />Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      },
      {
        id: "kbd",
        name: "Kbd",
        detail: "A keycap: an even 1px edge on all four sides.",
        demo: () => (
          <p className="text-body-sm text-fg-muted">
            Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search, <Kbd>Esc</Kbd> to close.
          </p>
        ),
        code: `Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.`,
      },
    ],
  },
  {
    id: "forms",
    title: "Forms",
    entries: [
      {
        id: "input",
        name: "Input",
        detail: "Filled with a tint, no border. Focus is a solid accent edge. A leading icon takes the accent while focused.",
        demo: () => (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Input placeholder="Agent name" />
            <Input leading={<MagnifyingGlassIcon />} placeholder="Search calls" />
            <Input leading={<GlobeIcon />} trailing={<span className="text-caption text-fg-subtle">.acme.com</span>} placeholder="subdomain" />
          </div>
        ),
        code: `<Input placeholder="Agent name" />
<Input leading={<MagnifyingGlassIcon />} placeholder="Search calls" />`,
      },
      {
        id: "field",
        name: "Field",
        detail: "Label, hint and error wired for screen readers. Errors fade in and say what to do.",
        demo: () => (
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Field label="Phone number" hint="Callers see this number.">
              <Input leading={<PhoneIcon />} placeholder="+1 555 0100" />
            </Field>
            <Field label="Webhook URL" error="Start the URL with https://" required>
              <Input defaultValue="http://acme.com/hook" />
            </Field>
          </div>
        ),
        code: `<Field label="Webhook URL" error="Start the URL with https://" required>
  <Input defaultValue="http://acme.com/hook" />
</Field>`,
      },
      {
        id: "textarea",
        name: "Textarea",
        detail: "Grows with its content.",
        demo: () => (
          <div className="w-full max-w-sm">
            <Field label="Instructions">
              <Textarea placeholder="Greet the caller by name, then ask how you can help." />
            </Field>
          </div>
        ),
        code: `<Field label="Instructions">
  <Textarea placeholder="Greet the caller by name…" />
</Field>`,
      },
      {
        id: "select",
        name: "Select",
        detail: "A filled trigger and a list that sharpens out of a blur.",
        demo: () => (
          <div className="w-full max-w-xs">
            <Select defaultValue="en-US">
              <SelectTrigger aria-label="Language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="en-GB">English (UK)</SelectItem>
                <SelectItem value="hi-IN">Hindi</SelectItem>
                <SelectItem value="ar-AE">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ),
        code: `<Select defaultValue="en-US">
  <SelectTrigger aria-label="Language"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="en-US">English (US)</SelectItem>
    <SelectItem value="hi-IN">Hindi</SelectItem>
  </SelectContent>
</Select>`,
      },
      {
        id: "combobox",
        name: "Combobox",
        detail: "A select you can type into, with groups, icons and descriptions.",
        demo: () => (
          <div className="w-full max-w-xs">
            <Combobox
              aria-label="Voice engine"
              placeholder="Choose an engine"
              options={[
                {
                  label: "Realtime",
                  options: [
                    { value: "gpt-realtime", label: "GPT Realtime", icon: <LightningIcon /> },
                    { value: "gemini-live", label: "Gemini Live", icon: <LightningIcon /> },
                  ],
                },
                {
                  label: "Pipeline",
                  options: [
                    { value: "deepgram", label: "Deepgram + Claude", icon: <WaveformIcon />, description: "Speech to text, then an LLM" },
                    { value: "eleven", label: "ElevenLabs", icon: <WaveformIcon /> },
                  ],
                },
              ]}
            />
          </div>
        ),
        code: `<Combobox
  placeholder="Choose an engine"
  options={[
    { label: "Realtime", options: [{ value: "gpt-realtime", label: "GPT Realtime" }] },
    { label: "Pipeline", options: [{ value: "deepgram", label: "Deepgram + Claude" }] },
  ]}
/>`,
      },
      {
        id: "checkbox-radio-switch",
        name: "Checkbox, radio, switch",
        detail: "The check draws itself in. The radio dot grows from nothing. The switch thumb stretches while held.",
        demo: () => (
          <div className="grid w-full max-w-md gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="g-c1" defaultChecked />
                <Label htmlFor="g-c1">Record calls</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="g-c2" />
                <Label htmlFor="g-c2">Email transcripts</Label>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="g-s1">Voicemail</Label>
                <Switch id="g-s1" defaultChecked />
              </div>
            </div>
            <RadioGroup defaultValue="all" className="flex flex-col gap-3">
              {[
                ["all", "Every call"],
                ["missed", "Missed calls only"],
                ["none", "Never"],
              ].map(([v, l]) => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v!} id={`g-r-${v}`} />
                  <Label htmlFor={`g-r-${v}`}>{l}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ),
        code: `<Checkbox id="record" defaultChecked />
<Switch defaultChecked />
<RadioGroup defaultValue="all">
  <RadioGroupItem value="all" id="all" /><Label htmlFor="all">Every call</Label>
</RadioGroup>`,
      },
      {
        id: "slider",
        name: "Slider",
        detail: "A thin track that fills with the accent. The thumb stretches while held.",
        demo: () => (
          <div className="w-full max-w-sm">
            <Slider defaultValue={[60]} aria-label="Speaking rate" />
          </div>
        ),
        code: `<Slider defaultValue={[60]} aria-label="Speaking rate" />`,
      },
      {
        id: "radio-cards",
        name: "Radio cards",
        detail: "Options as cards. Arrow keys move between them; the chosen one takes the accent wash and a check.",
        wide: true,
        demo: () => (
          <RadioCards defaultValue="growth" columns={3} className="w-full">
            <RadioCard value="starter" title="Starter" description="1 agent, 500 minutes" aside="$29" />
            <RadioCard value="growth" title="Growth" description="5 agents, 3,000 minutes" aside="$99" />
            <RadioCard value="scale" title="Scale" description="Unlimited agents" aside="$299" />
          </RadioCards>
        ),
        code: `<RadioCards defaultValue="growth" columns={3}>
  <RadioCard value="starter" title="Starter" description="1 agent, 500 minutes" aside="$29" />
  <RadioCard value="growth" title="Growth" description="5 agents, 3,000 minutes" aside="$99" />
</RadioCards>`,
      },
      {
        id: "checkbox-cards",
        name: "Checkbox cards",
        detail: "The same cards, for picking several.",
        wide: true,
        demo: () => (
          <CheckboxCards defaultValue={["calls"]} columns={2} className="w-full">
            <CheckboxCard value="calls" icon={<PhoneCallIcon />} title="Calls" description="Every inbound and outbound call" />
            <CheckboxCard value="billing" icon={<CreditCardIcon />} title="Billing" description="Invoices and low balance" />
          </CheckboxCards>
        ),
        code: `<CheckboxCards defaultValue={["calls"]} columns={2}>
  <CheckboxCard value="calls" icon={<PhoneCallIcon />} title="Calls" description="Every call" />
  <CheckboxCard value="billing" icon={<CreditCardIcon />} title="Billing" description="Invoices" />
</CheckboxCards>`,
      },
      {
        id: "chips",
        name: "Chips",
        detail: "Filter chips, single or multiple choice. Chosen chips are inked, like the current tab.",
        demo: () => (
          <Chips type="multiple" defaultValue={["inbound"]}>
            <Chip value="inbound" count={128}>Inbound</Chip>
            <Chip value="outbound" count={42}>Outbound</Chip>
            <Chip value="voicemail" count={7}>Voicemail</Chip>
          </Chips>
        ),
        code: `<Chips type="multiple" defaultValue={["inbound"]}>
  <Chip value="inbound" count={128}>Inbound</Chip>
  <Chip value="outbound" count={42}>Outbound</Chip>
</Chips>`,
      },
      {
        id: "file-drop",
        name: "File drop",
        detail: "Drop or browse. Darkens a shade while a file is over it.",
        wide: true,
        demo: () => <FileDrop hint="PDF or DOCX, up to 10 MB" accept=".pdf,.docx" className="w-full" />,
        code: `<FileDrop hint="PDF or DOCX, up to 10 MB" accept=".pdf,.docx" />`,
      },
      {
        id: "copy-field",
        name: "Copy field",
        detail: "Masks secrets to their last four characters. Copy turns into a check for a moment.",
        demo: () => (
          <div className="w-full max-w-sm">
            <CopyField value="wx_live_8f3k2m9q7z1c4v6b" secret label="Copy API key" />
          </div>
        ),
        code: `<CopyField value={apiKey} secret label="Copy API key" />`,
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    entries: [
      {
        id: "tabs",
        name: "Tabs",
        detail: "The current tab is inked, and the ink slides between tabs.",
        demo: () => (
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calls">Calls</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" />
            <TabsContent value="calls" />
            <TabsContent value="settings" />
          </Tabs>
        ),
        code: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="calls">Calls</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>`,
      },
      {
        id: "nav-tabs",
        name: "Nav tabs",
        detail: "Tabs that are links, for pages under one heading.",
        demo: () => (
          <NavTabs>
            <NavTab href="#nav-tabs" current>General</NavTab>
            <NavTab href="#nav-tabs">Members</NavTab>
            <NavTab href="#nav-tabs">Billing</NavTab>
          </NavTabs>
        ),
        code: `<NavTabs>
  <NavTab asChild current><Link href="/settings">General</Link></NavTab>
  <NavTab asChild><Link href="/settings/members">Members</Link></NavTab>
</NavTabs>`,
      },
      {
        id: "breadcrumb",
        name: "Breadcrumb",
        detail: "A caret trail; the current page in full ink.",
        demo: () => <Breadcrumb items={[{ label: "Agents", href: "#breadcrumb" }, { label: "Front desk", href: "#breadcrumb" }, { label: "Calls" }]} />,
        code: `<Breadcrumb items={[{ label: "Agents", href: "/agents" }, { label: "Front desk", href: "/agents/1" }, { label: "Calls" }]} />`,
      },
      {
        id: "pagination",
        name: "Pagination",
        demo: PaginationDemo,
        detail: "Pages with tabular numbers; the current one inked.",
        code: `const [page, setPage] = useState(1);
<Pagination page={page} pageCount={12} onPageChange={setPage} />`,
      },
      {
        id: "stepper",
        name: "Stepper",
        detail: "Steps that are done, current, upcoming, loading or in error.",
        wide: true,
        demo: () => (
          <Stepper
            className="w-full"
            current={1}
            steps={[
              { title: "Connect carrier", description: "Twilio" },
              { title: "Pick a number" },
              { title: "Choose a voice" },
              { title: "Go live" },
            ]}
          />
        ),
        code: `<Stepper current={1} steps={[
  { title: "Connect carrier", description: "Twilio" },
  { title: "Pick a number" },
  { title: "Choose a voice" },
]} />`,
      },
      {
        id: "sidebar",
        name: "Sidebar",
        detail: "Grouped navigation on a tinted panel. The current page is inked; counts sit on the end.",
        demo: () => (
          <div className="w-60 rounded-lg bg-bg-subtle p-2">
            <SidebarSection label="Workspace">
              <SidebarItem href="#sidebar" icon={<HouseIcon />} active>Home</SidebarItem>
              <SidebarItem href="#sidebar" icon={<RobotIcon />} aside={<Badge size="sm">3</Badge>}>Agents</SidebarItem>
              <SidebarItem href="#sidebar" icon={<PhoneCallIcon />} aside={<Badge size="sm" tone="success" dot pulse>2</Badge>}>Live calls</SidebarItem>
              <SidebarItem href="#sidebar" icon={<UsersIcon />}>Team</SidebarItem>
            </SidebarSection>
          </div>
        ),
        code: `<SidebarSection label="Workspace">
  <SidebarItem asChild icon={<HouseIcon />} active><Link href="/">Home</Link></SidebarItem>
  <SidebarItem asChild icon={<RobotIcon />} aside={<Badge size="sm">3</Badge>}><Link href="/agents">Agents</Link></SidebarItem>
</SidebarSection>`,
      },
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    entries: [
      {
        id: "alert",
        name: "Alert",
        detail: "Status tones, never the accent. Say what happened and what to do.",
        wide: true,
        demo: () => (
          <div className="flex w-full flex-col gap-3">
            <Alert tone="info" title="Carrier connected">Calls to +1 numbers now go out over your own trunk.</Alert>
            <Alert tone="warning" title="Balance is low" action={<Button size="sm">Top up</Button>}>
              About 40 minutes left at your current rate.
            </Alert>
            <Alert tone="danger" title="Webhook failed">Acme returned 500 three times. Check the endpoint, then retry.</Alert>
          </div>
        ),
        code: `<Alert tone="warning" title="Balance is low" action={<Button size="sm">Top up</Button>}>
  About 40 minutes left at your current rate.
</Alert>`,
      },
      {
        id: "badge",
        name: "Badge",
        detail: "Soft by default. A pulse sends out a slow ring for live states.",
        demo: () => (
          <div className="flex flex-wrap justify-center gap-2">
            <Badge tone="success" dot pulse>On a call</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="warning">Pending</Badge>
            <Badge tone="danger" appearance="solid">Failed</Badge>
            <Badge tone="info" appearance="outline">Beta</Badge>
            <Badge>Draft</Badge>
          </div>
        ),
        code: `<Badge tone="success" dot pulse>On a call</Badge>
<Badge tone="danger" appearance="solid">Failed</Badge>`,
      },
      {
        id: "toast",
        name: "Toast",
        detail: "Rises in from a blur at the edge of the screen.",
        demo: () => (
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => toast("Copied to clipboard")}>Plain</Button>
            <Button onClick={() => toast.success("Agent published")}>Success</Button>
            <Button onClick={() => toast.error("Couldn't reach the carrier. Try again in a minute.")}>Error</Button>
          </div>
        ),
        code: `toast.success("Agent published");
toast.error("Couldn't reach the carrier. Try again in a minute.");`,
      },
      {
        id: "spinner-skeleton",
        name: "Spinner, skeleton",
        detail: "A ring that turns over a faint track. Skeletons carry a slow band of light.",
        wide: true,
        demo: () => (
          <div className="flex w-full items-center gap-6">
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
            </div>
            <div className="flex flex-1 items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        ),
        code: `<Spinner />
<Skeleton className="h-3 w-2/3" />`,
      },
      {
        id: "progress",
        name: "Progress",
        detail: "A thin bar on a tinted track that slides to its value.",
        demo: () => (
          <div className="flex w-full max-w-sm flex-col gap-4">
            <Progress value={72} label="Monthly minutes" showValue />
            <Progress value={92} tone="warning" label="Storage" showValue />
          </div>
        ),
        code: `<Progress value={72} label="Monthly minutes" showValue />`,
      },
      {
        id: "empty-state",
        name: "Empty state",
        detail: "What will appear here, and the action that adds the first one.",
        wide: true,
        demo: () => (
          <EmptyState
            className="w-full"
            icon={<RobotIcon />}
            title="No agents yet"
            description="An agent answers your calls with the voice and instructions you give it."
            actions={<Button variant="primary" iconStart={<PlusIcon />}>New agent</Button>}
          />
        ),
        code: `<EmptyState
  icon={<RobotIcon />}
  title="No agents yet"
  description="An agent answers your calls with the voice and instructions you give it."
  actions={<Button variant="primary" iconStart={<PlusIcon />}>New agent</Button>}
/>`,
      },
    ],
  },
  {
    id: "overlays",
    title: "Overlays",
    entries: [
      {
        id: "dialog",
        name: "Dialog",
        detail: "Sharpens out of a blur over a plain scrim. Actions sit in a footer band.",
        demo: () => (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Rename agent</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename agent</DialogTitle>
                <DialogDescription>Callers hear this name.</DialogDescription>
              </DialogHeader>
              <div className="px-6 pb-4">
                <Input defaultValue="Front desk" aria-label="Name" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="primary">Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ),
        code: `<Dialog>
  <DialogTrigger asChild><Button>Rename agent</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename agent</DialogTitle>
      <DialogDescription>Callers hear this name.</DialogDescription>
    </DialogHeader>
    …
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button variant="primary">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      },
      {
        id: "drawer",
        name: "Drawer",
        detail: "A panel that slides in from an edge, for details beside a list.",
        demo: () => (
          <Drawer>
            <DrawerTrigger asChild>
              <Button>Open call details</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Call with Priya</DrawerTitle>
                <DrawerDescription>Today at 4:02 pm · 3 min 12 s</DrawerDescription>
              </DrawerHeader>
              <DrawerBody>
                <DescriptionList
                  items={[
                    { term: "Agent", value: "Front desk" },
                    { term: "Outcome", value: <Badge tone="success">Booked</Badge> },
                    { term: "Number", value: "+1 555 0142" },
                  ]}
                />
              </DrawerBody>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button>Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ),
        code: `<Drawer>
  <DrawerTrigger asChild><Button>Open call details</Button></DrawerTrigger>
  <DrawerContent side="right">
    <DrawerHeader><DrawerTitle>Call with Priya</DrawerTitle></DrawerHeader>
    <DrawerBody>…</DrawerBody>
  </DrawerContent>
</Drawer>`,
      },
      {
        id: "confirm",
        name: "Confirm",
        detail: "Ask before something that can't be undone. One call, awaited.",
        demo: ConfirmDemo,
        code: `const confirm = useConfirm();
if (await confirm({ title: "Delete this agent?", tone: "danger", confirmLabel: "Delete" })) {
  await deleteAgent();
}`,
      },
      {
        id: "popover",
        name: "Popover",
        detail: "A floating panel that sharpens in toward its trigger's side.",
        demo: () => (
          <Popover>
            <PopoverTrigger asChild>
              <Button iconStart={<CalendarIcon />}>Office hours</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="flex flex-col gap-3">
                <p className="text-body-sm font-semibold">Office hours</p>
                <div className="flex items-center justify-between text-body-sm">
                  Weekdays
                  <span className="tabular-nums text-fg-muted">9:00 to 18:00</span>
                </div>
                <div className="flex items-center justify-between text-body-sm">
                  Answer after hours
                  <Switch size="sm" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ),
        code: `<Popover>
  <PopoverTrigger asChild><Button>Office hours</Button></PopoverTrigger>
  <PopoverContent>…</PopoverContent>
</Popover>`,
      },
      {
        id: "info-tip",
        name: "Info tip",
        detail: "A small question mark that explains a term in place.",
        demo: () => (
          <p className="flex items-center gap-1.5 text-body-sm font-medium">
            Concurrency
            <InfoTip>How many calls this agent can take at the same time.</InfoTip>
          </p>
        ),
        code: `Concurrency <InfoTip>How many calls this agent can take at the same time.</InfoTip>`,
      },
    ],
  },
  {
    id: "data",
    title: "Data",
    entries: [
      {
        id: "stat-card",
        name: "Stat card",
        detail: "A tabular value, a delta that is green when the move is good, and a trend with the latest point marked.",
        wide: true,
        demo: () => (
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <StatCard label="Calls answered" icon={<PhoneCallIcon />} value="1,284" delta={12.4} trend={[8, 11, 9, 14, 13, 17, 21]} />
            <StatCard label="Cost per call" icon={<CreditCardIcon />} value="$0.18" delta={-6.2} goodWhen="down" trend={[24, 23, 22, 22, 20, 19, 18]} />
          </div>
        ),
        code: `<StatCard label="Calls answered" icon={<PhoneCallIcon />} value="1,284" delta={12.4} trend={[8, 11, 9, 14, 13, 17, 21]} />
<StatCard label="Cost per call" value="$0.18" delta={-6.2} goodWhen="down" trend={…} />`,
      },
      {
        id: "sparkline",
        name: "Sparkline, delta",
        detail: "The two halves of a stat card, on their own.",
        demo: () => (
          <div className="flex w-full max-w-xs items-center gap-4">
            <Sparkline data={[3, 5, 4, 7, 6, 9, 12]} className="flex-1" />
            <Delta value={18.5} />
          </div>
        ),
        code: `<Sparkline data={[3, 5, 4, 7, 6, 9, 12]} />
<Delta value={18.5} />`,
      },
      {
        id: "column-chart",
        name: "Column chart",
        detail: "One or two series. Red and green are kept for status.",
        wide: true,
        demo: () => (
          <ColumnChart
            className="w-full"
            height={180}
            series={[
              { key: "inbound", label: "Inbound" },
              { key: "outbound", label: "Outbound", tone: "secondary" },
            ]}
            points={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
              key: d,
              label: d,
              values: { inbound: [42, 56, 48, 61, 70, 32, 24][i]!, outbound: [18, 22, 30, 26, 34, 12, 8][i]! },
            }))}
          />
        ),
        code: `<ColumnChart
  series={[{ key: "inbound", label: "Inbound" }, { key: "outbound", label: "Outbound", tone: "secondary" }]}
  points={[{ key: "mon", label: "Mon", values: { inbound: 42, outbound: 18 } }, …]}
/>`,
      },
      {
        id: "split-bar-bar-list",
        name: "Split bar, bar list",
        detail: "Thin rounded bars on a tinted track, with a 2px gap between parts.",
        wide: true,
        demo: () => (
          <div className="grid w-full gap-6 sm:grid-cols-2">
            <SplitBar
              segments={[
                { label: "Answered", value: 72, tone: "accent" },
                { label: "Voicemail", value: 18, tone: "info" },
                { label: "Missed", value: 10, tone: "neutral" },
              ]}
            />
            <BarList
              items={[
                { label: "Book an appointment", value: 412 },
                { label: "Opening hours", value: 268 },
                { label: "Speak to a person", value: 91 },
              ]}
            />
          </div>
        ),
        code: `<SplitBar segments={[{ label: "Answered", value: 72, tone: "accent" }, { label: "Missed", value: 10, tone: "neutral" }]} />
<BarList items={[{ label: "Book an appointment", value: 412 }, { label: "Opening hours", value: 268 }]} />`,
      },
      {
        id: "table",
        name: "Table",
        detail: "On a tinted panel. Tabular numbers; hover tints the row.",
        wide: true,
        demo: () => (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Caller</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead className="text-end">Length</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(
                [
                  { who: "Priya Nair", agent: "Front desk", tone: "success", outcome: "Booked", len: "3:12" },
                  { who: "Omar Haddad", agent: "Billing", tone: "info", outcome: "Answered", len: "1:48" },
                  { who: "Lena Park", agent: "Front desk", tone: "warning", outcome: "Callback", len: "0:52" },
                ] as const
              ).map((row) => (
                <TableRow key={row.who}>
                  <TableCell className="font-medium">{row.who}</TableCell>
                  <TableCell>{row.agent}</TableCell>
                  <TableCell>
                    <Badge tone={row.tone}>{row.outcome}</Badge>
                  </TableCell>
                  <TableCell className="text-end tabular-nums">{row.len}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ),
        code: `<Table>
  <TableHeader><TableRow><TableHead>Caller</TableHead><TableHead>Outcome</TableHead></TableRow></TableHeader>
  <TableBody>
    <TableRow><TableCell>Priya Nair</TableCell><TableCell><Badge tone="success">Booked</Badge></TableCell></TableRow>
  </TableBody>
</Table>`,
      },
      {
        id: "description-list",
        name: "Description list",
        detail: "Aligned label and value rows.",
        demo: () => (
          <DescriptionList
            className="w-full max-w-sm"
            items={[
              { term: "Plan", value: "Growth" },
              { term: "Renews", value: "1 December 2026" },
              { term: "Minutes left", value: "2,184" },
            ]}
          />
        ),
        code: `<DescriptionList items={[{ term: "Plan", value: "Growth" }, { term: "Renews", value: "1 December 2026" }]} />`,
      },
      {
        id: "timeline",
        name: "Timeline",
        detail: "Events joined by a hairline, each on a tinted marker.",
        demo: () => (
          <Timeline
            className="w-full max-w-sm"
            items={[
              { title: "Booked for 4 pm", time: "4:05 pm", tone: "success" },
              { title: "Transferred to Front desk", time: "4:03 pm" },
              { title: "Call started", time: "4:02 pm" },
            ]}
          />
        ),
        code: `<Timeline items={[
  { title: "Booked for 4 pm", time: "4:05 pm", tone: "success" },
  { title: "Call started", time: "4:02 pm" },
]} />`,
      },
      {
        id: "accordion",
        name: "Accordion",
        detail: "Rows on one tinted panel. Height opens smoothly; the chevron turns.",
        wide: true,
        demo: () => (
          <Accordion type="single" collapsible defaultValue="a" className="w-full">
            <AccordionItem value="a">
              <AccordionTrigger>Can I bring my own carrier?</AccordionTrigger>
              <AccordionContent>Yes. Connect Twilio, Telnyx, Plivo or any SIP trunk.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Which voices can I use?</AccordionTrigger>
              <AccordionContent>Any engine we support, or a clone of a voice you have rights to.</AccordionContent>
            </AccordionItem>
          </Accordion>
        ),
        code: `<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Can I bring my own carrier?</AccordionTrigger>
    <AccordionContent>Yes. Connect Twilio, Telnyx, Plivo or any SIP trunk.</AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    ],
  },
  {
    id: "surfaces",
    title: "Surfaces",
    entries: [
      {
        id: "card",
        name: "Card",
        detail: "A tinted panel: no border, no shadow. Interactive cards darken on hover and shrink a little when pressed.",
        wide: true,
        demo: () => (
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Front desk</CardTitle>
                <CardDescription>Answers the main line, books appointments.</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Badge tone="success" dot>Live</Badge>
                <Badge>English</Badge>
              </CardContent>
              <CardFooter>
                <Button size="sm" iconEnd={<ArrowRightIcon />}>Open</Button>
              </CardFooter>
            </Card>
            <Card interactive selected className="p-5">
              <p className="text-body-sm font-semibold">Selected card</p>
              <p className="text-body-sm text-fg-muted">The accent wash, a solid ring and a check.</p>
            </Card>
          </div>
        ),
        code: `<Card>
  <CardHeader>
    <CardTitle>Front desk</CardTitle>
    <CardDescription>Answers the main line.</CardDescription>
  </CardHeader>
  <CardFooter><Button size="sm">Open</Button></CardFooter>
</Card>
<Card interactive selected>…</Card>`,
      },
      {
        id: "section",
        name: "Section",
        detail: "A settings panel: icon tile, title, description and actions. The danger tone washes it red.",
        wide: true,
        demo: () => (
          <div className="flex w-full flex-col gap-3">
            <Section icon={<KeyIcon />} title="API keys" description="Keys let your code place calls." actions={<Button size="sm" iconStart={<PlusIcon />}>New key</Button>}>
              <CopyField value="wx_live_8f3k2m9q7z1c4v6b" secret />
            </Section>
            <Section tone="danger" icon={<TrashIcon />} title="Delete workspace" description="Agents, numbers and call history go with it." actions={<Button size="sm" variant="danger">Delete</Button>} />
          </div>
        ),
        code: `<Section icon={<KeyIcon />} title="API keys" description="Keys let your code place calls."
  actions={<Button size="sm">New key</Button>}>
  …
</Section>
<Section tone="danger" title="Delete workspace" actions={<Button size="sm" variant="danger">Delete</Button>} />`,
      },
      {
        id: "tile",
        name: "Tile",
        detail: "A quick action. The icon tile takes the accent wash on hover.",
        wide: true,
        demo: () => (
          <div className="grid w-full gap-3 sm:grid-cols-3">
            <Tile icon={<RobotIcon />} title="New agent" description="Start from a template" />
            <Tile icon={<PhoneIcon />} title="Buy a number" description="On your carrier" />
            <Tile icon={<ChartBarIcon />} title="Reports" description="Calls and spend" />
          </div>
        ),
        code: `<Tile icon={<RobotIcon />} title="New agent" description="Start from a template" />`,
      },
      {
        id: "action-bar",
        name: "Action bar",
        detail: "Sticks to the bottom of an editor while there are unsaved changes.",
        wide: true,
        demo: ActionBarDemo,
        code: `{dirty && (
  <ActionBar>
    <span>Unsaved changes</span>
    <Button variant="primary" size="sm">Save</Button>
  </ActionBar>
)}`,
      },
      {
        id: "separator",
        name: "Separator",
        detail: "A hairline, kept for dividing rows inside a panel.",
        demo: () => (
          <div className="flex w-full max-w-xs flex-col gap-3 text-body-sm">
            <span className="flex items-center gap-2"><ShieldCheckIcon /> Two-step sign-in</span>
            <Separator />
            <span className="flex items-center gap-2"><BellIcon /> Notifications</span>
          </div>
        ),
        code: `<Separator />`,
      },
    ],
  },
  {
    id: "people",
    title: "People and conversations",
    entries: [
      {
        id: "avatar",
        name: "Avatar",
        detail: "Initials on a soft gradient, a presence dot ringed in the page colour. Groups fan out on hover.",
        demo: () => (
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Avatar name="Priya Nair" size="lg" status="online" />
              <Avatar name="Omar Haddad" size="lg" status="busy" />
              <Avatar name="Acme Inc" size="lg" shape="square" />
            </div>
            <AvatarGroup max={4}>
              <Avatar name="Priya Nair" status="online" />
              <Avatar name="Omar Haddad" />
              <Avatar name="Lena Park" />
              <Avatar name="Sam Okafor" />
              <Avatar name="Ana Ruiz" />
              <Avatar name="Kai Chen" />
            </AvatarGroup>
          </div>
        ),
        code: `<Avatar name="Priya Nair" status="online" />
<AvatarGroup max={4}>
  <Avatar name="Priya Nair" />
  <Avatar name="Omar Haddad" />
  …
</AvatarGroup>`,
      },
      {
        id: "message",
        name: "Message, transcript",
        detail: "The agent on the start side, the person on the end side on the accent wash. Streaming text ends in a block caret.",
        wide: true,
        demo: () => (
          <Transcript className="w-full">
            <Message from="agent" name="Front desk" time="4:02 pm">Thanks for calling Acme. How can I help?</Message>
            <Message from="person" name="Priya" time="4:02 pm">I'd like to book a cleaning this week.</Message>
            <Message from="agent" name="Front desk" streaming>I have Thursday at 3 pm or 4 pm. Which</Message>
          </Transcript>
        ),
        code: `<Transcript>
  <Message from="agent" name="Front desk">Thanks for calling Acme.</Message>
  <Message from="person" name="Priya">I'd like to book a cleaning.</Message>
  <Message from="agent" name="Front desk" streaming>{partial}</Message>
</Transcript>`,
      },
    ],
  },
];

const codeClass =
  "[&_pre]:rounded-lg [&_pre]:bg-card [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-body-sm [&_pre]:text-fg [&_pre]:overflow-x-auto";

function EntryView({ entry }: { entry: Entry }) {
  const Demo = entry.demo;
  return (
    <section id={entry.id} className="flex scroll-mt-24 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-heading-sm">
          <a href={`#${entry.id}`} className="rounded-xs wx-focus">
            {entry.name}
          </a>
        </h3>
        <p className="max-w-[64ch] text-body-sm text-fg-muted">{entry.detail}</p>
      </div>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-3">
          <div
            className={
              entry.wide
                ? "flex min-h-40 items-center rounded-xl border border-border p-5 sm:p-8"
                : "flex min-h-40 items-center justify-center rounded-xl border border-border p-5 sm:p-8"
            }
          >
            <Demo />
          </div>
        </TabsContent>
        <TabsContent value="code" className="mt-3">
          <CodeBlock className={codeClass}>{entry.code}</CodeBlock>
        </TabsContent>
      </Tabs>
    </section>
  );
}

/** Every component, live, grouped the way people look for them. */
export function Gallery() {
  return (
    <div className="flex flex-col gap-16">
      {groups.map((group) => (
        <div key={group.id} id={group.id} className="flex scroll-mt-24 flex-col gap-10">
          <h2 className="text-heading-lg">{group.title}</h2>
          {group.entries.map((entry) => (
            <EntryView key={entry.id} entry={entry} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** The page's sidebar: every group and component, as links down the page. */
export function GalleryNav() {
  return (
    <>
      {/* Below lg the sidebar sits above the page, so it shrinks to the groups alone. */}
      <nav aria-label="Component groups" className="flex flex-wrap gap-1.5 lg:hidden">
        {groups.map((group) => (
          <Button key={group.id} asChild size="sm">
            <a href={`#${group.id}`}>{group.title}</a>
          </Button>
        ))}
      </nav>
      <SiteSidebar aria-label="Components" className="max-lg:hidden">
      {groups.map((group) => (
        <SiteSidebarSection key={group.id} label={group.title}>
          {group.entries.map((entry) => (
            <SiteSidebarLink key={entry.id} href={`#${entry.id}`}>
              {entry.name}
            </SiteSidebarLink>
          ))}
        </SiteSidebarSection>
      ))}
      </SiteSidebar>
    </>
  );
}
