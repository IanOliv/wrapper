import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useWrapperSessionState } from '@/store/session';
import { WrapperSession } from '@/store/session/types';
import { doLogin } from '@/utils/micro/api';

import { Area, DeckContainer } from './styled';
import { InputButton } from './styled';

function Item() {
  const [wrapperSession, { addSession }] = useWrapperSessionState();
  const navigate = useNavigate();

  // Login form state
  const [login, setLogin] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!login.username || !login.password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Call your login function here
      const token = await doLogin(login.username, login.password);
      addSession({ token } as WrapperSession);
      setError('');
    } catch (err) {
      setError('Invalid username or password.');
    }
  };

  if (wrapperSession.token) {
    // Redirect to home page if already logged in
    navigate('/Profile');
    // return null;
  }

  return (
    <DeckContainer>
      <Area
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxWidth: 300,
            width: '100%',
            alignItems: 'center',
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            color: '#222',
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#222' }}>Login Form</h2>
          <label htmlFor="username" style={{ alignSelf: 'flex-start', color: '#222' }}>
            Username or Email:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={login.username}
            onChange={handleChange}
            autoComplete="username"
            style={{ width: '100%', color: '#222' }}
          />
          <label htmlFor="password" style={{ alignSelf: 'flex-start', color: '#222' }}>
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={login.password}
            onChange={handleChange}
            autoComplete="current-password"
            style={{ width: '100%', color: '#222' }}
          />
          {error && <div style={{ color: 'red', width: '100%' }}>{error}</div>}
          <InputButton type="submit" style={{ width: '100%' }}>
            Login
          </InputButton>
        </form>
      </Area>
    </DeckContainer>
  );
}
// function Register() {
//   const [register, setRegister] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setRegister({ ...register, [e.target.name]: e.target.value });
//   };

//   const handleRegister = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!register.username || !register.password) {
//       setError('Please enter both username and password.');
//       setSuccess('');
//       return;
//     }
//     setError('');
//     setSuccess('Registration successful! (Simulated)');
//     // TODO: Implement registration logic here
//   };

//   const handleProviderSignUp = (provider: string) => {
//     // TODO: Implement provider sign up logic
//     alert(`Sign up with ${provider} (not implemented)`);
//   };

//   return (
//     <DeckContainer>
//       <Area style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
//         <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, width: '100%', alignItems: 'center', background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#222' }}>
//           <h2 style={{ marginBottom: '1rem', color: '#222' }}>Sign Up</h2>
//           <label htmlFor="register-username" style={{ alignSelf: 'flex-start', color: '#222' }}>Username or Email:</label>
//           <input
//             id="register-username"
//             name="username"
//             type="text"
//             value={register.username}
//             onChange={handleChange}
//             autoComplete="username"
//             style={{ width: '100%', color: '#222' }}
//           />
//           <label htmlFor="register-password" style={{ alignSelf: 'flex-start', color: '#222' }}>Password:</label>
//           <input
//             id="register-password"
//             name="password"
//             type="password"
//             value={register.password}
//             onChange={handleChange}
//             autoComplete="new-password"
//             style={{ width: '100%', color: '#222' }}
//           />
//           {error && <div style={{ color: 'red', width: '100%' }}>{error}</div>}
//           {success && <div style={{ color: 'green', width: '100%' }}>{success}</div>}
//           <InputButton type="submit" style={{ width: '100%' }}>Sign Up</InputButton>
//           <div style={{ width: '100%', textAlign: 'center', margin: '1rem 0', color: '#888' }}>or sign up with</div>
//           <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
//             <InputButton type="button" style={{ background: '#4285F4', color: '#fff', flex: 1 }} onClick={() => handleProviderSignUp('Google')}>
//               Google
//             </InputButton>
//             <InputButton type="button" style={{ background: '#333', color: '#fff', flex: 1 }} onClick={() => handleProviderSignUp('GitHub')}>
//               GitHub
//             </InputButton>
//             <InputButton type="button" style={{ background: '#E1306C', color: '#fff', flex: 1 }} onClick={() => handleProviderSignUp('Instagram')}>
//               Instagram
//             </InputButton>
//           </div>
//         </form>
//       </Area>
//     </DeckContainer>
//   );
// }

// export default Register ;
export default Item;
