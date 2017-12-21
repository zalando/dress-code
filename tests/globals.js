exports.DEFAULT_PORT = 3100;

exports.TEMPLATE_DIRECTORIES = ["03-atoms", "04-molecules"];

exports.COMPONENTS = [
  /* ATOMS  */
  {
    name: "buttons",
    files: ["01-button", "02-sizes", "03-options", "04-button--block"]
  },
  {
    name: "forms",
    files: [
      "01-checkbox",
      "02-checkbox--switch",
      "radio-button",
      "select",
      "text-input",
      "textarea"
    ]
  },
  { name: "icons", files: ["01-icons"] },
  {
    name: "lists",
    files: ["01-list", "02-unordered", "03-ordered", "04-scrollable"]
  },
  {
    name: "tables",
    files: ["01-table-setup", "02-sortable-headings", "03-spacing-modifiers"]
  },
  { name: "tooltip", files: ["01-adding-a-tooltip", "02-sizing"] },
  { name: "card", files: ["card"] },
  { name: "divider", files: ["divider"] },
  { name: "link", files: ["link"] },
  { name: "paragraph", files: ["paragraph"] },
  { name: "status", files: ["status"] },
  { name: "tab", files: ["tab"] },

  /* MOLECULES */
  {
    name: "button-icon",
    files: ["01-button-icon", "02-button-link-icon"]
  },
  {
    name: "button-groups",
    files: ["02-button-groups"]
  },
  {
    name: "dropdown",
    files: ["03-dropdown"]
  },
  {
    name: "input-groups",
    files: ["04-input-groups"]
  },
  {
    name: "input-stack",
    files: ["04-input-stack"]
  },
  {
    name: "search-form",
    files: ["05-search-form"]
  },
  {
    name: "dialog",
    files: ["07-dialog"]
  },
  {
    name: "side-revealer",
    files: ["08-side-revealer"]
  },
  {
    name: "toast",
    files: ["09-toast"]
  },
  {
    name: "messages",
    files: ["10-messages"]
  },
  {
    name: "breadcrumb",
    files: ["11-breadcrumb"]
  },
  {
    name: "pagination",
    files: ["12-pagination"]
  },
  {
    name: "accordions",
    files: ["01-accordion", "02-options"]
  }
];

exports.MESSAGES = {
  READY: "READY",
  START: "START",
  RUNNING: "RUNNING",
  CLOSED: "CLOSED",
  SHUTDOWN: "SHUTDOWN",
  ERROR: "ERROR",
  ABORTED: "ABORTED"
};
