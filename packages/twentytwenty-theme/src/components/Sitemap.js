import { connect } from "frontity";

const Sitemap = ({ state }) => {
  const data = state.source.get(state.router.link);
  return (
    <div>
      <pre>{data.sitemap}</pre>
    </div>
  );
};

export default connect(Sitemap);