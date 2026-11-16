import React, { useEffect } from 'react';
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, socialLogin } from '../../State/Authentication/Action';

const GoogleIcon = () => (
    <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

const FacebookIcon = () => (
    <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const initialValues = { fullName: "", email: "", password: "", role: "ROLE_CUSTOMER" };

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Vui lòng nhập họ tên"),
    email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập Email"),
    password: Yup.string().min(6, "Mật khẩu từ 6 ký tự").required("Vui lòng nhập mật khẩu"),
    role: Yup.string().required("Vui lòng chọn vai trò")
});

export const RegisterForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);

    useEffect(() => {
        // Đọc hash params từ URL sau khi được Google / Facebook redirect về
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.replace("#", "?"));
            const idToken = params.get("id_token");
            const accessToken = params.get("access_token");

            if (idToken) {
                dispatch(socialLogin({ provider: "google", token: idToken, navigate }));
                window.location.hash = "";
            } else if (accessToken) {
                dispatch(socialLogin({ provider: "facebook", token: accessToken, navigate }));
                window.location.hash = "";
            }
        }
    }, [dispatch, navigate]);

    const handleSocialLogin = (provider) => {
        const clientID = provider === "google" 
            ? localStorage.getItem("GOOGLE_CLIENT_ID") 
            : localStorage.getItem("FACEBOOK_APP_ID");
            
        if (!clientID) {
            const useDemo = window.confirm(
                `Bạn chưa cấu hình ${provider === "google" ? "Google Client ID" : "Facebook App ID"}.\n\n` +
                `Bấm [OK] để đăng ký nhanh bằng tài khoản test ở chế độ DEMO.\n` +
                `Bấm [Cancel] để điền Token thực tế.`
            );
            
            if (useDemo) {
                const demoEmail = `demo_${provider}_${Math.floor(Math.random() * 10000)}@gmail.com`;
                const demoName = `User Demo ${provider.toUpperCase()}`;
                const demoToken = `demo:${demoEmail}:${demoName}`;
                dispatch(socialLogin({ provider, token: demoToken, navigate }));
            } else {
                const token = window.prompt(`Vui lòng nhập Token ${provider === "google" ? "IdToken" : "AccessToken"} của bạn:`);
                if (token) {
                    dispatch(socialLogin({ provider, token, navigate }));
                }
            }
            return;
        }

        if (provider === "google") {
            const redirectUri = "http://localhost:5173/account/register";
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=token%20id_token&scope=openid%20profile%20email`;
        } else {
            const redirectUri = "http://localhost:5173/account/register";
            window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=token&scope=email,public_profile`;
        }
    };

    const handleSubmit = (values) => {
        // Gửi lệnh đăng ký lên Redux
        dispatch(registerUser({ userData: values, navigate }));
    };

    return (
        <div className="space-y-5">
            <Typography variant="h5" className="text-center font-semibold text-gray-800">
                Đăng Ký Tài Khoản
            </Typography>

            {auth.error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {typeof auth.error === 'string' && auth.error.toLowerCase().includes("email is already used")
                        ? "Email này đã được sử dụng với tài khoản khác. Vui lòng chọn email khác!"
                        : (typeof auth.error === 'string' ? auth.error : "Đăng ký thất bại. Vui lòng thử lại!")}
                </Alert>
            )}
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ touched, errors, setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <Field as={TextField} name="fullName" label="Họ và tên" fullWidth variant="outlined" error={touched.fullName && Boolean(errors.fullName)} helperText={<ErrorMessage name="fullName" />} />
                        <Field as={TextField} name="email" label="Email" fullWidth variant="outlined" error={touched.email && Boolean(errors.email)} helperText={<ErrorMessage name="email" />} />
                        <Field as={TextField} name="password" label="Password" type="password" fullWidth variant="outlined" error={touched.password && Boolean(errors.password)} helperText={<ErrorMessage name="password" />} />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="role-select">Role</InputLabel>
                            <Select labelId="role-select" value={values.role} onChange={(e) => setFieldValue("role", e.target.value)} label="Role">
                                <MenuItem value="ROLE_CUSTOMER">Khách hàng</MenuItem>
                                <MenuItem value="ROLE_RESTAURANT_OWNER">Chủ nhà hàng</MenuItem>
                            </Select>
                        </FormControl>
                        <Button fullWidth variant="contained" type="submit" color="primary" sx={{ py: 1.5 }}>
                            Đăng ký
                        </Button>
                    </Form>
                )}
            </Formik>

            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm font-semibold">Hoặc đăng ký bằng</span>
                <div className="flex-1 border-t border-gray-300" />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin("google")}
                    sx={{
                        color: '#ea4335',
                        borderColor: 'rgba(234, 67, 53, 0.3)',
                        textTransform: 'none',
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        '&:hover': {
                            borderColor: '#ea4335',
                            bgcolor: 'rgba(234, 67, 53, 0.05)'
                        }
                    }}
                >
                    <GoogleIcon /> Google
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin("facebook")}
                    sx={{
                        color: '#1877f2',
                        borderColor: 'rgba(24, 119, 242, 0.3)',
                        textTransform: 'none',
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        '&:hover': {
                            borderColor: '#1877f2',
                            bgcolor: 'rgba(24, 119, 242, 0.05)'
                        }
                    }}
                >
                    <FacebookIcon /> Facebook
                </Button>
            </div>

            <Typography variant="body2" className="text-center text-gray-600 mt-4">
                Đã có tài khoản?{" "}
                <span onClick={() => navigate("/account/login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">
                    Đăng nhập tại đây
                </span>
            </Typography>
        </div>
    );
};