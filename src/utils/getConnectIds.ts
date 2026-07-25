export const getConnectIds = (ids?: number[]) => {
  return (ids ?? []).map((id) => ({ id }));
};


