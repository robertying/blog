export const metadata = {
  title: "Not Found",
  robots: {
    index: false,
  },
};

function NotFound() {
  return (
    <>
      <h1 className="text-3xl font-bold">You seem lost...</h1>
      <p className="my-4">The stuff you requested is not found.</p>
    </>
  );
}

export default NotFound;
