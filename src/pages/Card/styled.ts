import { styled } from '@mui/system';

interface iProps {
    size?: string;
    backgroundColor?: string;
    columns?: number;
    width?: number;
}
const Container = styled('div')<iProps>(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
}));
// const C = styled('div')<iProps>(() => ({
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
// }));

export { Container };