"use client";

function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <h1 className="text-3xl font-bold">Oops! Something went wrong...</h1>
      <p className="my-4">There was an error loading the page you requested.</p>
      <button type="button" className="underline" onClick={() => reset()}>
        Try again
      </button>
    </>
  );
}

export default ErrorPage;
