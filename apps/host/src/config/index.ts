import isMobile from '@/utils/is-mobile';

import type { Notifications } from './types';

// One name everywhere: Wrapper. Not WRAPPER, not wrpp.
const title = 'Wrapper';

const tagline = 'One shell. Every module.';

const email = 'auther-email@gmail.com';

const repository = 'https://github.com/IanOliv/wrapper';

// The errors are the one place the tone gets personality — the user is already
// annoyed, and a joke that lands beats an apology that doesn't.
const messages = {
  app: {
    crash: {
      title: 'This module came off its hinges.',
      body: 'The rest of the shell is fine. Try it again, or go back to the feed.',
      options: {
        retry: 'Retry',
        home: 'Back to Cards',
      },
    },
  },
  loader: {
    fail: "This module didn't finish loading.",
    body: 'Usually a network hiccup between you and the chunk. Retrying often works.',
  },
  images: {
    failed: 'something went wrong during image loading :(',
  },
  404: {
    title: 'Nothing lives at this address.',
    body: 'The route is not one of ours. Here is everywhere that is:',
  },
};

const dateFormat = 'MMMM DD, YYYY';

// Bottom anchor, 6s, 3 on mobile / 4 on desktop. These are the right numbers.
const notifications: Notifications = {
  options: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    autoHideDuration: 6000,
  },
  maxSnack: isMobile ? 3 : 4,
};

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'A shell that hosts every module.',
};

export {
  loader,
  notifications,
  dateFormat,
  messages,
  repository,
  email,
  title,
  tagline,
  defaultMetaTags,
};
