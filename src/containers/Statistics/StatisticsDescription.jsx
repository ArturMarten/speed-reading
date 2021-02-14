import React, { Suspense } from 'react';
import { importMDX } from 'mdx.macro';
import ShowMore from '../../components/ShowMore/ShowMore';

const StatisticsDescriptionEt = React.lazy(() => importMDX('./statistics-description-et.md'));
const StatisticsDescriptionEn = React.lazy(() => importMDX('./statistics-description-en.md'));

function StatisticsDescription(props) {
  const { language, translate } = props;
  return (
    <ShowMore translate={translate}>
      <Suspense fallback={translate('statistics.loading')}>
        {language === 'ee' ? <StatisticsDescriptionEt /> : <StatisticsDescriptionEn />}
      </Suspense>
    </ShowMore>
  );
}

export default StatisticsDescription;
