import React from 'react';
interface MainMenuProps {
    checkAccess: (menuOption: string) => Promise<boolean>;
    handleSubmenuClick?: () => void;
}
declare const MainMenu: React.FC<MainMenuProps>;
export default MainMenu;
