import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
    useSendForgotPasswordLinkMutation,
    useForgotPasswordResetMutation,
} from '../../store/apiSlice/authApiSlice';
import { successToast, errorToast } from '../../helpers/toast';
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/user-slice';

const ForgotPasswordComponent = () => {
    const dispatch = useDispatch();
    const [sendForgotPasswordLink, { isLoading: isLinkSending }] = useSendForgotPasswordLinkMutation();
    const [forgotPasswordReset, { isLoading: isPasswordChanging }] = useForgotPasswordResetMutation();
    const [isLinkSent, setIsLinkSent] = useState(false);

    const formikSendLink = useFormik({
        initialValues: { email: '' },
        onSubmit: async (values) => {
            try {
                const response = await sendForgotPasswordLink({ email: values.email }).unwrap();
                successToast('Reset link sent to your email.');
                setIsLinkSent(true);
                dispatch(setUser({ id: response.user_id }));
            } catch (error) {
                errorToast('Failed to send reset link.');
                console.log(error);
            }
        },
    });

    const formikResetPassword = useFormik({
        initialValues: { uid: '', token: '', new_password: '', re_new_password: '' },
        onSubmit: async (values) => {
            try {
                await forgotPasswordReset(values).unwrap();
                successToast('Password reset successful.');
            } catch (error) {
                errorToast('Failed to reset password.');
                console.log(error);
            }
        },
    });

    return (
        <LayoutOne headerTop="visible">
            <SEO titleTemplate="Forgot Password" />
            <Breadcrumb pages={[{ label: "Home", path: process.env.PUBLIC_URL + "/" }, { label: "Forgot Password" }]} />
            <div className="login-register-area pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-12 ms-auto me-auto">
                            <div className="login-register-wrapper">
                                {isLinkSent ? (
                                    <div className="login-form-container">
                                        <div className="login-register-form">
                                            <h4>Reset Password</h4>
                                            <form onSubmit={formikResetPassword.handleSubmit}>
                                                <input
                                                    type="text"
                                                    placeholder="User ID"
                                                    name="uid"
                                                    onChange={formikResetPassword.handleChange}
                                                    value={formikResetPassword.values.uid}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Reset Token"
                                                    name="token"
                                                    onChange={formikResetPassword.handleChange}
                                                    value={formikResetPassword.values.token}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    name="new_password"
                                                    onChange={formikResetPassword.handleChange}
                                                    value={formikResetPassword.values.new_password}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    name="re_new_password"
                                                    onChange={formikResetPassword.handleChange}
                                                    value={formikResetPassword.values.re_new_password}
                                                />
                                                <div className="button-box">
                                                    <button type="submit" disabled={isPasswordChanging}>
                                                        <span>Reset Password</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="login-form-container">
                                        <div className="login-register-form">
                                            <h4>Forgot Password</h4>
                                            <form onSubmit={formikSendLink.handleSubmit}>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    name="email"
                                                    onChange={formikSendLink.handleChange}
                                                    value={formikSendLink.values.email}
                                                />
                                                <div className="button-box">
                                                    <button type="submit" disabled={isLinkSending}>
                                                        <span>Send Reset Link</span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutOne>
    );
};

export default ForgotPasswordComponent;
