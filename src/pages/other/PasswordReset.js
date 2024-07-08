import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForgotPasswordResetMutation } from '../../store/apiSlice/authApiSlice';
import { successToast, errorToast } from '../../helpers/toast';
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const PasswordReset = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [forgotPasswordReset, { isLoading }] = useForgotPasswordResetMutation();
    
    const [uid, setUid] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const uidParam = query.get('uid');
        const tokenParam = query.get('token');
        if (uidParam && tokenParam) {
            setUid(uidParam);
            setToken(tokenParam);
        } else {
            errorToast('Invalid or missing token. Please request a new password reset.');
            navigate('/forgot-password');
        }
    }, [location, navigate]);

    const formik = useFormik({
        initialValues: { new_password: '', re_new_password: '' },
        onSubmit: async (values) => {
            try {
                await forgotPasswordReset({ uid, token, new_password: values.new_password, re_new_password: values.re_new_password }).unwrap();
                successToast('Password reset successful.');
                navigate('/login'); // Redirect to the login page
            } catch (error) {
                errorToast('Failed to reset password.');
                console.log(error);
            }
        },
    });

    return (
        <LayoutOne headerTop="visible">
            <SEO titleTemplate="Reset Password" />
            <Breadcrumb pages={[{ label: "Home", path: process.env.PUBLIC_URL + "/" }, { label: "Reset Password" }]} />
            <div className="login-register-area pt-100 pb-100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 col-md-12 ms-auto me-auto">
                            <div className="login-register-wrapper">
                                <div className="login-form-container">
                                    <div className="login-register-form">
                                        <h4>Reset Password</h4>
                                        <form onSubmit={formik.handleSubmit}>
                                            <input
                                                type="password"
                                                placeholder="New Password"
                                                name="new_password"
                                                onChange={formik.handleChange}
                                                value={formik.values.new_password}
                                            />
                                            <input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                name="re_new_password"
                                                onChange={formik.handleChange}
                                                value={formik.values.re_new_password}
                                            />
                                            <div className="button-box">
                                                <button type="submit" disabled={isLoading}>
                                                    <span>Reset Password</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutOne>
    );
};

export default PasswordReset;
