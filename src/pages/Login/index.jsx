import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../components/Snackbar/context';
import Loading from '../../components/Loading';
import { 
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Typography,
    Container
} from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { request } from '../../utils/fetch';
import { translate } from '../../utils/translations';
import './Login.scss';
import unigemLogo from '../../assets/images/unigem.svg';

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [, setSnackbar] = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.username || !user.password) {
            setSnackbar({
                show: true,
                message: translate('please_enter_credentials'),
                className: 'error',
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await request('users/login', {
                method: 'POST',
                body: user,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response && response.token) {
                window.localStorage.setItem('token', response.token);
                setSnackbar({
                    show: true,
                    message: translate('login_successful'),
                    className: 'success',
                });
                navigate('/', { replace: true });
            } else {
                throw new Error('Token no recibido');
            }
        } catch (error) {
            console.error('Login error:', error);
            setSnackbar({
                show: true,
                message: translate(error.message ? 'server_error' : 'invalid_credentials'),
                className: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box className="login-container">
            {isLoading && <Loading />}
            <Container maxWidth="sm">
                <Card elevation={8} sx={{ 
                    p: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <CardContent>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 3
                        }}>
                            <Box sx={{ width: '80%', maxWidth: 300 }}>
                                <img
                                    src="https://unigem.co/wp-content/uploads/2014/09/cropped-cropped-logo-unigem.png"
                                    alt='unigem-logo'
                                    style={{ 
                                        width: '100%', 
                                        height: 'auto',
                                        filter: 'brightness(0) saturate(100%) invert(19%) sepia(96%) saturate(2252%) hue-rotate(201deg) brightness(94%) contrast(106%)',
                                        WebkitFilter: 'brightness(0) saturate(100%) invert(19%) sepia(96%) saturate(2252%) hue-rotate(201deg) brightness(94%) contrast(106%)'
                                    }}
                                />
                            </Box>
                            
                            <Typography variant="h5" component="h1" color="primary" textAlign="center">
                                {translate('login')}
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label={translate('username')}
                                    placeholder={translate('id_document')}
                                    value={user.username}
                                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="primary" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    sx={{
                                        '& .MuiInputBase-input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px white inset',
                                            WebkitTextFillColor: 'inherit'
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label={translate('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    value={user.password}
                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    required
                                    sx={{
                                        '& .MuiInputBase-input:-webkit-autofill': {
                                            WebkitBoxShadow: '0 0 0 1000px white inset',
                                            WebkitTextFillColor: 'inherit'
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {translate('login')}
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;
