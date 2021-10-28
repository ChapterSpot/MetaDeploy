import { Story } from '@storybook/react/types-6-0';
import React, { ComponentProps } from 'react';

import UserInfo from '@/js/components/plans/userInfo';
import { User } from '@/js/store/user/reducer';

import { samplePlan1, sampleUser1, sampleUser2 } from '../../fixtures';

export default {
  title: 'Plans/UserInfo/Examples',
  component: UserInfo,
};

const sampleUsers: { [key: string]: User } = {
  LoggedIn: sampleUser1,
  LoggedOut: sampleUser2,
};

type Props = ComponentProps<typeof UserInfo>;

interface StoryProps extends Omit<Props, 'user'> {
  user: string;
}

const Template = ({ user, ...rest }: StoryProps) => (
  <UserInfo user={sampleUsers[user]} {...rest} />
);

export const UserInfoComponent: Story<StoryProps> = Template.bind({});
UserInfoComponent.args = {
  plan: samplePlan1,
  user: 'LoggedIn',
};
UserInfoComponent.argTypes = {
  plan: { table: { disable: true } },
  user: {
    type: { name: 'string' },
    control: { type: 'select' },
    options: Object.keys(sampleUsers),
  },
};

UserInfoComponent.storyName = 'User Info';
