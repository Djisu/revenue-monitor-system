import React from 'react';
interface MainMenuWrapperProps {
    handleSubmenuClick: () => void;
    checkAccess: (menuOption: string) => Promise<boolean>;
}
declare const MainMenuWrapper: React.FC<MainMenuWrapperProps>;
export default MainMenuWrapper;
