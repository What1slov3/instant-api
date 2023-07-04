// import { createURLtoFile, constructDTO } from '../../common';

// export class PermissionsDTO {
//   constructor(data: any) {
//     Object.keys(data).forEach((key) => (this[key] = data[key]));
//   }

//   get() {
//     return constructDTO<this, keyof Exclude<IChannel, 'updatedAt'>>(
//       this,
//       ['_id', 'name', 'icon', 'members', 'ownerId', 'chatGroups', 'createdAt', 'systemChatId', 'banner'],
//       {
//         mutate: {
//           icon: createURLtoFile,
//           banner: createURLtoFile,
//         },
//       },
//     );
//   }


// }
