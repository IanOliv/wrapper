import { Area, AreaW, ColumnContainer, DeckContainer, List, ListItem } from './styled';

function Item() {
  // const [conversation, setConversation] = useState(messages);
  // const textRef = useRef<HTMLTextAreaElement>(null);
  // const [wrapperSession, { addSession }] = useWrapperSessionState();

  // Login form state
  // const [login, setLogin] = useState({ username: '', password: '' });
  // const [error, setError] = useState('');

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setLogin({ ...login, [e.target.name]: e.target.value });
  // };

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Simple validation
  //   if (!login.username || !login.password) {
  //     setError('Please enter both username and password.');
  //     return;
  //   }
  //   setError('');
  //   // TODO: Add authentication logic here
  //   alert(`Logged in as ${login.username}`);
  //   console.log('Login:', login);
  //   doLogin(login.username, login.password)
  //     // .then((token) =>
  //   // TODO: Call your login function here
  //   // TODO: For example: to the postgrest api to authenticate the user with a JWT token
  //   // TODO: then save the token in the session state
  //   // TODO: and finally redirect the user to the home page
  //   // TODO: doLogin(login.username, login.password)
  //   // addSession({ } as WrapperSession);

  // };

  return (
    <DeckContainer>
      <Area></Area>
      <ColumnContainer>
        <AreaW>
          <List>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
            <ListItem>teste</ListItem>
          </List>
        </AreaW>
        <br />
        <br />
        <AreaW></AreaW>
      </ColumnContainer>
    </DeckContainer>
  );
}

export default Item;
