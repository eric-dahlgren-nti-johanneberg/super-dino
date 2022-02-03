import dynamic from 'next/dynamic';

const LevelPlayer = dynamic(() => import('@/features/levelPlayer'), {
  ssr: false,
});

const MakerPage = () => {
  return <LevelPlayer />;
};

export default MakerPage;
