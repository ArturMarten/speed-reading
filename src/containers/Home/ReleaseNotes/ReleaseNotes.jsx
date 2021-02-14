import React, { Suspense } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { importMDX } from 'mdx.macro';

const ReleaseNotesEt = React.lazy(() => importMDX('./release-notes-et.md'));
const ReleaseNotesEn = React.lazy(() => importMDX('./release-notes-en.md'));

function ReleaseNotes(props) {
  return (
    <>
      <Header as="h3">
        <Icon name="announcement" color="grey" size="large" />
        {props.translate('release-notes.header')}
      </Header>
      <div style={{ maxHeight: '20em', overflowX: 'auto' }}>
        <Suspense fallback={props.translate('release-notes.loading')}>
          {props.currentLanguage === 'ee' ? <ReleaseNotesEt /> : <ReleaseNotesEn />}
        </Suspense>
      </div>
    </>
  );
}

export default ReleaseNotes;
