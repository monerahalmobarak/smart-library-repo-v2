// /Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/Profile/Dropdown.tsx
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ProfileDropdownProps {}

const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const handleSelect = (eventKey: string | null) => {
    // Handle your options here
    console.log(eventKey);
    if (eventKey === 'signout') {
    } else if (eventKey === 'profile') {
    } else if (eventKey === 'admin') {
    }
  };

  return (
    <Dropdown onSelect={handleSelect} className="dropdown-container">
      <Dropdown.Toggle variant="success" id="dropdown-basic" className="profile-icon">
        <img src="profile-icon.png" alt="Profile" className="profile-image" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-custom">
        <Dropdown.Item eventKey="profile">Profile</Dropdown.Item>
        <Dropdown.Item eventKey="admin">Admin Panel</Dropdown.Item>
        <Dropdown.Item eventKey="signout" className="signout">Sign Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileDropdown;
