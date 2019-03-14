// @flow

import * as React from 'react';
import { t } from 'i18next';

const Footer = (props: { logoSrc: string }) => (
  <footer
    className="slds-grid
      slds-grid--align-spread
      slds-grid_vertical-align-center
      slds-wrap
      slds-p-horizontal_x-large
      slds-p-vertical_medium
      slds-text-body_small
      site-contentinfo"
  >
    <div
      className="footer-logo
        footer-item
        slds-m-right_medium
        slds-grow"
      style={{ backgroundImage: `url(${props.logoSrc})` }}
      data-testid="footer-logo"
    />
    <div
      className="footer-item
        slds-grid"
    >
      {window.GLOBALS.SITE && window.GLOBALS.SITE.copyright_notice ? (
        // These messages are pre-cleaned by the API
        <div
          dangerouslySetInnerHTML={{
            __html: window.GLOBALS.SITE.copyright_notice,
          }}
        />
      ) : (
        <p>{`${t('Copyright')} ${window.GLOBALS.YEAR} ${window.SITE_NAME}.`}</p>
      )}
    </div>
  </footer>
);

export default Footer;
