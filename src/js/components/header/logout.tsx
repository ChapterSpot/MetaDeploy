import Avatar from '@salesforce/design-system-react/components/avatar';
import Button from '@salesforce/design-system-react/components/button';
import Dropdown from '@salesforce/design-system-react/components/menu-dropdown';
import DropdownTrigger from '@salesforce/design-system-react/components/menu-dropdown/button-trigger';
import UNSAFE_DirectionSettings from '@salesforce/design-system-react/components/utilities/UNSAFE_direction';
import i18n from 'i18next';
import * as React from 'react';

import { FetchProductsSucceeded } from '@/store/products/actions';
import { User } from '@/store/user/reducer';

const Logout = ({
  user,
  doLogout,
}: {
  user: User;
  doLogout: () => Promise<FetchProductsSucceeded>;
}) => (
  <UNSAFE_DirectionSettings.Consumer>
    {(direction: string) => {
      /* istanbul ignore next */
      const nubbinPosition = direction === 'ltr' ? 'top right' : 'top left';
      return (
        <Dropdown
          id="logout"
          options={[
            {
              label: user?.username,
              type: 'header',
            },
            { type: 'divider' },
            {
              label: i18n.t('Log Out'),
              leftIcon: {
                name: 'logout',
                category: 'utility',
              },
            },
          ]}
          onSelect={doLogout}
          menuPosition="relative"
          nubbinPosition={nubbinPosition}
        >
          <DropdownTrigger>
            <Button variant="icon">
              <Avatar />
            </Button>
          </DropdownTrigger>
        </Dropdown>
      );
    }}
  </UNSAFE_DirectionSettings.Consumer>
);

export default Logout;
