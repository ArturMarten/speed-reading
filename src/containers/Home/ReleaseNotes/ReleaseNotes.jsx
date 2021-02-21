import React, { Suspense } from 'react';
import { Header, Icon } from 'semantic-ui-react';
import { importMDX } from 'mdx.macro';
import environment from '../../../environment';
import TimeSince from './TimeSince';

const ReleaseNotesEt = React.lazy(() => importMDX('./release-notes-et.md'));
const ReleaseNotesEn = React.lazy(() => importMDX('./release-notes-en.md'));

function ReleaseNotes(props) {
  return (
    <>
      <Header as="h3">
        <Icon name="announcement" color="grey" size="large" />
        {props.translate('release-notes.header')}
      </Header>
      <div style={{ maxHeight: '16em', overflowX: 'auto' }}>
        <Suspense fallback={props.translate('release-notes.loading')}>
          {props.currentLanguage === 'ee' ? <ReleaseNotesEt /> : <ReleaseNotesEn />}
        </Suspense>
      </div>
      <span style={{ float: 'right', fontSize: '10px', marginTop: '10px' }}>
        {props.translate('release-notes.last-update')}
        &nbsp;
        <TimeSince date={environment.date} translate={props.translate} />
      </span>
    </>
  );
}

export default ReleaseNotes;
