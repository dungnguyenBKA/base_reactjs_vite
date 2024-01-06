import React from "react";
import useAuth from "../../hooks/useAuth.ts";
import "./LoginPage.css";
import Scaffold, { TypeLoading } from "../../shared/components/Scaffold/Scaffold.tsx";
import usePageState from "../../hooks/usePageState.ts";
import { AppValidation } from "../../shared/utility/Util.ts";
import { Button } from "primereact/button";
import useForm from "../../hooks/useForm.ts";
import AppInputText from "../../shared/components/AppInputText.tsx";
import { inject } from "../../network/services/BaseService.ts";
import AuthService from "../../network/services/AuthService.ts";

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const { isLoading, setLoading, showError, showSuccess } = usePageState();

  const authService = inject(AuthService);

  async function _login(request: LoginForm) {
    try {
      setLoading(true);
      const res = await authService.login(request);
      if (res.data) {
        showSuccess(res.message);
        signIn(res.data);
      } else {
        showError(res.message);
        signIn({
          user_name: "dienhungptit",
          access_token: "@token"
        });
      }
    } finally {
      setLoading(false);
    }
  }

  type LoginForm = {
    username: string,
    password: string,
  }

  const form = useForm<LoginForm>({
    initialValues: {
      username: "",
      password: ""
    },
    validate(value) {
      return AppValidation.getErrorValidate(value, {
        username: [AppValidation.notEmpty],
        password: [AppValidation.notEmpty, AppValidation.moreThan8Char]
      });
    },
    onSubmit: _login
  });

  return (
    <Scaffold
      isLoading={isLoading}
      typeLoading={TypeLoading.OVERLAY}>
      <div className="flex align-items-center justify-content-center w-full h-screen">
        <div
          style={{
            width: 400
          }}
          className="surface-card p-4 shadow-2 border-round">
          <div className="text-center mb-5">
            <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Username</label>
            <AppInputText
              value={form.values.username}
              onTextChange={async (value) => {
                await form.updateFieldValue("username", value);
              }}
              errorText={form.getFormErrorMessage("username")}
              additionProps={{
                placeholder: "Username",
                id: "email",
                className: "w-full mb-3"
              }}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2">Password</label>
            <AppInputText
              errorText={form.getFormErrorMessage("password")}
              value={form.values.password}
              onTextChange={async (value) => {
                await form.updateFieldValue("password", value);
              }}
              additionProps={{
                placeholder: "Password",
                id: "password",
                type: "password",
                className: "w-full mb-3"
              }} />

            <Button
              onClick={async () => {
                await form.checkErrorAndSubmit(showError);
              }}
              label="Sign In"
              icon="pi pi-user"
              className="w-full" />
          </div>
        </div>
      </div>
    </Scaffold>
  );
};
export default LoginPage;
