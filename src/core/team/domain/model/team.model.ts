import { randomUUID } from 'crypto';

interface CreateTeamProps {
  name: string;
  ownerId: string;
}

interface TeamProps {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Team {
  private constructor(private props: TeamProps) {}

  static create(props: CreateTeamProps): Team {
    const now = new Date();

    return new Team({
      id: randomUUID(),
      name: props.name,
      ownerId: props.ownerId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: TeamProps): Team {
    return new Team(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
