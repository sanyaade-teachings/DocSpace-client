import { request } from "../client";
import {
  checkFilterInstance,
  decodeDisplayName,
  toUrlParams,
} from "../../utils";
import { FolderType } from "../../constants";
import RoomsFilter from "./filter";

export function getRooms(filter, signal) {
  let params;

  if (filter) {
    checkFilterInstance(filter, RoomsFilter);

    params = `?${filter.toApiUrlParams()}`;
  }

  const options = {
    method: "get",
    url: `/files/rooms${params}`,
    signal,
  };

  return request(options).then((res) => {
    res.files = decodeDisplayName(res.files);
    res.folders = decodeDisplayName(res.folders);

    if (res.current.rootFolderType === FolderType.Archive) {
      res.folders.forEach((room) => {
        room.isArchive = true;
      });
    }

    return res;
  });
}

export function getRoomInfo(id) {
  const options = {
    method: "get",
    url: `/files/rooms/${id}`,
  };

  return request(options).then((res) => {
    if (res.rootFolderType === FolderType.Archive) res.isArchive = true;

    return res;
  });
}

const fakeMembers = [
  {
    access: 1,
    sharedTo: {
      firstName: "Administrator",
      lastName: "",
      userName: "administrator",
      email: "a.g.safronov@gmail.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2021-03-09T13:52:55.0000000+04:00",
      avatarMax:
        "/storage/userPhotos/root/66faa6e4-f133-11ea-b126-00ffeec8b4ef_size_200-200.png?hash=860962073",
      avatarMedium:
        "/storage/userPhotos/root/66faa6e4-f133-11ea-b126-00ffeec8b4ef_size_48-48.png?hash=860962073",
      avatar:
        "/storage/userPhotos/root/66faa6e4-f133-11ea-b126-00ffeec8b4ef_size_82-82.png?hash=860962073",
      isAdmin: true,
      isRoomAdmin: false,
      isLDAP: false,
      listAdminModules: ["files", "people"],
      isOwner: true,
      isVisitor: false,
      isCollaborator: false,
      cultureName: "en-GB",
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "66faa6e4-f133-11ea-b126-00ffeec8b4ef",
      displayName: "Administrator ",
      avatarSmall:
        "/storage/userPhotos/root/66faa6e4-f133-11ea-b126-00ffeec8b4ef_size_32-32.png?hash=860962073",
      profileUrl: "http://192.168.1.52/accounts/view/administrator",
      hasAvatar: true,
    },
    isLocked: false,
    isOwner: true,
    canEditAccess: false,
  },
  {
    access: 9,
    sharedTo: {
      firstName: "power",
      lastName: "user",
      userName: "power",
      email: "power@user.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=623719658",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=623719658",
      avatar: "/static/images/default_user_photo_size_82-82.png?hash=623719658",
      isAdmin: false,
      isRoomAdmin: true,
      isLDAP: false,
      isOwner: false,
      isVisitor: false,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "39f9a74c-4a51-4aa3-8a61-728a43e1dc9a",
      displayName: "power user",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=623719658",
      profileUrl: "http://192.168.1.52/accounts/view/power",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 9,
    sharedTo: {
      firstName: "room",
      lastName: "admin",
      userName: "room",
      email: "room@admin.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1176199534",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1176199534",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1176199534",
      isAdmin: false,
      isRoomAdmin: true,
      isLDAP: false,
      isOwner: false,
      isVisitor: false,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "84b4158b-2218-4b83-855c-d979ef992428",
      displayName: "room admin",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1176199534",
      profileUrl: "http://192.168.1.52/accounts/view/room",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 10,
    sharedTo: {
      firstName: "editor",
      lastName: "user",
      userName: "editor",
      email: "editor@user.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1219197546",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1219197546",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1219197546",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "86e0af2c-b4a6-41b8-b342-f25c5133512f",
      displayName: "editor user",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1219197546",
      profileUrl: "http://192.168.1.52/accounts/view/editor",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 7,
    sharedTo: {
      firstName: "Form",
      lastName: "Filter",
      userName: "form",
      email: "form@filter.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1440170602",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1440170602",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1440170602",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "52ea1221-9acd-4710-99cd-561c5b5226ef",
      displayName: "Form Filter",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1440170602",
      profileUrl: "http://192.168.1.52/accounts/view/form",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 5,
    sharedTo: {
      firstName: "reviewer",
      lastName: "user",
      userName: "reviewer",
      email: "reviewer@user.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=2052692074",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=2052692074",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=2052692074",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "7f52496c-a92c-4c7d-b39c-f871321d09ee",
      displayName: "reviewer user",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=2052692074",
      profileUrl: "http://192.168.1.52/accounts/view/reviewer",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 6,
    sharedTo: {
      firstName: "commenter",
      lastName: "user",
      userName: "commenter",
      email: "commenter@user.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=620132588",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=620132588",
      avatar: "/static/images/default_user_photo_size_82-82.png?hash=620132588",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "cb3671b0-fee9-4b04-aa83-5174d21ce775",
      displayName: "commenter user",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=620132588",
      profileUrl: "http://192.168.1.52/accounts/view/commenter",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 2,
    sharedTo: {
      firstName: "viewer",
      lastName: "user",
      userName: "viewer",
      email: "viewer@user.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=863416812",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=863416812",
      avatar: "/static/images/default_user_photo_size_82-82.png?hash=863416812",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "77a95065-fe52-4a95-969d-299f4ee375fc",
      displayName: "viewer user",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=863416812",
      profileUrl: "http://192.168.1.52/accounts/view/viewer",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 2,
    sharedTo: {
      firstName: "mono",
      lastName: "mail",
      userName: "mono.mail.4test",
      email: "mono.mail.4test@gmail.com",
      status: 1,
      activationStatus: 0,
      department: "",
      workFrom: "2023-09-26T04:00:00.0000000+04:00",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=404357738",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=404357738",
      avatar: "/static/images/default_user_photo_size_82-82.png?hash=404357738",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "a225c164-56cc-4885-9355-2b8eda42f9d4",
      displayName: "mono mail",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=404357738",
      profileUrl: "http://192.168.1.52/accounts/view/mono.mail.4test",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 11,
    sharedTo: {
      firstName: "",
      lastName: "",
      userName: "power.user",
      email: "power.user@waiting.com",
      status: 1,
      activationStatus: 2,
      department: "",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1329472237",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1329472237",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1329472237",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: false,
      isCollaborator: true,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "e1d4e8b0-1748-4342-8d4c-d3a6778bb3cb",
      displayName: "power.user@waiting.com",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1329472237",
      profileUrl: "http://192.168.1.52/accounts/view/power.user",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 10,
    sharedTo: {
      firstName: "",
      lastName: "",
      userName: "editor1",
      email: "editor@waiting.com",
      status: 1,
      activationStatus: 2,
      department: "",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1329472237",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1329472237",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1329472237",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "a640eec3-6fce-44f4-901c-14cb272a6e9e",
      displayName: "editor@waiting.com",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1329472237",
      profileUrl: "http://192.168.1.52/accounts/view/editor1",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 2,
    sharedTo: {
      firstName: "",
      lastName: "",
      userName: "room.admin",
      email: "room.admin@waiting.com",
      status: 1,
      activationStatus: 2,
      department: "",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1329472237",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1329472237",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1329472237",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "3b178e6f-03b8-44d1-8eae-ed9ef5c6aae9",
      displayName: "room.admin@waiting.com",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1329472237",
      profileUrl: "http://192.168.1.52/accounts/view/room.admin",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
  {
    access: 2,
    sharedTo: {
      firstName: "",
      lastName: "",
      userName: "waiting",
      email: "waiting@viewer.com",
      status: 1,
      activationStatus: 2,
      department: "",
      avatarMax:
        "/static/images/default_user_photo_size_200-200.png?hash=1329472237",
      avatarMedium:
        "/static/images/default_user_photo_size_48-48.png?hash=1329472237",
      avatar:
        "/static/images/default_user_photo_size_82-82.png?hash=1329472237",
      isAdmin: false,
      isRoomAdmin: false,
      isLDAP: false,
      isOwner: false,
      isVisitor: true,
      isCollaborator: false,
      mobilePhoneActivationStatus: 0,
      isSSO: false,
      quotaLimit: 0,
      usedSpace: 0,
      id: "712f9b2a-751e-4a28-a53f-2fcc504db2e0",
      displayName: "waiting@viewer.com",
      avatarSmall:
        "/static/images/default_user_photo_size_32-32.png?hash=1329472237",
      profileUrl: "http://192.168.1.52/accounts/view/waiting",
      hasAvatar: false,
    },
    isLocked: false,
    isOwner: false,
    canEditAccess: true,
  },
];

const getRoomMembersFake = async (delay = 200) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const list = [];

        for (let index = 0; index < 100; index++) {
          var item =
            fakeMembers[Math.floor(Math.random() * fakeMembers.length)];
          const randomId =
            item.sharedTo.id + Math.floor(Math.random() * 10000).toString();
          item = {
            ...item,
            sharedTo: { ...item.sharedTo, id: randomId },
          };

          list.push(item);
        }

        const response = {
          items: list,
          count: list.length,
          total: 10000,
          links: [
            {
              href: "http://192.168.1.52/api/2.0/files/rooms/6/share?startIndex=0&count=100&filterType=0",
              action: "GET",
            },
          ],
          status: 0,
          statusCode: 200,
        };
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    }, delay);
  });

  return promise;
};

export function getRoomMembers(id, filter) {
  let params = "";
  const str = toUrlParams(filter);

  if (str) {
    params = `?${str}`;
  }

  const options = {
    method: "get",
    url: `/files/rooms/${id}/share${params}`,
  };

  return getRoomMembersFake(100);

  // return request(options).then((res) => {
  //   return res;
  // });
}

const getFakeStatuses = (ids) => {
  if (!ids) return;

  const statuses = [
    {
      isOnline: true,
      statusText: "InRoom",
      lastSeen: "2022-09-18T16:24:51.0000000+02:00",
    },
    {
      isOnline: false,
      statusText: null,
      lastSeen: "2022-09-18T16:24:51.0000000+02:00",
    },
    {
      isOnline: true,
      statusText: "Contract",
      lastSeen: "2022-09-18T16:24:51.0000000+02:00",
    },
    {
      isOnline: true,
      statusText: "Diploma",
      lastSeen: "2022-09-18T16:24:51.0000000+02:00",
    },
    {
      isOnline: false,
      statusText: null,
      lastSeen: "2022-09-29T11:24:51.0000000+02:00",
    },
    {
      isOnline: true,
      statusText: "New document",
      lastSeen: "2022-09-29T11:24:51.0000000+02:00",
    },
    {
      isOnline: true,
      statusText: "New form template",
      lastSeen: "2022-09-29T11:24:51.0000000+02:00",
    },
  ];

  return ids.map((id) => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    return { id, ...randomStatus };
  });
};

export async function getRoomMembersStatuses(ids, delay = 500) {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(getFakeStatuses(ids)), delay);
  });

  return promise;
}

export function updateRoomMemberRole(id, data) {
  const options = {
    method: "put",
    url: `/files/rooms/${id}/share`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function getHistory(module, id, signal = null) {
  const options = {
    method: "get",
    url: `/feed/filter?module=${module}&withRelated=true&id=${id}`,
    signal,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function getRoomHistory(id) {
  const options = {
    method: "get",
    url: `/feed/filter?module=rooms&withRelated=true&id=${id}`,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function getFileHistory(id) {
  const options = {
    method: "get",
    url: `/feed/filter?module=files&withRelated=true&id=${id}`,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function createRoom(data) {
  const options = { method: "post", url: `/files/rooms`, data };

  return request(options).then((res) => {
    return res;
  });
}

export function createRoomInThirdpary(id, data) {
  const options = {
    method: "post",
    url: `/files/rooms/thirdparty/${id}`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function editRoom(id, data) {
  const options = { method: "put", url: `/files/rooms/${id}`, data };

  return request(options).then((res) => {
    return res;
  });
}

export function pinRoom(id) {
  const options = { method: "put", url: `/files/rooms/${id}/pin` };

  return request(options).then((res) => {
    return res;
  });
}

export function unpinRoom(id) {
  const options = { method: "put", url: `/files/rooms/${id}/unpin` };

  return request(options).then((res) => {
    return res;
  });
}

export function deleteRoom(id, deleteAfter = false) {
  const data = { deleteAfter };

  const options = {
    method: "delete",
    url: `/files/rooms/${id}`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function archiveRoom(id, deleteAfter = false) {
  const data = { deleteAfter };

  const options = {
    method: "put",
    url: `/files/rooms/${id}/archive`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function unarchiveRoom(id) {
  const data = { deleteAfter: false };
  const options = {
    method: "put",
    url: `/files/rooms/${id}/unarchive`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function createTag(name) {
  const data = { name };
  const options = {
    method: "post",
    url: "/files/tags",
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function addTagsToRoom(id, tagArray) {
  const data = { names: tagArray };
  const options = {
    method: "put",
    url: `/files/rooms/${id}/tags`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function removeTagsFromRoom(id, tagArray) {
  const data = { names: tagArray };
  const options = {
    method: "delete",
    url: `/files/rooms/${id}/tags`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function getTags() {
  const options = {
    method: "get",
    url: "/files/tags",
  };

  return request(options).then((res) => {
    return res;
  });
}

export function uploadRoomLogo(data) {
  const options = {
    method: "post",
    url: `/files/logos`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function addLogoToRoom(id, data) {
  const options = {
    method: "post",
    url: `/files/rooms/${id}/logo`,
    data,
  };

  return request(options).then((res) => {
    return res;
  });
}

export function removeLogoFromRoom(id) {
  const options = {
    method: "delete",
    url: `/files/rooms/${id}/logo`,
  };

  return request(options).then((res) => {
    return res;
  });
}

export const setInvitationLinks = async (roomId, linkId, title, access) => {
  const options = {
    method: "put",
    url: `/files/rooms/${roomId}/links`,
    data: {
      linkId,
      title,
      access,
    },
  };

  const res = await request(options);

  return res;
};

export const resendEmailInvitations = async (id, resendAll = true) => {
  const options = {
    method: "post",
    url: `/files/rooms/${id}/resend`,
    data: {
      resendAll,
    },
  };

  const res = await request(options);

  return res;
};

//// 1 (Invitation link)
export const getRoomSecurityInfo = async (id) => {
  const options = {
    method: "get",
    url: `/files/rooms/${id}/share?filterType=1`,
  };

  const res = await request(options);

  return res;
};

export const setRoomSecurity = async (id, data) => {
  const options = {
    method: "put",
    url: `/files/rooms/${id}/share`,
    data,
  };

  const res = await request(options);

  return res;
};

export const acceptInvitationByLink = async () => {
  const options = {
    method: "post",
    url: `/files/rooms/accept`,
  };

  return await request(options);
};

export function editExternalLink(
  roomId,
  linkId,
  title,
  access,
  expirationDate,
  linkType,
  password,
  disabled,
  denyDownload
) {
  return request({
    method: "put",

    url: `/files/rooms/${roomId}/links`,
    data: {
      linkId,
      title,
      access,
      expirationDate,
      linkType,
      password,
      disabled,
      denyDownload,
    },
  });
}

export function getExternalLinks(roomId, type) {
  const linkType = `?type=${type}`;

  return request({
    method: "get",
    url: `files/rooms/${roomId}/links${linkType}`,
  });
}

export function validatePublicRoomKey(key) {
  return request({
    method: "get",
    url: `files/share/${key}`,
  });
}

export function validatePublicRoomPassword(key, passwordHash) {
  return request({
    method: "post",
    url: `files/share/${key}/password`,
    data: { password: passwordHash },
  });
}
