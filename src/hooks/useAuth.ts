import { useAppDispatch, useAppSelector } from "../store/Store";
import { _signIn, _signOut } from "../store/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserModel from "../network/models/UserModel.ts";

export default function useAuth() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const navigate = useNavigate();

  function signOut() {
    dispatch(_signOut());
  }

  function signIn(user: UserModel) {
    dispatch(_signIn(user));
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user]);

  return {
    user,
    signIn,
    signOut
  };
}
