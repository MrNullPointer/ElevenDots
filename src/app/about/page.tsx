import AboutContent from '@/components/ui/AboutContent';

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <AboutContent />
    </main>
  );
}
