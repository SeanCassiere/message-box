import { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import * as yup from "yup";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import AddQrDialog from "../LoginScreen/AddQrDialog";

import { client } from "../../shared/api/client";
import { formatErrorsToFormik } from "../../shared/util/errorsToFormik";
import { MESSAGES } from "../../shared/util/messages";
import { TwoFactorSecretPair } from "../../shared/interfaces/AccessToken.interfaces";

const codeLoginSchema = yup.object().shape({
  code: yup.string().required("Code is required"),
});

interface IFetchTokenDetails {
  userId: string | null;
  secret: TwoFactorSecretPair | null;
}

const Reset2FAScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [responseData, setResponseData] = useState<IFetchTokenDetails>({ userId: null, secret: null });

  const getReset2faDetailsWithToken = useCallback(async () => {
    try {
      const response = await client.get(`/Users/Reset2FA/${token}`);
      setResponseData(response.data);

      enqueueSnackbar("Verified request", { variant: "info", autoHideDuration: 3000 });
    } catch (error) {
      enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
      navigate("/login");
    }

    setIsLoading(false);
  }, [enqueueSnackbar, navigate, token]);

  useEffect(() => {
    if (!token || token === "") {
      navigate("/");
    }

    getReset2faDetailsWithToken();
  }, [token, navigate, getReset2faDetailsWithToken]);

  // using the 2fa challenge code to verify the 2fa settings
  const formikVerify2fa = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: codeLoginSchema,
    onSubmit: (values, { setSubmitting, setErrors, resetForm }) => {
      client
        .post("/Authentication/2FA/Code/ConfirmUser", { userId: responseData?.userId, code: values.code, token: token })
        .then((res) => {
          if (res.status === 400) {
            setErrors(formatErrorsToFormik(res.data.errors));
          }
          if (res.status === 200) {
            resetForm();
            enqueueSnackbar("Success: Two-factor code reset on your account.", { variant: "success" });
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(MESSAGES.NETWORK_UNAVAILABLE, { variant: "error" });
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  if (!isLoading && responseData.secret === null) <Navigate to="/" />;

  return (
    <>
      <Backdrop sx={{ color: "#fff" }} open={isLoading} onClick={() => ({})}>
        <CircularProgress color="primary" size={50} thickness={4} />
      </Backdrop>
      <AddQrDialog
        showDialog={!isLoading}
        handleClose={() => {
          navigate("/");
        }}
        formik={formikVerify2fa}
        secret={responseData?.secret}
      />
    </>
  );
};

export default Reset2FAScreen;
