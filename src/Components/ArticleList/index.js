import React from "react";
import {} from "@material-ui/icons";
import {
  Grid,
  Backdrop,
  CircularProgress,
  Typography,
  LinearProgress,
} from "@material-ui/core";

import FeedCard from "../Common/FeedCard";
import { getNews, getSavedArticlesFromLocal } from "../../Store/Actions/News";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";

// import ArticleList from "../Molecules/ArticleList";

const Home = ({ articles, ...props }) => {
  const [isFetchProcessing, setIsFetchProcessing] = React.useState(false);
  const [hasMoreToFetch, setHasMoreToFetch] = React.useState(true);

  React.useEffect(() => {
    getTopStories();
    props.getSavedArticlesFromLocal();
  }, []);

  const getTopStories = () => {
    return props.getNews();
  };

  const { isArticlesLoading, totalArticles } = props;

  const handlePagination = async (page) => {
    if (!isFetchProcessing) {
      console.log("[Pagination...]");
      setIsFetchProcessing(true);
      let isTotalArticlesReached = articles.length === totalArticles;
      if (!isTotalArticlesReached && page > props.totalArticlesPage) {
        await getTopStories();
        setIsFetchProcessing(false);
        console.log("[Done]");
      } else setHasMoreToFetch(false);
    }
  };

  return (
    <>
      {isArticlesLoading ? (
        <Grid
          item
          xs={12}
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
          <Grid>
            <CircularProgress />
            <Typography variant="h5">
              Stiching your favourate articles...
            </Typography>
          </Grid>
        </Grid>
      ) : articles && articles.length ? (
        <InfiniteScroll
          pageStart={1}
          initialLoad={false}
          loadMore={(page) => handlePagination(page)}
          hasMore={hasMoreToFetch}
          loader={<LinearProgress key={0} />}
          useWindow={true}>
          {articles.map((item, index) => (
            <Grid key={index} item xs={12} style={{ backgroundColor: "red" }}>
              <FeedCard article={item} savedArticles={props.savedArticles} />
            </Grid>
          ))}
        </InfiniteScroll>
      ) : (
        <Grid
          item
          xs={12}
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}>
          <Typography variant="h5">No articles at the moment</Typography>
        </Grid>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isArticlesLoading: state.news.isArticlesLoading,
    articles: state.news.articles,
    totalArticlesPerPage: state.news.totalArticlesPerPage,
    totalArticlesPage: state.news.totalArticlesPage,
    totalArticles: state.news.totalArticles,
    savedArticles: state.news.savedArticles,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getNews: () => dispatch(getNews()),
    getSavedArticlesFromLocal: () => dispatch(getSavedArticlesFromLocal()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
