import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useSendForgotPasswordLinkMutation } from '../../store/apiSlice/authApiSlice';
import { successToast, errorToast } from '../../helpers/toast';
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const ForgotPasswordComponent = () => {
    const [sendForgotPasswordLink, { isLoading: isLinkSending }] = useSendForgotPasswordLinkMutation();
    const [isLinkSent, setIsLinkSent] = useState(false);

    const formikSendLink = useFormik({
        initialValues: { email: '' },
        onSubmit: async (values) => {
            try {
                await sendForgotPasswordLink({ email: values.email }).unwrap();
                successToast('Reset link sent to your email.');
                setIsLinkSent(true);
            } catch (error) {
                errorToast('Failed to send reset link.');
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
                                {!isLinkSent ?
                                    (<div className="login-form-container">
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
                                    ) : (
                                        <div className="login-form-container">
                                            <div className="login-register-form">
                                                <h4>Reset Link Sent</h4>
                                                <p>Please check your email for the password reset link.</p>
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