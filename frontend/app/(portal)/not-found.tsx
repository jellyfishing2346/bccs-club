import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-4 text-gray-600">
        The page you are looking for doesn’t exist in the portal section.
      </p>
      <div className="mt-6">
        <Link href="/" className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Go home
        </Link>
      </div>
    </div>
  );
}
