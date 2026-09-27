import { useCallback, useEffect, useState } from 'react';

import { useWrapperSessionState } from '@/store/session';
import { fetchProfile } from '@/utils/auth/api';
import type { ProfileResponse } from '@/utils/auth/types';

import { AreaW, ColumnContainer, DeckContainer, List, ListItem } from './styled';

function Item() {
  const [wrapperSession] = useWrapperSessionState();

  const [profile, setProfile] = useState<ProfileResponse['profile'] | null>(null);
  const [error, setError] = useState('');

  const getAsyncProfile = useCallback(async () => {
    if (!wrapperSession.token) return;

    try {
      const { profile: profileData } = await fetchProfile(wrapperSession.token);
      setProfile(profileData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    }
  }, [wrapperSession.token]);

  useEffect(() => {
    getAsyncProfile();
  }, [getAsyncProfile]);

  return (
    <DeckContainer>
      <ColumnContainer>
        <AreaW>
          <List>
            {profile && (
              <ListItem key={profile.subject}>
                {profile.username}
                {wrapperSession.profiles?.length ? ` · ${wrapperSession.profiles.join(', ')}` : ''}
              </ListItem>
            )}
            {error && <ListItem>{error}</ListItem>}
          </List>
        </AreaW>
        <br />
        <br />
        <AreaW>
          <button onClick={() => getAsyncProfile()}>Get Profile</button>
        </AreaW>
      </ColumnContainer>
    </DeckContainer>
  );
}

export default Item;
