import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "../components/ui/Icons";

const NotFound = () => (
  <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <p className="eyebrow">Error 404</p>
    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
    <p className="mt-4 max-w-md text-slate-500">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary mt-8">
      <ArrowLeftIcon className="h-4 w-4" />
      Back to home
    </Link>
  </section>
);

export default NotFound;
