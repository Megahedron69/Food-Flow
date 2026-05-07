export type CommandItem = {
  id: string;
  label: string;
  run: () => void;
};

export const commandRegistry: CommandItem[] = [];
