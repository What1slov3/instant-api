import { RemoteSocket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export type RemoteSocketUser = RemoteSocket<DefaultEventsMap, any> & { userId: string };
