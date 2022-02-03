import * as React from 'react';

import { Layout, Seo } from '@/components';
import ButtonLink from '@/components/links/ButtonLink';

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <h1>Supa Sario Brotha&apos;s</h1>
        <ButtonLink variant='outline' href='/maker'>
          Level Creator
        </ButtonLink>
        <ButtonLink variant='outline' href='/player'>
          Player
        </ButtonLink>
      </main>
    </Layout>
  );
}
