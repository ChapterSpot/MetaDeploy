import { Story } from '@storybook/react/types-6-0';
import React, { ComponentProps } from 'react';

import UserInfo from '@/js/components/plans/userInfo';
import { ScratchOrg } from '@/js/store/scratchOrgs/reducer';
import { User } from '@/js/store/user/reducer';

import {
  samplePlan1,
  samplePlan2,
  sampleScratchOrg1,
  sampleScratchOrg2,
  sampleUser1,
} from '../../fixtures';

export default {
  title: 'Plans/UserInfo/Examples',
  component: UserInfo,
};

const sampleUsers: { [key: string]: User } = {
  'Logged In': sampleUser1,
  'Logged Out': null,
};

const sampleScratchOrgs: { [key: string]: ScratchOrg } = {
  Date: sampleScratchOrg1,
  Days: sampleScratchOrg2,
};

type Props = ComponentProps<typeof UserInfo>;

const Template = (props: Props) => {
  window.GLOBALS.SCRATCH_ORGS_AVAILABLE = true;
  return <UserInfo {...props} />;
};

export const UserInfoComponent: Story<Props> = Template.bind({});
UserInfoComponent.args = {
  plan: samplePlan1,
  user: 'Logged In' as unknown as User,
};
UserInfoComponent.argTypes = {
  plan: { table: { disable: true } },
  user: {
    type: { name: 'string' },
    control: { type: 'select' },
    options: Object.keys(sampleUsers),
    mapping: sampleUsers,
  },
};
UserInfoComponent.storyName = 'Connected as User';

export const OrgUserInfo: Story<Props> = Template.bind({});
OrgUserInfo.args = {
  user: null,
  plan: samplePlan2,
  scratchOrg: 'Date' as unknown as ScratchOrg,
};
OrgUserInfo.argTypes = {
  user: { table: { disable: true } },
  plan: { table: { disable: true } },
  scratchOrg: {
    type: { name: 'string' },
    control: { type: 'select' },
    options: Object.keys(sampleScratchOrgs),
    mapping: sampleScratchOrgs,
  },
};

OrgUserInfo.storyName = 'Connected With Scratch Org';
