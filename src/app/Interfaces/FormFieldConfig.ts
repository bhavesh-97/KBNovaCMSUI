import { ValidationRules } from "../shared/utilities/validation-rules.enum";

export interface FormFieldConfig {
  name: string;
  isMandatory?: boolean;
  validationMessage?: string;
  events?: { type: string; validationRule: ValidationRules }[];
}