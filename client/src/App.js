import { Landing, Register, Error, ProtectedRoute } from "./pages/Index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AddJob,
  AllJobs,
  Profile,
  Stats,
  SharedLayout,
} from "./pages/DashBoard/index.js";
// give a name , here no need of react. name of import.element
//then give backticks and its js feature.so what style we use that is applied to button. so that is
//kept in backticks
// we should install vs-code styled components to inlcude this feature
//vscode-styled-components

// now when we are discussing about layout we want to build nested pages
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* dashboard import is removed and that component is replayed by nested pages */}
        {/* <Route path="/" element={<DashBoard />} /> */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* if the below , if we removed the path and keep index stats will become default page on opening */}
          {/* <Route path="stats" element={<Stats />} /> */}
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// with syled component we can acheive no name collision as it get unique class
// we can even wrap enter component inside this styled component
