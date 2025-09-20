import { Routes, Route, Navigate } from "react-router-dom";
import Organizer from "../pages/organizer";
import Participant from "../pages/participant";
import Home from "../pages/home";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="join/:eventId/:token" element={<Participant />} />
          <Route path="organizer/admin" element={<Organizer />} />
        </Route>
      </Routes>
    </>
  );
};
