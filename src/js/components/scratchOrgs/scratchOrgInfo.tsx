import Card from '@salesforce/design-system-react/components/card';
import i18n from 'i18next';
import * as React from 'react';
import { Trans } from 'react-i18next';

const ScratchOrgInfo = ({
  date,
  days,
}: {
  date: string | null;
  days?: number;
}) => {
  if (!date && !days) {
    return null;
  }
  const expiration = date
    ? i18n.t('Your scratch org will expire on {{date}}.', { date })
    : i18n.t(
        'scratchOrgDuration',
        'Your scratch org will expire after {{count}} days.',
        { count: days },
      );
  return (
    <Card bodyClassName="slds-card__body_inner" heading={i18n.t('Scratch Org')}>
      <div className="slds-text-longform">
        <p>
          <strong>{expiration}</strong>
        </p>
        <Trans i18nKey="scratchOrgWarning">
          <p>
            This expiration date cannot be changed or extended. After the
            expiration date, all changes will be lost, and you will need to
            create a new scratch org.
          </p>
          <p>This org is for demo purposes only.</p>
        </Trans>
      </div>
    </Card>
  );
};

export default ScratchOrgInfo;
