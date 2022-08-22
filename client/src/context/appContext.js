// https://www.loginradius.com/blog/engineering/react-context-api/--->Read this doc if we didnt understood any of this .

import React, { useReducer, useContext } from "react";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  TOGGLE_SIDEBAR,
  HANDLE_CHANGE,
  LOGOUT_USER,
  CLEAR_VALUE,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATUS_BEGIN,
  SHOW_STATUS_SUCCESS,
  CLEAR_FILTERS,
  CHNAGE_PAGE,
} from "./action";
import axios from "axios";
import reducer from "./reducer";

// we should load the user on page load, so we should get values from the local storage.
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");
const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: userLocation || "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["interview", "declined", "pending"],
  status: "pending",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

// in this step we created the context object so we get access to two objects
// 1. provider and 2.consumer.
const AppContext = React.createContext();

//so in next step we are creating a provider component
const AppProvider = ({ children }) => {
  // const [state, setState] = useState(initialState); // we remove this after introduction of reducer
  // here reducer is function which handles the dispatching event. so reducer should be a funciton
  // console.log("The Reducer is :" + reducer);
  // so once value is changed dispatch function is activated and sends action.
  const [state, dispatch] = useReducer(reducer, initialState);
  // here we are creating a value prop and returning a provider component
  // here for value we can pass the values which we need in ourcase we are sending intial state object.
  // here children is nothing but our application.

  //Axios Global Set up
  // there would be a problem if we are do two requests.
  // axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;

  const authFetch = axios.create({
    baseURL: "/api/v1/",
  });
  // request Interceptor
  authFetch.interceptors.request.use(
    (config) => {
      //here to config we are adding some headers and we are returning it
      // so like before sending request we are modifing it with headers.
      config.headers.common["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  // response Interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        // console.log("AUTH ERROR");
        logoutUser();
      }
      return Promise.reject(error);
    }
  );
  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const addUsertoLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };
  const removeUserFromLocalStorage = ({ user, token, location }) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
  };
  const registerUser = async (currentUser) => {
    // console.log(currentUser);
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post(`/api/v1/auth/register`, currentUser);
      // console.log(response);
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      // here keep the code to store into local storage
      addUsertoLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error.response);
      dispatch({
        type: REGISTER_USER_ERROR,
        PAYLOAD: {
          msg: error.response.data.msg,
        },
      });
    }
    clearAlert(); // regardless of success of failure we should clear the error.
  };
  const loginUser = async (currentUser) => {
    // console.log({ currentUser });
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post(`/api/v1/auth/login`, currentUser);
      console.log(data);
      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });
      // here keep the code to store into local storage
      addUsertoLocalStorage({ user, token, location });
    } catch (error) {
      console.log(error);
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
        },
      });
    }
    clearAlert();
  };
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };
  const updateUser = async (currentUser) => {
    // console.log(currentUser);
    dispatch({ type: UPDATE_USER_BEGIN });
    //Case1 setting axios this is local setup. but global setup is what generally advicable.
    try {
      // once global set up is done we can remove headers for local
      // const { data } = await axios.patch(
      //   "/api/v1/auth/updateUser",
      //   currentUser,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${state.token}`,
      //     },
      //   }
      // );
      // const { data } = await axios.patch(
      //   "/api/v1/auth/updateUser",
      //   currentUser
      // );
      //so if we send request like global axios we will not see bearer tokent in the request details this is what we want
      // during request process.
      // the below setup is awesome as headers are hidden. but the gliche is it will not give us 401 ERROR.
      const { data } = await authFetch.patch(`/auth/updateUser`, currentUser);
      // console.log(data);
      const { user, location, token } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, token },
      });
      addUsertoLocalStorage({ user, location, token });
    } catch (error) {
      // console.log(error);
      // remember here if there is any delay then once due unauthorization an error will come which would
      //get displayed to avoid it we are adding the if condition.
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }

      clearAlert(); // for clearing the alert.
    }
  };
  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUE });
  };
  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      // if everything went success then we dispatch success
      dispatch({ type: CREATE_JOB_SUCCESS });
      // once succes then clear all values
      dispatch({ type: CLEAR_VALUE });
    } catch (error) {
      // if error comes dont hang it as it is
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;
    console.log(sort);
    let url = `/jobs?page=${page}status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { jobs, totalJobs, numOfPages },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    clearAlert();
  };
  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUE });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
    console.log("edit job");
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);

      getJobs();
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
    console.log(`Deleted the job:${jobId}`);
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATUS_BEGIN });
    try {
      const { data } = await authFetch(`/jobs/stats`);
      dispatch({
        type: SHOW_STATUS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      console.log(error.response);
      logoutUser();
    }
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
    console.log("Clear Filters");
  };
  const changePage = (page) => {
    dispatch({ type: CHNAGE_PAGE, payload: { page } });
  };
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// here we need to have to hook. why hook if hook is not used then we have to import useContext & and
// then bring AppContext from appContext.js file so these two functionalities we are combining to useContext hook.
// whole this thing is to use the content over the value prop of provider.
// for that create a custom hook.
// to use useContext the custom hook should start with use then followd by name.
// so useAppContext is custom hook which returns useContext Hook as HOF/CLOSURE.

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
