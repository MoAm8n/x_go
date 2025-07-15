import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface IndeterminateCheckboxProps {
  parentLabel: string;
  childLabels: string[];
  checked: boolean[];
  onChange: (index: number, value: boolean) => void;
}

export default function IndeterminateCheckbox({
  parentLabel,
  childLabels,
  checked,
  onChange
}: IndeterminateCheckboxProps) {
  const allChecked = checked.every(Boolean);
  const someChecked = checked.some(Boolean);

  return (
    <div>
      <FormControlLabel
        label={parentLabel}
        control={
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={e => {
              childLabels.forEach((_, idx) => onChange(idx, e.target.checked));
            }}
          />
        }
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
        {childLabels.map((label, idx) => (
          <FormControlLabel
            key={label}
            label={label}
            control={
              <Checkbox
                checked={checked[idx]}
                onChange={e => onChange(idx, e.target.checked)}
              />
            }
          />
        ))}
      </Box>
    </div>
  );
}