import dynamic from 'next/dynamic';

const LevelMaker = dynamic(() => import('@/features/levelMaker'), {
  ssr: false,
});

const MakerPage = () => {
  return <LevelMaker />;
};

export default MakerPage;
