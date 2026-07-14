import { TeamType } from '@prisma/client';
import { randomUUID } from 'crypto';

interface CreateTeamProps {
  name: string;
  ownerId: string;
  type?: TeamType;
}

export class Team {
  readonly id: string;
  name: string;
  type: TeamType;

  readonly ownerId: string;
  readonly createdAt: Date;

  updatedAt: Date;

  private constructor(props: Team) {
    Object.assign(this, props);
  }

  static create(props: CreateTeamProps): Team {
    const now = new Date();

    return new Team({
      id: randomUUID(),
      name: props.name,
      type: props.type ?? TeamType.Free,
      ownerId: props.ownerId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
