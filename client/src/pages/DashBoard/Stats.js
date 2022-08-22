import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  StatsContainter,
  Loading,
  ChartsContainer,
} from "../../components/index";
import { StatusCodes } from "http-status-codes";

const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();
  useEffect(() => {
    showStats();
  }, []);
  if (isLoading) {
    return <Loading center />;
  }
  return (
    <>
      <StatsContainter />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Stats;
