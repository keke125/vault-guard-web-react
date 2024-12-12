import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { redirect } from 'next/navigation';

const mainListItems = [
  { text: '密碼庫', icon: <EnhancedEncryptionIcon /> },
  { text: '密碼產生器', icon: <KeyIcon /> },
];

const secondaryListItems = [
  { text: '密碼庫設定', icon: <SettingsRoundedIcon /> },
  { text: '帳號設定', icon: <AccountCircleIcon /> },
];

export default function MenuContent() {
  const links = ['/passwords', '/password-generator', '/vault', '/account'];
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    const pathname = window.location.pathname;
    if (links.includes(pathname)) {
      setSelectedIndex(links.indexOf(pathname));
    }
  });

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
    redirect(links[index], "push");
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedIndex === index + 2}
              onClick={() => handleListItemClick(index + 2)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
