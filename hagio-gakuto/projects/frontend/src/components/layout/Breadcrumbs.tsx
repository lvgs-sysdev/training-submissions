import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const breadcrumbNameMap: { [key: string]: string } = {
    about: "商品一覧",
    tv: "テレビ",
  };

  return (
    <nav className="flex mt-1">
      <span className="hover pointer">
        <Link to="/">
          <HomeIcon />
        </Link>
      </span>
      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        const name = breadcrumbNameMap[value] || value;

        return (
          <span key={to}>
            {" > "}
            {isLast ? (
              <span className="hover pointer mt-">
                {decodeURIComponent(name)}
              </span>
            ) : (
              <Link to={to}>{decodeURIComponent(name)}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
