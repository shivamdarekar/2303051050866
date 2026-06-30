import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Log, Level, FrontendPackage } from 'logging-middleware';

const filters = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  const handleChange = async (event, newValue) => {
    if (newValue !== null) {
      await Log('frontend', Level.INFO, FrontendPackage.COMPONENT, 
        `NotificationFilter: User selected filter - ${newValue}`);
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{ flexWrap: "wrap", gap: 0.5 }}
    >
      {filters.map((type) => (
        <ToggleButton 
          key={type}
          value={type} 
          sx={{ textTransform: "none", px: 2 }}
        >
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}