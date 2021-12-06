import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

export default function ApplicationPage() {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  if (!sessionUser) history.push("/");
  return <div>Application</div>;
}
