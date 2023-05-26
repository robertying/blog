"use client";

export const metadata = {
  title: "Error",
  robots: {
    index: false,
  },
};

function Error() {
  return (
    <>
      <h1 className="text-3xl font-bold">Oops! Something went wrong...</h1>
      <p className="my-4">There was an error loading the page you requested.</p>
    </>
  );
}

export default Error;
