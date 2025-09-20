import { Outlet, Link, useMatch } from "react-router-dom";

export default function Home() {
  const match = useMatch("/:eventId/:token");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm mb-5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Secret Buddy</h1>
          {match && <nav>
            <Link to="/organizer/admin" className="text-sm text-blue-600 hover:underline">
              Organizer
            </Link>
          </nav>}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          Built with ❤️
        </div>
      </footer>
    </div>
  );
}
