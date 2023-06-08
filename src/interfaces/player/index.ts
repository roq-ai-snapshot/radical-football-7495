import { PlayerProfileInterface } from 'interfaces/player-profile';
import { UserInterface } from 'interfaces/user';
import { AcademyInterface } from 'interfaces/academy';
import { CoachInterface } from 'interfaces/coach';
import { GetQueryInterface } from 'interfaces';

export interface PlayerInterface {
  id?: string;
  name: string;
  status: string;
  user_id: string;
  academy_id: string;
  coach_id: string;
  created_at?: Date;
  updated_at?: Date;
  player_profile?: PlayerProfileInterface[];
  user?: UserInterface;
  academy?: AcademyInterface;
  coach?: CoachInterface;
  _count?: {
    player_profile?: number;
  };
}

export interface PlayerGetQueryInterface extends GetQueryInterface {
  filter: {
    id?: string;
    name?: string;
    status?: string;
    user_id?: string;
    academy_id?: string;
    coach_id?: string;
  };
}
