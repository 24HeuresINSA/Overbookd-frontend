export type Field = {
  key: string;
  label: string;
  isRequired?: boolean;
} & FormType;

interface FormText {
  type: "string" | undefined;
  regex?: string;
  counter: number;
}

interface FormTextArea {
  type: "textarea";
}

interface FormRichText {
  type: "rich-text";
}

interface FormSwitch {
  type: "switch";
}

interface FormSelect {
  type: "select";
  options: Array<string>;
  multiple: boolean;
}

interface FormAutocomplete {
  type: "autocomplete";
  options: Array<string>;
  multiple: boolean;
}

interface FormTeams {
  type: "teams";
}

interface FormDatetime {
  type: "datetime";
}

interface FormDate {
  type: "time";
}

interface FormUser {
  type: "user";
}

type FormType =
  | FormText
  | FormAutocomplete
  | FormRichText
  | FormSelect
  | FormSwitch
  | FormTextArea
  | FormDate
  | FormDatetime
  | FormUser
  | FormTeams;

// todo continue

function b(a: Field) {
  if (a.type === "string") {
    if (a.regex) {
      console.log("a is a string input");
    }
  }
}
