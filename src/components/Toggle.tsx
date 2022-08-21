import { FormControl, FormLabel, Switch } from '@chakra-ui/react';
interface Props {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}
export const Toggle = ({ label, isChecked, onChange }: Props) => (
  <FormControl display="flex" alignItems="center">
    <FormLabel htmlFor={label} mb="0">
      {label}
    </FormLabel>
    <Switch
      id={label}
      size="lg"
      isChecked={isChecked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </FormControl>
);
