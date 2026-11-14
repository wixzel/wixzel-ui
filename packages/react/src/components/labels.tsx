import { createContext, useContext } from "react";

/**
 * Every word the components write themselves: close buttons, screen-reader
 * names, empty results. English by default. A product passes its own once to
 * <WixzelProvider labels={…}>, and a single component can still take a prop
 * for a one-off. Strings only, so a Server Component layout can pass them.
 */
export interface WixzelLabels {
  /** Dialog and Drawer close button. */
  close: string;
  /** InfoTip button. */
  moreInformation: string;
  /** CopyField. */
  copy: string;
  copied: string;
  reveal: string;
  hide: string;
  /** Breadcrumb landmark. */
  breadcrumb: string;
  /** Spinner. */
  loading: string;
  /** Combobox. */
  search: string;
  noResults: string;
  /** Stepper landmark and the state each step reads out. */
  steps: string;
  stepDone: string;
  stepError: string;
  /** ConfirmDialog. */
  confirm: string;
  cancel: string;
  /** "{text}" is replaced by the phrase to type, shown as a code chip. */
  typeToConfirm: string;
  /** AppShell. */
  navigation: string;
  collapseSidebar: string;
  expandSidebar: string;
  openMenu: string;
  /** Pagination landmark, its buttons, and the count read out on phones. "{page}" and "{count}" are replaced. */
  pagination: string;
  previousPage: string;
  nextPage: string;
  pageOf: string;
  /** Price. */
  priceFrom: string;
  priceOnRequest: string;
  /** ColumnChart: the disclosure that shows the numbers as a table, its date column, and an empty range. */
  showAsTable: string;
  date: string;
  noData: string;
  /** FileDrop. "{name}" is replaced by the file's name. */
  dropFile: string;
  browse: string;
  removeFile: string;
}

export const defaultLabels: WixzelLabels = {
  close: "Close",
  moreInformation: "More information",
  copy: "Copy",
  copied: "Copied",
  reveal: "Reveal",
  hide: "Hide",
  breadcrumb: "Breadcrumb",
  loading: "Loading",
  search: "Search…",
  noResults: "No matches",
  steps: "Steps",
  stepDone: "Done",
  stepError: "Needs attention",
  confirm: "Confirm",
  cancel: "Cancel",
  typeToConfirm: "Type {text} to confirm",
  navigation: "Navigation",
  collapseSidebar: "Collapse sidebar",
  expandSidebar: "Expand sidebar",
  openMenu: "Open menu",
  pagination: "Pagination",
  previousPage: "Previous",
  nextPage: "Next",
  pageOf: "Page {page} of {count}",
  priceFrom: "From",
  priceOnRequest: "Price on request",
  showAsTable: "Show as table",
  date: "Date",
  noData: "Nothing in this period yet.",
  dropFile: "Drop a file here, or",
  browse: "browse",
  removeFile: "Remove {name}",
};

export const LabelsContext = createContext<WixzelLabels>(defaultLabels);

/** The labels in effect here: the provider's, over the English defaults. */
export function useLabels() {
  return useContext(LabelsContext);
}
