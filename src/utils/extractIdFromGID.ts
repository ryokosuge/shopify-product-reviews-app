export const extractIdFromGID = (gid: string) => {
  return gid.split("/").pop();
};
