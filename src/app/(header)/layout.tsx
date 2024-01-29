import Header from '../../components/Header/Header';

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="main-container">{children}</div>
    </>
  );
}
